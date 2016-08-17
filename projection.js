var MongoClient = require('mongodb').MongoClient,
   assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

   assert.equal(err, null);
   console.log("Successfully connected to MongoDB.");

   var query = {"category_code": "biotech"},
       projection = {"name": 1, "category_code": 1, "_id": 0};


   var cursor = db.collection('companies').find(query);
   /*
      the current best practice in the nodejs driver is to chained a call to 'project' onto our cursor,
      this call to 'project' sets a field projection for the query, this call not force a request for
      retrieve documents from the database as does the 'forEach' method, rather it adds some additional
      detail to the query representation maintained by our 'cursor', as we discuss before, there are a number
      of cursor methods we can chain together to fully express the operation we wish execute against our database
    */
   cursor.project(projection);

   cursor.forEach(
      function (doc) {
         //console.log(doc.name + " is a " + doc.category_code + " company.");
         console.log(doc);
      },
      function (err) {
         assert.equal(err, null);
         return db.close();
      }
   );

});
