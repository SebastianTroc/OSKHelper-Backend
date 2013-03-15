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
  	 res.render('place_single', { title: place.name, data: {place: place} });
	})
};


/*
 * GET instructor add form.
 */
exports.editExisting = function(req, res) {
    Place.findOne( { _id: req.params.id }, function(err, place) {
     res.render('places_form', { title: 'Edycja placu: '+place.name, data: {place: place} });
    })
};


/*
 * GET instructor add form.
 */
exports.createNew = function(req, res) {
    res.render('places_form', { title: 'Nowy plac', data: false });
};


/*
 * POST new place.
 */
exports.addNew = function(req, res) {

	var Faker           = require('Faker')
    ,   randomName      = 'Plac #' + Faker.random.number()
    ,   randomAddress   = Faker.Address.streetAddress();

    new Place(
    {
        name: randomName,
        address: randomAddress,
        photo: 'plac1.jpg',
        occupated: false
    }).save();

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

    new Place(
    {
        name: randomName,
        address: randomAddress,
        photo: 'plac1.jpg',
        occupated: false
    }).save();

    res.redirect('/places');
};


/*
 * PUT updated place.
 */
exports.updatePlace = function(req, res) {

    console.log(req.body);

    // var Faker           = require('Faker')
    // ,   randomName      = 'Plac #' + Faker.random.number()
    // ,   randomAddress   = Faker.Address.streetAddress();

    // new Place(
    // {
    //     name: randomName,
    //     address: randomAddress,
    //     photo: 'plac1.jpg',
    //     occupated: false
    // }).save();

    res.redirect('/places');

};