var express = require('express'),
    utils = require('util'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//app.use(express.bodyParser); // is no longer bundled with Express and must be installed separately.
// will parse the body of the request and populate req.body so we can access it in our route
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(app.router); //deprecated

function errorHandler(err, req, res, next) {
   utils.log(err.message);
   utils.log(err.stack);
   res.status(500);
   res.render('error.html', {error: err});
}

app.use(errorHandler);

app.get('/', function (req, res, next) {
   res.render('toolPicker', { 'tools': ['webstorm', 'sublime text', 'brackets', 'visual studio']});
});

app.post('/tools', function (req, res, next) {
   // next is a function passed in by express along with the request and response objects.
   // one of the things we can do with it is to handle errors.
   var tool = req.body.tool;
   if (typeof tool === 'undefined') {
      // by passing and Error object and what Express does at this point is it tries to handle the error.
      // the way it does it is by looking for any error handling middleware that we may have registered 'app.use(errorHandler);'
      next(Error('Select a Tool!'));
   } else {
      res.send('Your tool is: ' + tool);
   }
});

var server = app.listen(3000, function() {
   var port = server.address().port;
   console.log('Express server listening on port %s.', port);
});


