var express = require('express')
,		app 		= express.createServer()
,		mongo 	= require('mongodb')
,		db 			= new mongo.Db('oskhelper', new mongo.Server( 'localhost', 27017, {} ) , {});

// Node odpala ta funkcje, gdy mongo jest juz dostepne do uzycia
db.open(function(){

	db.collection('testCollection', function(err, collection){

		doc = {
			"name" : "MongoDB",
			"type" : "database",
			"count": 1,
			"info" : {
				x: 203,
				y: 102
			}
		};

		collection.insert(doc, function(){
			console.log("wstawilem dane do testowej kolekcji 'testCollection'");
		})

	});

})

app.get('/', function(req, res) {
    res.send('Działa!');
});

app.listen(process.env.VCAP_APP_PORT || 3000);
