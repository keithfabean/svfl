// main.js
// This module contains the functionality for managing all the data to be served to the web site pages.

// Initialize Parse with your Parse application javascript keys
//Parse.initialize("ZWVvGauw0J2IYzKVIqQH54Y8zgaAxvR94SBSBlXR",      //Application Key
//                 "R0aMtGTSofGDI5gxyUfRBPom34pRnb1jMTUJCt2W");     //javascript Key

var exports = module.exports = {};

// Include the code that connect to a mongo database
//var dbConnect = require('./mongoconnect.js');

// Include the code that connect to a mongo database
var dbConnect = require('./postgresConnect.js');

//----------------------------------------------------------------------------------
// Retrieve the current Owner Standings
exports.getStandings = function(request, response, callback) {
  console.log("*** main.getStandings 001 - GETSTANDINGS - ENTRY-POINT");

  console.log("*** main.getStandings 002 - GETSTANDINGS - Go Get The DB Connection");
  // Make the call to Open a Connection to the database
  dbConnect.getDBConnectionPromise()
  .then(db => {
//    console.log("*** main.getStandings 004 - GETSTANDINGS - SET the Collection of SVFLOwners");
    // Get the documents collection
//    var collection = db.collection('SVFLOwner');

    console.log("*** main.getStandings 005 - GETSTANDINGS - Execute the query ");

    // Read the Owners into the collection
    db.query('SELECT * FROM "SVFL"."SVFL_Owner" sso ORDER BY sso."grandTotals" DESC', function (err, owners) {
      if (err) {
        console.log("*** main.getStandings 006 - GETSTANDINGS - SELECT OWNERS ERROR: ",err);
      } else if (owners.rows) {
        console.log("*** main.getStandings 007 - GETSTANDINGS - FOUND OWNERS - Count: ", owners.length);
        console.log("*** main.getStandings 007 - GETSTANDINGS - FOUND OWNERS: ", owners.rows);
        return callback(owners);
//          return owners;

        dbConnect.closeDBConnection(db);
      } else {
        console.log("*** main.getStandings 008 - GETSTANDINGS - No document(s) found for SVFLOwner!");
      }
    });

  })
  .catch(error => {
    console.log("*** main.getStandings 009 - GETSTANDINGS - ERROR returned from getDBConnection: ",error);
  });

};

// // Retrieve the current Owner Standings
// exports.getStandings = function(request, response, db) {
//   console.log("*** main.getStandings 001 - GETSTANDINGS - ENTRY-POINT");
//
//   console.log("*** main.getStandings 002 - GETSTANDINGS - Go Get The DB Connection");
//   // Make the call to Open a Connection to the database
//   var db = dbConnect.getDBConnection();
//
//   console.log("*** main.getStandings 004 - GETSTANDINGS - SET the Collection of SVFLOwners");
//   // Get the documents collection
//   var collection = db.collection('SVFLOwner');
//
//   console.log("*** main.getStandings 005 - GETSTANDINGS - Execute the FIND ");
//
//   // Read the Owners into the collection
//   collection.find().sort({grandTotals: -1}).toArray(function (err, owners) {
//     if (err) {
//       console.log("*** main.getStandings 006 - GETSTANDINGS - OWNERS ERROR: ",err);
//     } else if (owners.length) {
//       console.log("*** main.getStandings 007 - GETSTANDINGS - OWNERS FOUND: ", owners);
//       return callback(owners);
//
//       dbConnect.closeDBConnection(request, response, dbConnection);
//     } else {
//       console.log("*** main.getStandings 099 - GETSTANDINGS - No document(s) found for SVFLOwner!");
//     }
//   });
// };
