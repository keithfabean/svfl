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
// Retrieve the current Standings for all owners
exports.getStandings = function(request, response, callback) {
    console.log("*** main.getStandings 001 - GETSTANDINGS - ENTRY-POINT");

    console.log("*** main.getStandings 005 - GETSTANDINGS - Execute the query ");

    var qry = 'SELECT o.first_name, o.last_name, o.suffix, s.season_type, s.season_year, s.week, s.owner_id, s.last_week_totals, ';
    qry = qry + 's.this_week_totals, s.grand_totals, s.weekly_average, s.current_winnings, s.points_from_playoffs ';
    qry = qry + 'FROM ff_Standings s INNER JOIN ff_owners o ON s.owner_id = o.id '
    qry = qry + 'WHERE s.season_type = ($1) AND s.season_year = ($2) AND s.week = ($3) ';
    qry = qry + 'ORDER BY s.grand_totals DESC';

    // Read the Owners into the collection
    //dbConnect.query('SELECT * FROM "SVFL"."SVFL_Owner" sso ORDER BY sso."grandTotals" DESC', function (err, owners) {
    dbConnect.query(qry, ['Regular', 2016, 3], function (err, weekStandings) {
        if (err) {
            console.log("*** main.getStandings 006 - GETSTANDINGS - SELECT weekStandings ERROR: ",err);
        } else if (weekStandings.rows) {
            console.log("*** main.getStandings 007 - GETSTANDINGS - FOUND weekStandings - Count: ", weekStandings.rowCount);
            //console.log("*** main.getStandings 007 - GETSTANDINGS - FOUND weekStandings: ", weekStandings.rows);
            return callback(weekStandings);
            //          return owners;

            dbConnect.closeDBConnection(db);
        } else {
            console.log("*** main.getStandings 008 - GETSTANDINGS - No document(s) found for SVFLOwner!");
        }
    });

};
