var MongoClient = require('mongodb').MongoClient,
   assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

   assert.equal(err, null);
   console.log("Successfully connected to MongoDB.");

   var query = {"category_code": "biotech"};

   /*
     note that we have a call to the 'find' method but we're not passing the callback, remember that 'find'
     returns a 'cursor', and here we're assigning the value returned into a variable.

     chaining a call to the 'toArray' method onto a call to 'find' consumes the 'cursor' and gives us an array
     of documents we can work with.
    */
   var cursor = db.collection('companies').find(query);

   /*
   code written this way, instead of consuming everything at once and pulling it all onto memory,  we streaming
   the data to our application, 'find' can create the cursor immediately because it doesn't actually make a request
   to the database until we try to use some of the documents will provide, the point of the cursor is just to
   describe our query.

   cursor objects provides a 'forEach' method, know that this isn't the 'forEach' method on arrays.
   the first argument is a callback that iterates through the documents, the second argument is what to do when
   cursor is exhausted or in the case of error.

   the difference is that we're streaming the documents into the application as we need them.

   when the 'cursor' requests documents from mongodb triggered by 'toArray' or 'forEach', the response from the
   database system ins't necessarily the entire result set, consider the situation when you have a massive database,
   and you don't actually want to return the whole set of documents all at once, what actually happens is when
   the cursor go off and get some documents, mongodb will return a batch of documents up to a certain batch size,
   so when the 'cursor' gets back the first batch of results it can actually start passing documents to the callback
   handed on 'forEach', once that initial batch runs out, the 'cursor' can make another request to get the next batch
   and once that batch runs out can make another request and so on until it reaches the end of the result set.

   this works very nicely with 'forEach' because we can process documents as they come in, in successful batches.
   contrast with 'toArray' when the callback doesn't get called until all documents has been retrieved from the database
   and the entire array is built, which means you're not getting any advantage from the fact that the driver and database system
   are working together to batch results to your application.

   batching is meant to provide some efficiency in terms of memory overhead and execution time.
    */
   cursor.forEach(
      function (doc) {
         console.log(doc.name + " is a " + doc.category_code + " company.");
      },
      function (err) {
         assert.equal(err, null);
         return db.close();
      }
   );

});
