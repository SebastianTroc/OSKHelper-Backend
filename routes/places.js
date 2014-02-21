var mongoose     = require('mongoose')
,   toBase64 = require('to-base64')
,   Place = require('../models/places')
,   instructorSchema = require('../models/instructors');

/*
 * restart occupation data
 */
exports.cleanOccupationData = function(req, res) {
    Place.find(function(err, places) {
        res.render('places_list', { title: 'Lista placów', data: {places: places} });
    });
    Place.update({occupation: {occupied: true}});
};

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
                if (req.query.type == 'added') {
                    flash['message'] = "Pomyślnie dodano plac.";
                } else {
                    flash['message'] = "Edycja zakończona sukcesem.";
                };
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

    // console.log(req.body);
    // console.log(req.files);

    var name = req.body.name.trim()
    ,   address = req.body.address.trim()
    ,   lat = req.body.lat.trim()
    ,   lng = req.body.lng.trim();

    var photo = req.files.photo.filename
    ,   tmp_path = req.files.photo.path
    ,   target_path = './public/assets/' + req.files.photo.name;

    if ( tmp_path !== '' ) {
        moveImage(tmp_path, target_path, function(){

            encodeBase64(target_path, function(result){

                new Place(
                {
                    name: name,
                    address: address,
                    photo: photo,
                    photoBase64: result.encodedImage,
                    coordinates: {
                        lat: lat,
                        lng: lng
                    }
                }).save(function(err, place){
                    if (!err) {
                        console.log("Dodano plac id:"+place._id);
                        res.redirect('/places/'+place._id+'?flash=success&type=added')
                    } else {
                        console.log(err);
                        req.method = 'GET';
                        res.redirect('/places/?flash=error');
                    }
                });
            });
        });
    };

};

var moveImage = function(oldPath, newPath, callback) {
    var fs = require('fs');
    
    fs.rename(oldPath, newPath, function(err) {
        if (err) throw err;
        fs.unlink(oldPath, function() {
            if (err) throw err;
            callback.call();
        });
    });
}

var encodeBase64 = function(target, callback) {
    toBase64(target, function (result) {
        var encodedImage = "data:" + result.contentType + ";base64," + result.base64;

        callback.call(this, {
            encodedImage: encodedImage
        });
    }, function (error) {
        console.error(error);

        callback.call(this, {
            encodedImage: ''
        });
    });
}


exports.testBase64 = function(req, res) {
    var toBase64 = require('to-base64');
    toBase64('./public/assets/plac1.jpg',function (result) {
        console.log(result.base64);
        console.log(result.contentType);
        console.log(result);
        res.writeHead(200, {'Content-Type': 'text/html'});
        var image = "<img src='data:" + result.contentType + ";base64," + result.base64 + "' />"
        res.end(image);
        //res.end(result.contentType + '' + result.base64);
    }, function (error) {
        console.error(error);
        req.method = 'GET';
        res.redirect('/places/?flash=error');
    });
}


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
            res.redirect('/places/'+place._id+'?flash=success&type=added')
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
        place.name = req.body.name.trim();
        place.address = req.body.address.trim();
        place.coordinates.lat = req.body.lat.trim();
        place.coordinates.lng = req.body.lng.trim();

        if (req.files.new_photo.filename !== '') {
            
            var photo = req.files.new_photo.filename
            ,   tmp_path = req.files.new_photo.path
            ,   target_path = './public/assets/' + req.files.new_photo.name;
        
            moveImage(tmp_path, target_path, function(){
                place.photo = req.files.new_photo.name;

                encodeBase64(target_path, function(result){
                    
                    place.photoBase64 = result.encodedImage;

                    place.save(function(err, place){
                        if (!err) {
                            console.log("Dodano plac id:"+place._id);
                            res.redirect('/places/'+place._id+'?flash=success&type=added')
                        } else {
                            console.log(err);
                            req.method = 'GET';
                            res.redirect('/places/?flash=error');
                        }
                    });
                });
            });
        }
    })

};


/*
 * NO-HTTP set places occupation status as occupied
 */
exports.occupyPlace = function(placeID, instructorID, next) {

    Place
        .findOne( { _id : placeID } )
        .populate('occupation')
        .exec(function(err, place) {
            console.log(place.occupation);

            place.occupation.occupied = true;
            place.occupation.who = mongoose.Types.ObjectId(instructorID);

            console.log(place.occupation);
            place.save(function(err){
                if (!err) {
                    console.log("Plac " + place._id + " zajmuje teraz: " + place.occupation.who);
                    next();
                } else {
                    console.log("Problem z zapisaniem zajętości do bazy: " + err);
                    next();
                }
            })

        });
};

/*
 * NO-HTTP set places occupation status as free
 */
exports.releasePlace = function(placeID, next) {

    Place.findById( placeID, function(err, place) {
        console.log(place.occupation);
        place.occupation.occupied = false;
        var who = place.occupation.who;
        place.occupation.who = undefined;

        place.save(function(err){
            if (!err) {
                console.log("Plac " + place._id + " został zwolniony przez: " + who);
                next();
            } else {
                console.log("Problem z zapisaniem zajętości do bazy: " + err);
                next();
            }
            console.log(place.occupation);
        })
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
 exports.serveAllPlacesJson = function(req, res) {
    Place.find(function(err, placesJSON) {
     res.jsonp({'places':placesJSON});
    })
};


 /*
 * GET one place JSON
 */
 exports.serveOnePlaceJson = function(req, res) {
    Place.findOne( { _id: req.params.id }, function(err, placeJSON) {
        res.jsonp({'place':placeJSON});
    });
};
