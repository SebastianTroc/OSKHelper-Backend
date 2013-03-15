var Instructor = require('../models/instructors');

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
  	 res.render('instructor_single', { title: 'Instruktor '+instructor.name, data: {instructor: instructor} });
	})
};


/*
 * GET instructor add form.
 */
exports.editExisting = function(req, res) {
    Instructor.findOne( { _id: req.params.id }, function(err, instructor) {
     res.render('instructor_form', { title: 'OSK Helper', data: {instructor: instructor} });
    })
};


/*
 * POST new instructor.
 */
exports.createNew = function(req, res) {
	new Instructor(
    {
		name: "Czesiek",
        photo: "String",
        login: "czesiek",
        password: "secret",
        coordinates: {
        	lat: 123,
        	lng: 22
        },
        phone: "+48 123 456 789",
        email: "mail@domena.pl"
    }).save();
};


/*
 * POST new generated instructor.
 */
exports.createNewWithFaker = function(req, res) {
    var Faker           = require('./Faker')
    ,   randomNumber    = Faker.random.number
    ,   randomName      = 'Plac #' + randomNumber
    ,   randomAddress   = Faker.Address.streetAddress
    ,   randomLogin     = 'user' + randomNumber
    ,   randomPassword  = 'pass' + randomNumber;

    new Place(
    {
        name: randomName,
        photo: 'plac1.jpg',
        login: randomLogin,
        password: randomPassword,
        // coordinates: {
        //     lat: 123,
        //     lng: 22
        // },
        phone: "+48 123 456 789",
        email: "mail@domena.pl"
    }).save();
};