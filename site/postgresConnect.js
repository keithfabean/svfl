// postgresConnect.js
// File to manage a PostgreSQL DB Connection

//require/import the mongodb native drivers.
var pg = require('pg');

var exports = module.exports = {};

exports.getDBConnectionPromise = function() {
    return new Promise(
        function (resolve, reject) {
          console.log("*** postgresConnect.getDBConnection 001 - GETDBCONNECTION - ENTRY-POINT");
          // Connection String URL. This is where the Heroku/Postgres db server is running.
          //var conString = 'jdbc:postgresql://ec2-54-163-238-215.compute-1.amazonaws.com:5432/d4u42c1bctudfk?user=ybiomfigpvqjzf&password=i-ClJgj2cxGEuFtasAWgQkTvBS&ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory';
          var conString = 'postgres://ybiomfigpvqjzf:i-ClJgj2cxGEuFtasAWgQkTvBS@ec2-54-163-238-215.compute-1.amazonaws.com:5432/d4u42c1bctudfk';

          //We need to create a postgres client interface in order to connect to a postgres server.
          //var pgClient = new pg.Client(conString);
          // pgClient.connect;

          console.log("*** postgresConnect.getDBConnection 002 - GETDBCONNECTION - PrepClient w/connectstring");

          var pgClient = new pg.Client({
            user: "ybiomfigpvqjzf",
            password: "i-ClJgj2cxGEuFtasAWgQkTvBS",
            database: "d4u42c1bctudfk",
            port: 5432,
            host: "ec2-54-163-238-215.compute-1.amazonaws.com",
            ssl: true
          });

          console.log("*** postgresConnect.getDBConnection 003 - GETDBCONNECTION - Execute Connection");
          // Use connect method to connect to the Server
          pgClient.connect(function (err) {

            if (err) {
              console.log("*** postgresConnect.getDBConnection 004 - GETDBCONNECTION - Unable to connect to the Heroku/Postgres server. Error:", err);
              reject(err); // failure
            } else {
              //HURRAY!! We are connected.
              console.log("*** postgresConnect.getDBConnection 005 - GETDBCONNECTION - Connection established to", conString);
              resolve(pgClient); // success
            }
          });
        });
};

// // Establish a DataBase Connection
// exports.getDBConnection = function(callback) {
//   console.log("*** mongoconnect.getDBConnection 001 - GETDBCONNECTION - ENTRY-POINT");
//
//   //require/import the mongodb native drivers.
//   var mongodb = require('mongodb');
//
//   //We need to work with "MongoClient" interface in order to connect to a mongodb server.
//   var MongoClient = mongodb.MongoClient;
//
//   // Connection URL. This is where your mongodb server is running.
//   //         mongodb://<dbuser>:<dbpassword>@ds019063.mlab.com:19063/svfl
//   var url = 'mongodb://svflaccess:svfl@ds019063.mlab.com:19063/svfl';
//
//   // Use connect method to connect to the Server
//   MongoClient.connect(url, function (err, db) {
//     if (err) {
//       console.log("*** mongoconnect.getDBConnection 002 - GETDBCONNECTION - Unable to connect to the mongoDB server. Error:", err);
//       //return callback(err, null);
//     } else {
//       //HURRAY!! We are connected.
//       console.log("*** mongoconnect.getDBConnection 003 - GETDBCONNECTION - Connection established to", url);
//       //return callback(null, db);
//       return db;
//     }
//   });
// };


// Close a DataBase Connection
exports.closeDBConnection = function(pgClient) {
    console.log("*** postgresConnect.closeDBConnection 001 - CLOSEDBCONNECTION - ENTRY-POINT");
    //Close connection
    // pgClient.end();
    pgClient.end(function (err) {
      if (err) console.log("*** postgresConnect.closeDBConnection 002 - CLOSEDBCONNECTION - Error: ", err);
    });
};
