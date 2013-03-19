
/**
 * Module dependencies.
 */

var http 		     = require('http')
	,	fs 			     = require("fs")
	, express      = require('express')
	, verbose      = process.env.NODE_ENV != 'test'
  , routes 	     = require('./routes')
  , instructors  = require('./routes/instructors')
  , places       = require('./routes/places')
  , path 		     = require('path')
	, config 	     = JSON.parse(fs.readFileSync("config.json"))
  , mongoose     = require('mongoose');
  // ,	mongo 	     = require('mongodb')
	// ,	db 			     = new mongo.Db(config.mongodb.dbname, new mongo.Server( config.mongodb.host, config.mongodb.port, {} ) , {});

var app = express();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://'+ config.mongodb.user +':'+ config.mongodb.password +'@'+ config.mongodb.host +':'+ config.mongodb.port +'/'+ config.mongodb.dbname);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('polaczono z mongolab');
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // app.use(express.basicAuth('user', 'pass'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser(
  {
    keepExtensions: true,
    uploadDir: './tmp'
  }
  ));
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
      post: instructors.updateInstructor,
    },
    '_new': {
      get: instructors.createNew
    },
    '_edit/:id': {
      get: instructors.editExisting
    },
    '_delete/:id': {
      get: instructors.deleteItem
    },
    '_generate': {
      get: instructors.createNewWithFaker
    }
  },

  '/places': {
    get: places.findAll,
    post: places.addNew,
    '/:id': {
      get: places.findById,
      post: places.updatePlace
    },
    '_new': {
      get: places.createNew
    },
    '_edit/:id': {
      get: places.editExisting
    },
    '_delete/:id': {
      get: places.deleteItem
    },
    '_generate': {
      get: places.createNewWithFaker
    }
  }

});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
