var Place = require('../models/places');

/*
 * GET places listing.
 */
exports.findAll = function(req, res) {
	Place.find(function(err, places) {
  	 res.render('places_list', { title: 'Lista placów', data: {places: places} });
	})
};


/*
 * GET place details.
 */
exports.findById = function(req, res) {
	Place.findOne( { _id: req.params.id }, function(err, place) {
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
        res.render('place_single', { title: place.name, data: {place: place, flash: flash} });
	})
};


/*
 * GET place add form.
 */
exports.editExisting = function(req, res) {
    Place.findOne( { _id: req.params.id }, function(err, place) {
     res.render('places_form', { title: 'Edycja placu: '+place.name, data: {place: place} });
    })
};


/*
 * GET place add form.
 */
exports.createNew = function(req, res) {
    res.render('places_form', { title: 'Nowy plac', data: false });
};


/*
 * POST new place.
 */
exports.addNew = function(req, res) {

    console.log(req.body);
    console.log(req.files);

    var name = req.body.name.trim()
    ,   address = req.body.address.trim();

    var fs = require('fs');
    var tmp_path = req.files.photo.path;
    var target_path = './public/assets/' + req.files.photo.name;
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });

        var photo = req.files.photo.filename;

        new Place(
        {
            name: name,
            address: address,
            photo: photo,
            occupated: false
        }).save();
    });

    res.redirect('/places');

};


/*
 * POST new place.
 */
exports.createNewWithFaker = function(req, res) {
    var Faker           = require('Faker')
    ,   randomNumber    = Faker.Helpers.randomNumber(100)
    ,   randomName      = 'Plac #' + randomNumber
    ,   randomAddress   = Faker.Address.streetAddress();

    place.name = req.body.name;
    place.address = req.body.address;
    place.photo = req.body.photo;
    place.save(function(err, place){
        if (!err) {
            console.log("Dodano plac id:"+place._id);
            res.redirect('/places/'+place._id+'?flash=success')
        } else {
            console.log(err);
            req.method = 'GET';
            res.redirect('/places/'+place._id+'?flash=error');
        }
    });
};


/*
 * PUT updated place.
 */
exports.updatePlace = function(req, res) {

    Place.findById( req.params.id, function(err, place) {
        place.name = req.body.name;
        place.address = req.body.address;
        place.photo = req.body.photo;

        place.save(function(err){
            if (!err) {
                console.log("Zaktualizowano plac id:"+place._id);
                // req.method = 'GET';
                // res.redirect('/places/'+place._id,
                //     {
                //         title: place.name,
                //         flash: {
                //             type: 'success',
                //             message: "Edycja zakończona sukcesem."
                //         }
                //     }
                // )

                res.redirect('/places/'+place._id+'?flash=success')
                // res.redirect('back');
            } else {
                console.log(err);
                req.method = 'GET';
                res.redirect('/places/'+place._id+'?flash=error'
                    //'/places/'+place._id,
                    // {
                    //     title: place.name,
                    //     flash: {
                    //         type: "error",
                    //         message : "Podczas edycji wystąpił błąd: "+err
                    //     }
                    // }
                );
            }
        })

        // res.render('place_single', { title: place.name, data: {place: place} });
    })

};


/*
 * DELETE place add form.
 */
exports.deleteItem = function(req, res) {
    Place.remove({ _id: req.params.id }, function(err){
        if (!err) {
            console.log("Usunieto plac.");
            res.redirect('/places');
        } else {
            console.log("Wystapil blad przy usuwaniu placu: "+err);
            res.redirect('back');
        }
    })
};



/* * * * * * * * * * * * * * * * * * * * * * * * 
 *                JSON API
 * * * * * * * * * * * * * * * * * * * * * * * */

 /*
 * GET all places JSON
 */
 exports.serveAllJson = function(req, res) {
    Place.find(function(err, placesJSON) {
     res.jsonp({'places':placesJSON});
    })
};


 /*
 * GET one place JSON
 */
 exports.serveOneJson = function(req, res) {
    Place.findOne( { _id: req.params.id }, function(err, placeJSON) {
        res.jsonp({'place':placeJSON});
    });
};