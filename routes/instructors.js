var Instructor = require('../models/instructors');
var Place = require('../models/places');

/*
* GET instructors listing.
*/
exports.findAll = function(req, res) {
    Instructor.find(function(err, instructors) {
        res.render('instructors_list', { title: 'Lista instruktorów', data: {instructors: instructors} });
    })
};


/*
* GET instructor details.
*/
exports.findById = function(req, res) {
    Instructor.findOne( { _id: req.params.id }, function(err, instructor) {
        var flash = {};
        if (req.query.flash) {
            if (req.query.flash == 'success') {
                flash['type'] = 'success';
                flash['message'] = "Edycja zakończona sukcesem.";
            } else if (req.query.flash == 'error') {
                flash['type'] = 'error';
                flash['message'] = "Podczas edycji wystąpił błąd.";
            }
        } else {
            flash = false;
        }
        res.render('instructor_single', { title: 'Instruktor '+instructor.name, data: {instructor: instructor} });
    })
};


/*
* GET instructor add form.
*/
exports.editExisting = function(req, res) {
    Instructor.findOne( { _id: req.params.id }, function(err, instructor) {
        res.render('instructors_form', { title: 'Edycja instruktora: '+instructor.name, data: {instructor: instructor} });
    })
};


/*
* GET instructor add form.
*/
exports.createNew = function(req, res) {
    res.render('instructors_form', { title: 'Nowy instruktor', data: false });
};


/*
 * POST new instructor.
 */
exports.addNew = function(req, res) {

    console.log(req.body);
    console.log(req.files);

    var name        = req.body.name.trim()
    ,   login       = req.body.login.trim()
    ,   password    = req.body.password.trim()
    ,   phone       = req.body.phone.trim()
    ,   email       = req.body.email.trim();

    new Instructor(
    {
        name: name,
        login: login,
        password: password,
        phone: phone,
        email: email
    }).save();

    res.redirect('/instructors');
};


/*
* POST new generated instructor.
*/
exports.createNewWithFaker = function(req, res) {
    var Faker       = require('Faker')
    var name        = Faker.Name.firstName() + ' ' + Faker.Name.lastName()
    ,   login       = Faker.Internet.userName().toLowerCase()
    ,   password    = 'secret' // hardcode'owane haslo, zebym znal haslo kazdego usera w celu testow
    ,   phone       = Faker.PhoneNumber.phoneNumber()
    ,   email       = Faker.Internet.email().toLowerCase()

    instructorData = {
        name: name,
        login: login,
        password: password,
        phone: phone,
        email: email
    }

    Instructor.create(instructorData, function(err, instructor){
        if (!err) {
            console.log("Dodano instruktora id:"+instructor.id);
            res.redirect('/instructors/'+instructor._id+'?flash=success')
        } else {
            console.log(err);
            req.method = 'GET';
            res.redirect('/instructors/'+instructor._id+'?flash=error');
        }
    });
};


/*
 * PUT updated instructor.
 */
exports.updateInstructor = function(req, res) {

    Instructor.findById( req.params.id, function(err, instructor) {

        var name        = req.body.name.trim()
        ,   login       = req.body.login.trim()
        ,   password    = req.body.password.trim()
        ,   phone    = req.body.phone.trim()
        ,   email    = req.body.email.trim();

        instructor.name = name;
        instructor.login = login;
        if (password != '') {
            instructor.password = password;
        }
        instructor.phone = phone;
        instructor.email = email;

        instructor.save(function(err){
            if (!err) {
                console.log("Zaktualizowano plac id:"+instructor._id);
                // req.method = 'GET';
                // res.redirect('/instructors/'+instructor._id,
                //     {
                //         title: instructor.name,
                //         flash: {
                //             type: 'success',
                //             message: "Edycja zakończona sukcesem."
                //         }
                //     }
                // )

                res.redirect('/instructors/'+instructor._id+'?flash=success')
                // res.redirect('back');
            } else {
                console.log(err);
                req.method = 'GET';
                res.redirect('/instructors/'+instructor._id+'?flash=error'
                    //'/instructors/'+instructor._id,
                    // {
                    //     title: instructor.name,
                    //     flash: {
                    //         type: "error",
                    //         message : "Podczas edycji wystąpił błąd: "+err
                    //     }
                    // }
                );
            }
        })

        // res.render('instructor_single', { title: instructor.name, data: {instructor: instructor} });
    })

};


/*
 * DELETE instructor add form.
 */
exports.deleteItem = function(req, res) {
    Instructor.remove({ _id: req.params.id }, function(err){
        if (!err) {
            console.log("Usunieto instruktora.");
            res.redirect('/instructors');
        } else {
            console.log("Wystapil blad przy usuwaniu instruktora: "+err);
            res.redirect('back');
        }
    })
};


