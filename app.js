
/**
 * Module dependencies.
 */

var http 		     = require('http')
	,	fs 			     = require("fs")
	, express      = require('express')
	, verbose      = process.env.NODE_ENV != 'test'
  , routes 	     = require('./routes')
  , auth         = require('./routes/auth')
  , instructors  = require('./routes/instructors')
  , places       = require('./routes/places')
  , path 		     = require('path')
	, config 	     = JSON.parse(fs.readFileSync("config.json"))
  , mongoose     = require('mongoose')

var app = express();

// connect to Mongo when the app initializes
mongoose.connect('mongodb://'+ config.mongodb.user +':'+ config.mongodb.password +'@'+ config.mongodb.host +':'+ config.mongodb.port +'/'+ config.mongodb.dbname);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Polaczono z MongoDB');
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser('2`hW`cyciEc:]q=I-BBiWGD`t0_#E@r/A6*i*gE$S8VI~nztCqK)u.|&4d7sF-tQ'));
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: './tmp'
  }));
  app.use(express.methodOverride());
  app.use(express.session({ secret: '&Xi=ukq>zd3*wR*R+94J*g}+3B6#?gkn/29d~XNgI8z=<(;z(;[|u@lld]B[tr8X' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
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
        // if (verbose) console.log('%s %s', key, route);
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
    get: routes.index // Displays homepage
  },

  // Instructors Controller
  '/instructors': {
    get: instructors.findAll, // Displays all instructors list
    post: instructors.addNew, // Saves new instructor to the database
    '/:id': {
      get: instructors.findById, // Displays details of one instructor selected by ID
      post: instructors.updateInstructor, // Updates data of one instructor selected by ID
    },
    '_new': {
      get: instructors.createNew // Displays form for adding new instructor
    },
    '_edit/:id': {
      get: instructors.editExisting // Displays form for editing selected instructor
    },
    '_delete/:id': {
      get: instructors.deleteItem // Removes instructor selected by ID
    },
    '_generate': {
      get: instructors.createNewWithFaker // Adds new instructor with generated fake data
    }
  },

  // Places Controller
  '/places': {
    get: places.findAll, // Displays all places list
    post: places.addNew, // Saves new place to the database
    '/:id': {
      get: places.findById, // Displays details of one place selected by ID
      post: places.updatePlace // Updates data of one place selected by ID
    },
    '_new': {
      get: places.createNew // Displays form for adding new place
    },
    '_edit/:id': {
      get: places.editExisting // Displays form for editing selected place
    },
    '_delete/:id': {
      get: places.deleteItem // Removes place selected by ID
    },
    '_generate': {
      get: places.createNewWithFaker // Adds new place with generated fake data
    }
    ,'_test': {
      get: places.testBase64 // 
    }
  },

  // JSON API Controller
  '/api': {
    '/places': {
      get: places.serveAllPlacesJson, // Responses with list of all places in JSON format
      '/:id': {
        get: places.serveOnePlaceJson, // Responses with dat of concrete place selected by ID in JSON format
        post: places.occupyPlace // Marks selected place as occupied
      }
    },
    '/instructors': {
      get: instructors.serveAllInstructorsJson, // Responses with list of all instructors in JSON format
      '/:id': {
        get: instructors.serveOneInstructorJson, // Responses with dat of concrete instructors selected by ID in JSON format
      }
    },
    '/login': {
      get: auth.login // Authenticates mobile client before allows to exchange other data
    },
    '/validate_existance': {
      get: auth.validateExistance
    }
  }

});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
var io = require('socket.io').listen(server);

// AppFog doesn't support WebSocket, cause the configuration for XHR
io.configure(
  'development', function(){ 
    io.set('transports', ['xhr-polling']);
  }
);

// Socket.IO events
io.sockets.on('connection', function (socket) {

  socket.on('placeIsOccupied', function (data) {
    places.occupyPlace(data.place, data.instructor, function(){
      io.sockets.emit('disablePlace', { place: data.place });  
    });
  });

  socket.on('placeIsFree', function (data) {
    places.releasePlace(data.place, function(){
      io.sockets.emit('enablePlace', { place: data.place });  
    });
  });

});