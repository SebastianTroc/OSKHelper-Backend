var Instructor = require('../models/instructors');

/*
 * GET instructors listing.
 */
exports.findAll = function(req, res) {
	Instructor.find(function(err, instructors) {
  	res.render('instructors_list', { title: 'Lista instruktorów:', data: {instructors: instructors} });
	})
};


/*
 * GET instructor details.
 */
exports.findById = function(req, res) {
	Instructor.findOne( { _id: req.params.id }, function(err, instructor) {
  	res.render('instructor_single', { title: 'OSK Helper', data: {instructor: instructor} });
	})
};


/*
 * POST new instructor.
 */
exports.addNew = function(req, res) {
	new Instructor({
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