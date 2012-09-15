
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , socket = require('socket.io');

var app = module.exports = express.createServer()
  , io = socket.listen(app);

// Configuration

app.configure(function(){
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.set("view options", {layout: false});

  // make a custom html template
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.logger('dev'));
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

io.sockets.on('connection', function(client) {
  client.on('offer', function(offer) {
    io.sockets.emit('offer', offer);
    //client.broadcast.emit('offer', offer);
  });

  client.on('answer', function(ans) {
    io.sockets.emit('answer', ans);
    //client.broadcast.emit('answer', ans);
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});