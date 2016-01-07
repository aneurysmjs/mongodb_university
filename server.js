var express = require('express'),
   MongoClient = require('mongodb').MongoClient,
   utils = require('util'),
   engines = require('consolidate'),
   app = express();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// we need a live connection before do anything.
MongoClient.connect('mongodb://localhost:27017/olgah', function (error, db) {

   utils.log('connection successful');

   app.get('/', function (req, res) {
      //res.send('what\'s up');
      db.collection('students').find({}).toArray(function (err, docs) {
         // render takes the name of the template file in the views folder
         res.render('students', { 'students': docs});
      });
   });

   // guarantees that any routes not handled by our application will be handle by this callback
   app.use(function (req, res) {
      res.sendStatus(404);
   });

   var server = app.listen(3001, function () {
      var port = server.address().port;
      utils.log('listening on port %', port)
   });

});


