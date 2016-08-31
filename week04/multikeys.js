var MongoClient = require('mongodb').MongoClient,
   assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/multikeys', function (err, db) {

   assert.equal(err, null);
   console.log("Successfully connected to MongoDB.");


   //db.collection('students').createIndex({"teachers": 1});

   /*
   find all the students that have both 0 and 1 in the teachers key
      db.students.find({"teachers": {$all: [0, 1]}});
   */

});
