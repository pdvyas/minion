
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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


var redisStore = require('redis');
var client =  redisStore.createClient();
var i = 10000000;

app.post("/shorten-url", function(request, response) {
  var url = request.body.url;
  console.log(">>>>>"+url);
  i += Math.ceil(Math.random()*10);
  var hash = i.toString(36);
  client.set(hash, url, function() {
  response.send(hash);
  });
   //response.send("output");
});

app.get(/^\/[0-9a-z]{5,13}$/, function(request, response) {
  var hash = request.url.substring(1);
  //console.log(hash);
  client.get(hash, function(error, url) {
    //console.log(url);
    response.redirect(url);
  });
});

app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
