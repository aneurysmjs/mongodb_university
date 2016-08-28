var MongoClient = require('mongodb').MongoClient,
   commandLineArgs = require('command-line-args'),
   assert = require('assert');

var options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

   assert.equal(err, null);
   console.log("Successfully connected to MongoDB.");

   var query = queryDocument(options);

   var projection = {
      "_id": 0,
      "name": 1,
      "founded_year": 1,
      "number_of_employees": 1,
      "ipo.valuation_amount": 1
   };

   var cursor = db.collection('companies').find(query, projection);
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
      query.number_of_employees = { "$gte": options.employees };
   }

   /*
      the 'ipo' parameter allows to specify "yes" or "no" as the value for the parameters to
      build our query
    */
   if ("ipo" in options) {
      if (options.ipo === "yes") {
         query["ipo.valuation_amount"] = {"$exists": true, "$ne": null}; // is a field that exists and is not equal to 'null'
      } else if (options.ipo === "no") {
         /*
            only documents when there is not "evaluation_amount" specified and that can happen in two ways, either the value
            for the field can be set to null or it can simply not exist
          */
         query["ipo.valuation_amount"] = null;
      }
   }

   return query;

}


function commandLineOptions() {

   var cli = commandLineArgs([
      { name: "firstYear", alias: "f", type: Number },
      { name: "lastYear", alias: "l", type: Number },
      { name: "employees", alias: "e", type: Number },
      { name: "ipo", alias: "i", type: String }
   ]);

   var options = cli.parse();

   if (!(("firstYear" in options) && ("lastYear" in options))) {
      console.log(cli.getUsage({
         title: "Usage",
         description: "The first two options below are required. The rest are optional."
      }));
      process.exit();
   }

   return options;

}


