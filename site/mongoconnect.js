// mongoconnect.js
// File to manage a MongoDB Connection

var exports = module.exports = {};

exports.getDBConnectionPromise = function() {
    return new Promise(
        function (resolve, reject) {
          console.log("*** mongoconnect.getDBConnection 001 - GETDBCONNECTION - ENTRY-POINT");
          //require/import the mongodb native drivers.
          var mongodb = require('mongodb');
          //We need to work with "MongoClient" interface in order to connect to a mongodb server.
          var MongoClient = mongodb.MongoClient;
          // Connection URL. This is where your mongodb server is running.
          var url = 'mongodb://svflaccess:svfl@ds019063.mlab.com:19063/svfl';
          // Use connect method to connect to the Server
          MongoClient.connect(url, function (err, db) {
            if (err) {
              console.log("*** mongoconnect.getDBConnection 002 - GETDBCONNECTION - Unable to connect to the mongoDB server. Error:", err);
              reject(err); // failure
            } else {
              //HURRAY!! We are connected.
              console.log("*** mongoconnect.getDBConnection 003 - GETDBCONNECTION - Connection established to", url);
              resolve(db); // success
            }
          });
        });
};

// Establish a DataBase Connection
exports.getDBConnection = function(callback) {
  console.log("*** mongoconnect.getDBConnection 001 - GETDBCONNECTION - ENTRY-POINT");

  //require/import the mongodb native drivers.
  var mongodb = require('mongodb');

  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;

  // Connection URL. This is where your mongodb server is running.
  //         mongodb://<dbuser>:<dbpassword>@ds019063.mlab.com:19063/svfl
  var url = 'mongodb://svflaccess:svfl@ds019063.mlab.com:19063/svfl';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("*** mongoconnect.getDBConnection 002 - GETDBCONNECTION - Unable to connect to the mongoDB server. Error:", err);
      //return callback(err, null);
    } else {
      //HURRAY!! We are connected.
      console.log("*** mongoconnect.getDBConnection 003 - GETDBCONNECTION - Connection established to", url);
      //return callback(null, db);
      return db;
    }
  });
};


// Close a DataBase Connection
exports.closeDBConnection = function(db) {
    console.log("*** mongoconnect.closeDBConnection 003 - CLOSEDBCONNECTION - ENTRY-POINT");
    //Close connection
    db.close();
};
