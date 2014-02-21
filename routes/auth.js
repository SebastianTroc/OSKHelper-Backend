var Instructors = require('../models/instructors.js');

/*
 * GET the confirmation that server exists
 */
exports.validateExistance = function(req, res){
  // res.send('Server istnieje');
  res.jsonp(
    {
      "exists": true
    }
  );
}

/*
 * POST login credentials for API
 */
exports.login = function(req, res){

  checkCredentials(req.query.username, req.query.password, function(loginInstance){
    if ( loginInstance.success ) {
      res.jsonp(
        {
          'instructor_id': loginInstance.instructor_id,
          'instructor_name': loginInstance.instructor_name
        }
      );
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
