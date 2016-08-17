var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// run mongod in different port: mongod --port 27018, default is 27017
MongoClient.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "biotech"};

    db.collection('companies').find(query).toArray(function (err, docs) {

        assert.equal(err, null); // make sure there's no error
        assert.notEqual(docs.length, 0); // make sure that we got more than zero documents
        
        docs.forEach(function (doc) {
            console.log(doc.name + " is a " + doc.category_code + " company.");
        });
        
        db.close();
        
    });

});
