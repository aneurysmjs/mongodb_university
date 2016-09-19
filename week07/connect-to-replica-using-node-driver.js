/*
 * - first create our three node replica set
 * 
 * mongod --port 30001 --replSet replica_set --dbpath ~/mongodata/db/rs1
 * mongod --port 30002 --replSet replica_set --dbpath ~/mongodata/db/rs2
 * mongod --port 30003 --replSet replica_set --dbpath ~/mongodata/db/rs3
 * 
 * - before we can actually connect we need to configure our replica set
 * 
 * mongo localhost:3001
 *
 * rs.status();
 *   {
 *    "info" : "run rs.initiate(...) if not yet done for the set",
 *    "ok" : 0,
 *    "errmsg" : "no replset config has been received",
 *    "code" : 94
 *   }
 * 
 * rs.initiate();
 *
 * - add the other nodes
 *   
 * rs.add("<nameOfTheMachine/hostname>:3002");
 * rs.add("<nameOfTheMachine/hostname>:3003");
 * 
 */

let MongoClient = require('mongodb').MongoClient;

/*
 * instead of giving a single hostname and port, we are actually giving a comma-separated list
 */
MongoClient.connect(`mongodb://localhost:30001, localhost:30002, localhost:30003`, function (err, db) {

  if(err) throw err;

  db.collection('repl').insert({name: 'Matthias'}, function (err, doc) {

    if(err) throw err;

    db.collection('repl').findOne({name: 'Matthias'}, function (err, doc) {
      if(err) throw err;
      console.log(doc);
      db.close();
    }); 

  }); 

});