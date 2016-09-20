// main.js
// This module contains the functionality for managing all the data to be served to the web site pages.

// Initialize Parse with your Parse application javascript keys
//Parse.initialize("ZWVvGauw0J2IYzKVIqQH54Y8zgaAxvR94SBSBlXR",      //Application Key
//                 "R0aMtGTSofGDI5gxyUfRBPom34pRnb1jMTUJCt2W");     //javascript Key

var exports = module.exports = {};

// Include the code that connect to a mongo database
//var dbConnect = require('./postgresConnect.js');
var dbConnect = require('./db.js');

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

//----------------------------------------------------------------------------------
// Retrieve the Users list
exports.getUsers = function(request, response, callback) {
    console.log("*** main.getUsers 001 - GETUSERS - ENTRY-POINT");

    console.log("*** main.getUsers 002 - GETUSERS - Go Get The DB Connection");
    // Make the call to Open a Connection to the database
    // dbConnect.getDBConnectionPromise()
    // .then(db => {
    //     //    console.log("*** main.getStandings 004 - GETSTANDINGS - SET the Collection of SVFLOwners");
    //     // Get the documents collection
    //     //    var collection = db.collection('SVFLOwner');
    //
    //     console.log("*** main.getStandings 005 - GETUSERS - Execute the query ");

        // Read the Owners into the collection
        dbConnect.query('SELECT * FROM users', function (err, users) {
            if (err) {
                console.log("*** main.getUsers 006 - GETUSERS - SELECT USERS ERROR: ",err);
            } else if (users.rows) {
                console.log("*** main.getUsers 007 - GETUSERS - FOUND USERS - Count: ", users.length);
                console.log("*** main.getUsers 007 - GETUSERS - FOUND USERS: ", users.rows);
                return callback(users);

                // dbConnect.closeDBConnection(db);
            } else {
                console.log("*** main.getUsers 008 - GETUSERS - No document(s) found for users!");
            }
        });

    // })
    // .catch(error => {
    //     console.log("*** main.getStandings 009 - GETUSERS - ERROR returned from getDBConnection: ",error);
    // });

};
