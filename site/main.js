// main.js
// This module contains the functionality for managing all the data to be served to the web site pages.

console.log('*** main.js *** - Entry Point');

var moment = require('moment');
var now = moment();


var exports = module.exports = {};

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
//----------------------------------------------------------------------------------

exports.addRoster = function(req){
    console.log("*** user.addRoster  - ENTRY-POINT");

    var ownerid = req.body.ownerid;
    var addplayerId = req.body.addplayerId;

    return new Promise(function (resolve, reject){

        // var timestampmoment = moment.utc(message.timestamp);
        var now = moment().format('MM/DD/YYYY HH:mm:ss Z');
        // console.log("*** user.addRoster - MOMENT-now: " + now);
        // console.log("*** user.addRoster - MOMENT-timestampmoment: " + timestampmoment);
        // console.log("*** user.addRoster - MOMENT-timestampmoment Formatted: " + timestampmoment.local().format('h:mm a'));

        var qry = 'INSERT INTO ff_owner_roster ';
        //qry = qry + '(season_year, owner_id, player_id, roster_active, deactive_date, "createdAt", "updatedAt") ';
        qry = qry + '(season_year, owner_id, player_id, roster_active, deactive_date) ';
        //qry = qry + 'VALUES (($1::int), ($2::int), ($3::text), true, null, ($4::text), ($5::text)) RETURNING *';
        qry = qry + 'VALUES (($1::int), ($2::int), ($3::text), true, null) RETURNING *';

        console.log("*** user.addRoster - OWNER ID: " + ownerid);
        console.log("*** user.addRoster - ADDPLAYERID: " + addplayerId);
        console.log("*** user.addRoster - QUERY: " + qry);

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        //dbConnect.query('Insert INTO ff_owner_roster VALUES (DEFAULT, ($1), ($2), ($3)) RETURNING *', [hash, '09/26/2016 12:07:48 PDT', '09/26/2016 12:07:48 PDT'], function (err, rosterinstance) {
        //dbConnect.query(qry, [2016, req.body.ownerid, req.body.addplayerId, now, now], function (err, rosterInstance) {
        dbConnect.query(qry, [2016, req.body.ownerid, req.body.addplayerId], function (err, rosterInstance) {
            console.log("*** user.addRoster - QUERY-EXIT-POINT");
            resolve(rosterInstance);
        }, function(err){
            console.log("*** user.addRoster 005 - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
//----------------------------------------------------------------------------------

exports.getRosters = function(req, res){
    console.log("*** user.getRosters  - ENTRY-POINT");

    return new Promise(function (resolve, reject){

        var qry = 'SELECT r.owner_id, o.first_name || \' \' || o.last_name || \' \' || o.suffix AS owner_name, ';
        qry = qry + 'r.player_id, p.full_name, p.team, p.position, p.status, ';
        qry = qry + 'CASE WHEN p.position=\'FB\' THEN \'RB\' ';
        qry = qry + 'WHEN p.position=\'RB\' THEN \'RB\' ';
        qry = qry + 'WHEN p.position=\'TE\' THEN \'RC\' ';
        qry = qry + 'WHEN p.position=\'WR\' THEN \'RC\' ';
        qry = qry + 'WHEN p.position=\'QB\' THEN \'QB\' ';
        qry = qry + 'WHEN p.position=\'K\' THEN \'K\' ';
        qry = qry + 'END as category, ';
        qry = qry + 'CASE WHEN p.position=\'FB\' THEN \'2\' ';
        qry = qry + 'WHEN p.position=\'RB\' THEN \'2\' ';
        qry = qry + 'WHEN p.position=\'TE\' THEN \'3\' ';
        qry = qry + 'WHEN p.position=\'WR\' THEN \'3\' ';
        qry = qry + 'WHEN p.position=\'QB\' THEN \'1\' ';
        qry = qry + 'WHEN p.position=\'K\' THEN \'4\' ';
        qry = qry + 'END AS sortorder ';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
        qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
        //qry = qry + 'WHERE owner_id = ($1::int) '

        qry = qry + 'UNION ';
        qry = qry + 'SELECT r.owner_id, o.first_name || \' \' || o.last_name || \' \' || o.suffix AS owner_name, '
        qry = qry + 'r.player_id, t.city || \' \' || t.name AS full_name, ';
        qry = qry + 't.team_id AS team, ';
        qry = qry + '\'UNK\' AS position, ';
        qry = qry + '\'Active\' AS status, ';
        qry = qry + '\'DEF\' as category, ';
        qry = qry + '\'5\'';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'INNER JOIN team t ON r.player_id = t.team_id ';
        qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
        //qry = qry + 'WHERE owner_id = ($1::int)';
        qry = qry + 'ORDER BY 2, 9, 6 DESC, 4';

//        var qry = 'SELECT * FROM ff_owner_roster WHERE owner_id = ($1::int)';

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [], function (err, ownerRoster) {
            console.log("*** user.getRosters - QUERY-EXIT-POINT");
            console.log("*** user.getRosters - OWNERROSTER COUNT: " + ownerRoster.rowCount);
            resolve(ownerRoster);
        }, function(err){
            console.log("*** user.getRosters *** - SELECT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
//----------------------------------------------------------------------------------

exports.getRosterByOwner = function(ownerId){
    console.log("*** user.getRosterByOwner  - ENTRY-POINT");
    console.log("*** user.getRosterByOwner  - OWNERID: " + ownerId);

    return new Promise(function (resolve, reject){

        var qry = 'SELECT r.owner_id, o.first_name || \' \' || o.last_name || \' \' || o.suffix AS owner_name, ';
        qry = qry + 'r.player_id, p.full_name, p.team, p.position, p.status, ';
        qry = qry + 'CASE WHEN p.position=\'FB\' THEN \'RB\' ';
        qry = qry + 'WHEN p.position=\'RB\' THEN \'RB\' ';
        qry = qry + 'WHEN p.position=\'TE\' THEN \'RC\' ';
        qry = qry + 'WHEN p.position=\'WR\' THEN \'RC\' ';
        qry = qry + 'WHEN p.position=\'QB\' THEN \'QB\' ';
        qry = qry + 'WHEN p.position=\'K\' THEN \'K\' ';
        qry = qry + 'END as category, ';
        qry = qry + 'CASE WHEN p.position=\'FB\' THEN \'2\' ';
        qry = qry + 'WHEN p.position=\'RB\' THEN \'2\' ';
        qry = qry + 'WHEN p.position=\'TE\' THEN \'3\' ';
        qry = qry + 'WHEN p.position=\'WR\' THEN \'3\' ';
        qry = qry + 'WHEN p.position=\'QB\' THEN \'1\' ';
        qry = qry + 'WHEN p.position=\'K\' THEN \'4\' ';
        qry = qry + 'END AS sortorder ';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
        qry = qry + 'INNER JOIN meta m ON m.season_year = r.season_year ';
        qry = qry + 'WHERE owner_id = ($1::int) '

        qry = qry + 'UNION ';
        qry = qry + 'SELECT r.owner_id, o.first_name || \' \' || o.last_name || \' \' || o.suffix AS owner_name, '
        qry = qry + 'r.player_id, t.city || \' \' || t.name AS full_name, ';
        qry = qry + 't.team_id AS team, ';
        qry = qry + '\'UNK\' AS position, ';
        qry = qry + '\'Active\' AS status, ';
        qry = qry + '\'DEF\' as category, ';
        qry = qry + '\'5\'';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'INNER JOIN team t ON r.player_id = t.team_id ';
        qry = qry + 'INNER JOIN meta m ON m.season_year = r.season_year ';
        qry = qry + 'WHERE owner_id = ($1::int)';
        qry = qry + 'ORDER BY 9, 6 DESC, 4';

//        var qry = 'SELECT * FROM ff_owner_roster WHERE owner_id = ($1::int)';

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [ownerId], function (err, ownerRoster) {
            console.log("*** user.getRosterByOwner - QUERY-EXIT-POINT");
            console.log("*** user.getRosterByOwner - OWNERROSTER COUNT: " + ownerRoster.rowCount);
            resolve(ownerRoster);
        }, function(err){
            console.log("*** user.getRosterByOwner *** - SELECT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Retrieve the current Standings for all owners
//----------------------------------------------------------------------------------

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
