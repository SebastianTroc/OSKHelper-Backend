var Instructors = require('../models/instructors.js');

/*
 * POST login credentials for API
 */
exports.login = function(req, res){
	console.log('logowanie do API:');
	console.log(req.query);

	if ( chceckCredentials(req.query.username, req.query.password) ) {

	} else {
		console.log('Nie ma takiego instruktora: ' + req.query.username);
	}

	res.jsonp(
		{
			'przeslany login':req.query.username,
			'przeslane haslo':req.query.password
		}
	);
};

function chceckCredentials(username, password) {
	Instructors.findOne( { login: username }, function(err, instructor){
    if (!err) {
    	console.log('Instruktor ' + username + ' istnieje.');
      var user = instructor;
      if (user.password === password) {
         return {
      		'success': {
      			'type': 'goodCredentials',
      			'message': 'Pomyslnie zalogowano'
      		}
      	}
      } else {
      	console.log('Haslo sie nie zgadza.');
      	return {
      		'error': {
      			'type': 'badPass',
      			'message': 'Haslo sie nie zgadza.'
      		}
      	}
      }
    } else {
    	console.log('Instruktor ' + username + ' NIE istnieje.');
      return {
      	'error': {
      		'type': 'badUser',
      		'message': 'Nie ma takiego instruktowa.'
      	}
      }
    }
  });
}