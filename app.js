
/**
 * Module dependencies.
 */

var http 		     = require('http')
	,	fs 			     = require("fs")
	, express      = require('express')
	, verbose      = process.env.NODE_ENV != 'test'
  , routes 	     = require('./routes')
  , instructors  = require('./routes/instructors')
  , path 		     = require('path')
	, config 	     = JSON.parse(fs.readFileSync("config.json"))
  , mongoose     = require('mongoose')
  // ,	mongo 	     = require('mongodb')
	// ,	db 			     = new mongo.Db(config.mongodb.dbname, new mongo.Server( config.mongodb.host, config.mongodb.port, {} ) , {});

var app = express();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/oskhelper');

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
 * Mapping method for router.
 */
app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        if (verbose) console.log('%s %s', key, route);
        app[key](route, a[key]);
        break;
    }
  }
};


/**
 * Routing map.
 */
app.map({
  '/': {
    get: routes.index
  },

  '/instructors': {
  	get: instructors.findAll,
    post: instructors.addNew,
    '/:id': {
      get: instructors.findById,
      put: instructors.updateInstructor,
      delete: instructors.deleteInstructor
    }
  }

});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
