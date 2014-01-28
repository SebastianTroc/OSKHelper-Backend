var Instructors = require('../models/instructors.js');
var Settings = require('../models/settings.js');

/*
 * POST login credentials for API
 */
exports.login = function(req, res){

  checkCredentials(req.query.username, req.query.password, function(loginInstance){
    if ( loginInstance.success ) {
      getAppChecksum(function(err, checksum){
        if (checksum === undefined) {
          incrementAppChecksum();
        }
        console.log(checksum);
        res.jsonp(
          {
            'instructor_id': loginInstance.instructor_id,
            'instructor_name': loginInstance.instructor_name,
            'checksum': checksum
          }
        );
      });
    } else {
      console.log(loginInstance.error.message);
    }
  });

};


function checkCredentials(username, password, callback) {
  var response = { 'error': { 'type': 'otherError', 'message': 'Nieokreślony błąd' } };

  Instructors.findOne( { login: username }, function(err, instructor){
    if (!err) {
      // console.log('Instruktor ' + username + ' istnieje.');
      var user = instructor;
      if (user.password === password) {
        response = {
          'success': {
            'type': 'goodCredentials',
            'message': 'Pomyslnie zalogowano'
          },
          'instructor_id': ""+user._id,
          'instructor_name': ""+user.name
        }
        console.log(response);
      } else {
        console.log('Haslo sie nie zgadza.');
        response = {
          'error': {
            'type': 'badPass',
            'message': 'Haslo się nie zgadza.'
          }
        }
        console.log(response);
      }
    } else {
      console.log(err);
      console.log('Instruktor ' + username + ' NIE istnieje.');
      response = {
        'error': {
          'type': 'badUser',
          'message': 'Login niepoprawny'
        }
      }
      console.log(response);
      response.error.errorDetails = err;
    }

    return callback(response);
  });
}


function getAppChecksum(callback) {
  Settings.findOne({key: 'checksum'}, function(err, checksum){
    if (!err) {
      var numericChecksum = parseInt(checksum);
      if ( isNaN(numericChecksum) ) {
        console.log('nie jest liczba');
        return setInitChecksum();
      } else {
        callback.call(null, checksum.value);
      };
    } else {
      console.log('Error:');
      console.log(err);
      callback.call(err, checksum.value);
    };
  });
}
exports.getAppChecksum = getAppChecksum;


function incrementAppChecksum(callback) {

  getAppChecksum(function(err, checksum){
    if (!err) {
      if (checksum === undefined) {
        var actualChecksum = '0';
      } else {
        var actualChecksum = checksum;
      }
      var newChecksum = parseInt(actualChecksum) + 1;
    
    } else {
      console.log(err);
    };

    console.log('actualChecksum: ' + actualChecksum);
    console.log('newChecksum: ' + newChecksum);
    Settings.update({ key: 'checksum' }, { value: newChecksum }, { upsert: true }, function (err, numberAffected, raw) {
      if (err) console.log('Error: ' + err);
      console.log('The number of updated documents was %d', numberAffected);
      console.log('The raw response from Mongo was ', raw);
    });
    
    if (callback === 'undefined' ) {
      console.log('wywolanie callback linia 121');
    }

  });

}
exports.incrementAppChecksum = incrementAppChecksum;


function setInitChecksum(callback) {
  console.log('setInitChecksum');
  
  Settings.where({ key: 'checksum' }).setOptions({ upsert: true })
    .update({ value: '1' }, function (err, numberAffected, raw){
      if (err) console.log('Error: ' + err);
      console.log('Initial value for checksum is set for "1".');
      console.log('The raw response from Mongo was: ');
      console.log(raw);
    });
}
exports.setInitChecksum = setInitChecksum;
