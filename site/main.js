// main.js
// This module contains the functionality for managing all the data to be served to the web site pages.

console.log('*** main.js *** - Entry Point');


// Initialize Parse with your Parse application javascript keys
//Parse.initialize("ZWVvGauw0J2IYzKVIqQH54Y8zgaAxvR94SBSBlXR",      //Application Key
//                 "R0aMtGTSofGDI5gxyUfRBPom34pRnb1jMTUJCt2W");     //javascript Key

var exports = module.exports = {};

//******CHANGED*******
// console.log('*** main.js *** - require db.js')
// // Include the code to connect to a postgres database
// //var dbConnect = require('./postgresConnect.js');
// var dbConnect = require('./db.js');
//******CHANGED*******

//----------------------------------------------------------------------------------
// Retrieve the current Owner Standings
exports.getStandings = function(request, response, callback) {
    console.log("*** main.getStandings 001 - GETSTANDINGS - ENTRY-POINT");

    console.log("*** main.getStandings 002 - GETSTANDINGS - Go Get The DB Connection");
    // Make the call to Open a Connection to the database
    // dbConnect.getDBConnectionPromise()
    // .then(db => {
        //    console.log("*** main.getStandings 004 - GETSTANDINGS - SET the Collection of SVFLOwners");
        // Get the documents collection
        //    var collection = db.collection('SVFLOwner');

        console.log("*** main.getStandings 005 - GETSTANDINGS - Execute the query ");

        var qry = 'SELECT o.\"firstName\", o.\"lastName\", o.\"suffix\", s.\"seasonType\", s.\"seasonYear\", s.\"seasonWeek\", s.\"ownerId\", s.\"lastWeekTotals\", ';
        qry = qry + 's.\"thisWeekTotals\", s.\"grandTotals\", s.\"weeklyAverage\", s.\"currentWinnings\", s.\"pointsFromPlayoffs\" ';
        qry = qry + 'FROM Standings s INNER JOIN owners o ON s.\"ownerId\" = o.\"id\" '
        qry = qry + 'WHERE s.\"seasonType\" = ($1) AND s.\"seasonYear\" = ($2) AND s.\"seasonWeek\" = ($3) ';
        qry = qry + 'ORDER BY s.\"grandTotals\" DESC';

        // Read the Owners into the collection
        //dbConnect.query('SELECT * FROM "SVFL"."SVFL_Owner" sso ORDER BY sso."grandTotals" DESC', function (err, owners) {
        dbConnect.query(qry, ['Regular', 2016, 3], function (err, owners) {
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

    // })
    // .catch(error => {
    //     console.log("*** main.getStandings 009 - GETSTANDINGS - ERROR returned from getDBConnection: ",error);
    // });

};
