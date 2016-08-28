'use strict';

var express = require('express'),
   MongoClient = require('mongodb').MongoClient,
   utils = require('util'),
   engines = require('consolidate'),
   bodyParser = require('body-parser'),
   assert = require('assert'),
   app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// we need a live connection before do anything.
MongoClient.connect('mongodb://localhost:27017/olgah', function (error, db) {

   utils.log('connection successful');

   app.get('/students', function (req, res) {
      db.collection('students').find({}).toArray(function (err, docs) {
         res.render('students', {'students': docs});
      });
   });

   app.post('/students', function (req, res, next) {
      var name = req.body.name,
          last_name = req.body.last_name,
          age = req.body.age,
          profession = req.body.profession;
      if (typeof name === 'undefined') {
         next(Error('Fill the form!'));
      } else {
         db.collection('students').insertOne({
               name: name,
               last_name: last_name,
               age: age,
               profession: profession
            }, function(err, r) {
            assert.equal(null, err);
            console.log('r');
            console.log(r);
            assert.equal(1, r.insertedCount);

            // Insert multiple documents
            /*db.collection('inserts').insertMany([{a:2}, {a:3}], function(err, r) {
               assert.equal(null, err);
               assert.equal(2, r.insertedCount);

               db.close();
            });*/
         });
         res.send('thanks');

      }
   });

   // guarantees that any routes not handled by our application will be handle by this callback
   app.use(function (req, res) {
      res.sendStatus(404);
   });

   var server = app.listen(3001, function () {
      var port = server.address().port;
      utils.log('listening on port %s', port)
   });

});


