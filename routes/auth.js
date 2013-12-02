var Instructors = require('../models/instructors.js');

/*
 * POST login credentials for API
 */
exports.login = function(req, res){

  checkCredentials(req.query.username, req.query.password, function(loginInstance){
    if ( loginInstance.success ) {
      res.jsonp(
        {
          //'przeslany login':req.query.username,
          //'przeslane haslo':req.query.password,
          'instructor_id': loginInstance.instructor_id
        }
      );
      console.log('success');
    } else {
      //console.log('Próba zalogowania nieistniejącego instruktora: ' + req.query.username);
      console.log('21'); console.log(loginInstance.error.message);
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
          'instructor_id': ""+user._id
        }
        console.log('43'); console.log(response);
      } else {
        console.log('Haslo sie nie zgadza.');
        response = {
          'error': {
            'type': 'badPass',
            'message': 'Haslo się nie zgadza.'
          }
        }
        console.log('52'); console.log(response);
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
      console.log('62'); console.log(response);
      response.error.errorDetails = err;
    }

    return callback(response);
  });
}