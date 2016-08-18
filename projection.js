var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'), // give use a nice way of dealing with arguments pass to our application on the command line
    assert = require('assert');

var options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

   assert.equal(err, null);
   console.log("Successfully connected to MongoDB.");

   var query = queryDocument(options),
       projection = {"_id": 0, "name": 1, "founded_year": 1, "number_of_employees": 1, "crunchbase_url": 1};

   var cursor = db.collection('companies').find(query, projection);
   //cursor.project(projection);
   var numMatches = 0;

   cursor.forEach(
      function (doc) {
         numMatches = numMatches + 1;
         console.log( doc );
      },
      function (err) {
         assert.equal(err, null);
         console.log("Our query was:" + JSON.stringify(query));
         console.log("Matching documents: " + numMatches);
         return db.close();
      }
   );

});

function queryDocument(options) {
   console.log(options);

   var query = {
      "founded_year": {
         "$gte": options.firstYear,
         "$lte": options.lastYear
      }
   };

   if ("employees" in options) {
      query.number_of_employees = {"$gte": options.employees};
   }

   return query;

}

function commandLineOptions() {

   var cli = commandLineArgs([
      {name: "firstYear", alias: "f", type: Number},
      {name: "lastYear",  alias: "l", type: Number},
      {name: "employees", alias: "e", type: Number}
   ]);

   var options = cli.parse(); // will parse everything that we've typed in the command line

   if (!(("firstYear" in options) && ("lastYear" in options))) {
      console.log(cli.getUsage({
         title: 'Usage',
         description: "The first two options are required"
      }));
      process.exit();
   }

   return options;

}
