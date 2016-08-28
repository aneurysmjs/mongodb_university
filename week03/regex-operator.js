var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'),
    assert = require('assert');

var options = commandLineOptions();

/*
 look for two words in succession but they might be separate by a couple of other words
 for example I want to look for "billion valuation" but it's unlikely that this phrase will appear,
 you might see "billion $valuation", you might see a number of ways of expressing this notion of a
 company having a valuation that's measured in billions of dollars or some other currency.
 by using some regular expression syntax, you can specify that you want to see the word "billion"
 followed at some point in the text by the word "valuation" - "billion.*valuation" in between there can be
 any number of characters.

 to be more precise - "billion.+valuation" means there must be at least one character separating the word "billion"
 form the word "valuation"
 */

MongoClient.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

   assert.equal(err, null);
   console.log("Successfully connected to MongoDB.");

   var query = queryDocument(options);
   var projection = projectionDocument(options);

   var cursor = db.collection('companies').find(query);
   cursor.project(projection);

   var numMatches = 0;

   cursor.forEach(function (doc) {
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

   var query = {};

   if ("overview" in options) {
      query.overview = {"$regex": options.overview, "$options": "i"}; // "i" case insensitive
   }

   if ("milestones" in options) {
      /*
       Mongodb creates keys for all elements in array value fields when it stores documents
      */
      query["milestones.source_description"] = {"$regex": options.milestones, "$options": "i"};
   }

   return query;

}

function projectionDocument(options) {

   var projection = {
      "_id": 0,
      "name": 1,
      "founded_year": 1
   };

   if ("overview" in options) {
      projection.overview = 1;
   }

   if ("milestones" in options) {
      projection["milestones.source_description"] = 1;
   }

   return projection;

}

function commandLineOptions() {

   var cli = commandLineArgs([
      {name: "overview", alias: "o", type: String},
      {name: "milestones", alias: "m", type: String}
   ]);

   var options = cli.parse();

   if (Object.keys(options).length < 1) {
      console.log(cli.getUsage({
         title: "Usage",
         description: "You must supply at least one option. See below."
      }));
      process.exit();
   }

   return options;

}