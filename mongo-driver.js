var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    utils = require('util');

MongoClient.connect('mongodb://localhost:27017/olgah', function (error, db) {

   utils.log('connection successful');

   // find documents in students's collection
   db.collection('students').find({}).toArray(function (err, docs) {

      // log the name field for each document
      docs.forEach(function (doc) {
         console.log(doc.name);
      });

      db.close();

   });

   // logs the message of this callback(MongoClient) before the execution of db.collection('students')
   utils.log('called find()');

});