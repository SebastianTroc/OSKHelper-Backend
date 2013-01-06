
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  ,	mongo 	= require('mongodb')
	,	db 			= new mongo.Db('oskhelper', new mongo.Server( 'localhost', 27017, {} ) , {});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/**
 * MongoDB test.
 */

var dataFromMongoDB;
// Node odpala ta funkcje, gdy mongo jest juz dostepne do uzycia
db.open(function(){

	db.collection('testCollection', function(err, testCollection){

		// doc = {
		// 	"name" : "MongoDB",
		// 	"type" : "database",
		// 	"count": 1,
		// 	"info" : {
		// 		x: 203,
		// 		y: 102
		// 	}
		// };

		// testCollection.insert(doc, function(){
		// 	console.log("wstawilem dane do testowej kolekcji 'testCollection'");
		// });

		testCollection.find({}, function(err, cursor){
			cursor.each(function(err, data){
				if (data != null) {
					dataFromMongoDB = data;
				}
			});
		});

	});

});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/db_test', function(req, res) {
    res.send(dataFromMongoDB);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
