// main.js
// This module contains the functionality for managing all the data to be served to the web site pages.

console.log('*** main.js *** - Entry Point');

var moment = require('moment');
var now = moment();


var exports = module.exports = {};

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
//----------------------------------------------------------------------------------

exports.createLineup = function(req){
    console.log("*** main.addRoster  - ENTRY-POINT");

    var ownerid = req.body.ownerid;
    var addplayerId = req.body.addplayerId;
    var seasonYear = '2016'
    var seasonType = req.body.lineup
    var seasonWeek = '1'

    return new Promise(function (resolve, reject){

        // var timestampmoment = moment.utc(message.timestamp);
        var now = moment().format('MM/DD/YYYY HH:mm:ss Z');
        // console.log("*** user.addRoster - MOMENT-now: " + now);
        // console.log("*** user.addRoster - MOMENT-timestampmoment: " + timestampmoment);
        // console.log("*** user.addRoster - MOMENT-timestampmoment Formatted: " + timestampmoment.local().format('h:mm a'));

        var qry = 'INSERT INTO ff_owner_lineup ';
        qry = qry + '(season_year, season_type, week, lineup_type, owner_id, player_id, start, "createdAt", "updatedAt") ';
        qry = qry + 'VALUES (($1::int), ($2::text), ($3::int), ($4::text), ($5::int), ($6::text), ($7::boolean), ($8::text), ($9::text)) RETURNING *';

        console.log("*** main.addRoster - OWNER ID: " + ownerid);
        console.log("*** main.addRoster - ADDPLAYERID: " + addplayerId);
        console.log("*** main.addRoster - QUERY: " + qry);

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        //dbConnect.query('Insert INTO ff_owner_roster VALUES (DEFAULT, ($1), ($2), ($3)) RETURNING *', [hash, '09/26/2016 12:07:48 PDT', '09/26/2016 12:07:48 PDT'], function (err, rosterinstance) {
        //dbConnect.query(qry, [2016, req.body.ownerid, req.body.addplayerId, now, now], function (err, rosterInstance) {
        dbConnect.query(qry, [seasonYear, seasonType, seasonWeek, req.body.ownerid, req.body.addplayerId,], function (err, rosterInstance) {
            console.log("*** main.addRoster - QUERY-EXIT-POINT");
            resolve(rosterInstance);
        }, function(err){
            console.log("*** main.addRoster 005 - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Read the player into the owners roster table
//----------------------------------------------------------------------------------

exports.getOwnedPlayerList = function(req, res){
    console.log("*** main.getOwnedPlayerList  - ENTRY-POINT");

    var ownedPlayers = {};
    return new Promise(function (resolve, reject){

        // ----------  Quarterbacks  ---------
        var qry = 'SELECT array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
        qry = qry + 'r.player_id, p.full_name, p.team, p.position, p.status, ';
        qry = qry + '\'QB\' as category ';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
        qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
        qry = qry + 'WHERE p.position IN (\'QB\') '
        qry = qry + 'GROUP BY r.player_id, p.full_name, p.team, p.position, p.status, category '
        qry = qry + 'ORDER BY team, position, full_name'

        // console.log('*** nfldata.getPlayersForDraft - *** Execute QB query ');
        // Read the Player into the collection
        dbConnect.query(qry, [], function (err, qBacks) {
            console.log("*** main.getOwnedPlayerList *** - QB-QUERY-EXIT-POINT");
            console.log('*** main.getOwnedPlayerList *** - QBACKS Count: ' + qBacks.rowCount);
            ownedPlayers.qb = qBacks

            //resolve(ownerRoster);
        }, function(err){
            console.log("*** main.getOwnedPlayerList *** - SELECT error: " + err);
            reject();
        });

                // ----------  Runningbacks  ---------
                var qry = 'SELECT array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
                qry = qry + 'r.player_id, p.full_name, p.team, p.position, p.status, ';
                qry = qry + '\'RB\' as category ';
                qry = qry + 'FROM ff_owner_roster r ';
                qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
                qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
                qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
                qry = qry + 'WHERE p.position IN (\'FB\', \'RB\') '
                qry = qry + 'GROUP BY r.player_id, p.full_name, p.team, p.position, p.status, category '
                qry = qry + 'ORDER BY team, position, full_name'

                // console.log('*** nfldata.getPlayersForDraft - *** Execute RB query ');
                // Read the Player into the collection
                dbConnect.query(qry, [], function (err, rBacks) {
                    console.log('*** main.getOwnedPlayerList *** - RBACKs Count: ' + rBacks.rowCount);

                    ownedPlayers.rb = rBacks

                }, function(err){
                    console.log('*** nmain.getOwnedPlayerList *** - SELECT RBACKs ERROR: ' + err);
                    reject(err);
                });

                // ----------  Receivers  ---------
                var qry = 'SELECT array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
                qry = qry + 'r.player_id, p.full_name, p.team, p.position, p.status, ';
                qry = qry + '\'RC\' as category ';
                qry = qry + 'FROM ff_owner_roster r ';
                qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
                qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
                qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
                qry = qry + 'WHERE p.position IN (\'TE\', \'WR\') '
                qry = qry + 'GROUP BY r.player_id, p.full_name, p.team, p.position, p.status, category '
                qry = qry + 'ORDER BY team, position, full_name'

                // console.log('*** nfldata.getPlayersForDraft - *** Execute RECEIVER query ');
                // Read the Player into the collection
                dbConnect.query(qry, [], function (err, receivers) {
                    console.log('*** main.getOwnedPlayerList *** - RECEIVERS Count: ' + receivers.rowCount);

                    ownedPlayers.rc = receivers

                }, function(err){
                    console.log('*** nmain.getOwnedPlayerList *** - SELECT RECEIVERS ERROR: ' + err);
                    reject(err);
                });

                // ----------  Kickers  ---------
                var qry = 'SELECT array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
                qry = qry + 'r.player_id, p.full_name, p.team, p.position, p.status, ';
                qry = qry + '\'K\' as category ';
                qry = qry + 'FROM ff_owner_roster r ';
                qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
                qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
                qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
                qry = qry + 'WHERE p.position IN (\'K\') '
                qry = qry + 'GROUP BY r.player_id, p.full_name, p.team, p.position, p.status, category '
                qry = qry + 'ORDER BY team, position, full_name'

                // console.log('*** nfldata.getPlayersForDraft - *** Execute KICKER query ');
                // Read the Player into the collection
                dbConnect.query(qry, [], function (err, kickers) {
                    console.log('*** main.getOwnedPlayerList *** - KICKERS Count: ' + kickers.rowCount);

                    ownedPlayers.kickers = kickers

                }, function(err){
                    console.log('*** main.getOwnedPlayerList *** - SELECT KICKERS ERROR: ' + err);
                    reject(err);
                });

                // ----------  defense  ---------
                var qry = 'SELECT array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
                qry = qry + 'r.player_id, t.city || \' \' || t.name AS full_name, ';
                qry = qry + 't.team_id AS team, ';
                qry = qry + '\'DEF\' AS position, ';
                qry = qry + '\'Active\' AS status, ';
                qry = qry + '\'DEF\' as category ';
                qry = qry + 'FROM ff_owner_roster r ';
                qry = qry + 'INNER JOIN ff_owners o ON r.owner_id = o.id ';
                qry = qry + 'INNER JOIN team t ON r.player_id = t.team_id ';
                qry = qry + 'INNER JOIN meta m ON r.season_year = m.season_year ';
                qry = qry + 'GROUP BY r.player_id, full_name, team, position, status, category '
                qry = qry + 'ORDER BY 3'

                // console.log('*** nfldata.getPlayersForDraft - *** Execute defense query ');
                // Read the Player into the collection
                dbConnect.query(qry, [], function (err, defense) {
                    console.log('*** main.getOwnedPlayerList *** - DEFENSE Count: ' + defense.rowCount);

                    ownedPlayers.defense = defense

                    resolve(ownedPlayers);
                }, function(err){
                    console.log('*** main.getOwnedPlayerList *** - SELECT DEFENSE ERROR: ' + err);
                    reject(err);
                });

    });
};

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
//----------------------------------------------------------------------------------

exports.addToRoster = function(ownerid, addPlayerId){
    console.log("*** main.addToRoster  - ENTRY-POINT");

    // var ownerid = req.body.ownerid;
    // var addplayerId = req.body.addplayerId;

    return new Promise(function (resolve, reject){

        // var timestampmoment = moment.utc(message.timestamp);
        var now = moment().format('MM/DD/YYYY HH:mm:ss Z');
        // console.log("*** user.addToRoster - MOMENT-now: " + now);
        // console.log("*** user.addRoster - MOMENT-timestampmoment: " + timestampmoment);
        // console.log("*** user.addRoster - MOMENT-timestampmoment Formatted: " + timestampmoment.local().format('h:mm a'));

        var qry = 'INSERT INTO ff_owner_roster ';
        qry = qry + '(season_year, owner_id, player_id, roster_active, deactive_date, "createdAt", "updatedAt") ';
        qry = qry + 'VALUES (($1::int), ($2::int), ($3::text), true, null, ($4::timestamptz), ($5::timestamptz)) RETURNING *';
        // qry = qry + '(season_year, owner_id, player_id, roster_active, deactive_date) ';
        // qry = qry + 'VALUES (($1::int), ($2::int), ($3::text), true, null) RETURNING *';

        console.log("*** main.addToRoster - OWNER ID: " + ownerid);
        console.log("*** main.addToRoster - addPlayerId: " + addPlayerId);
        console.log("*** main.addToRoster - QUERY: " + qry);

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        //dbConnect.query('Insert INTO ff_owner_roster VALUES (DEFAULT, ($1), ($2), ($3)) RETURNING *', [hash, '09/26/2016 12:07:48 PDT', '09/26/2016 12:07:48 PDT'], function (err, rosterinstance) {
        //dbConnect.query(qry, [gSeasonYear, req.body.ownerid, req.body.addplayerId], function (err, rosterInstance) {
        dbConnect.query(qry, [gSeasonYear, ownerid, addPlayerId, now, now], function (err, rosterInstance) {
            console.log("*** main.addToRoster - QUERY-EXIT-POINT");
            resolve(rosterInstance);
        }, function(err){
            console.log("*** main.addToRoster 005 - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
//----------------------------------------------------------------------------------

exports.deleteFromRoster = function(dropRosterRow){
    console.log("*** main.deleteFromRoster  - ENTRY-POINT");

    //var ownerRosterId = dropPlayerId;
    console.log("*** main.deleteFromRoster - dropRosterRow: " + dropRosterRow);
    return new Promise(function (resolve, reject){

        // var timestampmoment = moment.utc(message.timestamp);
        var now = moment().format('MM/DD/YYYY HH:mm:ss Z');
        console.log("*** main.deleteFromRoster - MOMENT-now: " + now);
        // console.log("*** user.addRoster - MOMENT-timestampmoment: " + timestampmoment);
        // console.log("*** user.addRoster - MOMENT-timestampmoment Formatted: " + timestampmoment.local().format('h:mm a'));

        var qry = 'UPDATE ff_owner_roster ';
        qry = qry + 'SET roster_active = false, deactive_date = ($1::timestamptz), "updatedAt" = ($2::timestamptz) ';
        qry = qry + 'WHERE id = ($3::int) RETURNING *';

        console.log("*** main.deleteFromRoster - QUERY: " + qry);

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [now, now, dropRosterRow], function (err, rosterInstance) {
            console.log("*** main.deleteFromRoster - QUERY-EXIT-POINT");
            resolve(rosterInstance);
        }, function(err){
            console.log("*** main.deleteFromRoster *** - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Read the player into the owners roster table
//----------------------------------------------------------------------------------

exports.getRosters = function(req, res){
    console.log("*** main.getRosters  - ENTRY-POINT");

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
            console.log("*** main.getRosters - QUERY-EXIT-POINT");
            console.log("*** main.getRosters - OWNERROSTER COUNT: " + ownerRoster.rowCount);
            resolve(ownerRoster);
        }, function(err){
            console.log("*** main.getRosters *** - SELECT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Read the players into the owners roster table
//----------------------------------------------------------------------------------

exports.getRosterByOwner = function(ownerId, activeOnly){
    console.log("*** main.getRosterByOwner  - ENTRY-POINT");
    console.log("*** main.getRosterByOwner  - OWNERID: " + ownerId);
    console.log("*** main.getRosterByOwner  - activeOnly: " + activeOnly);

    return new Promise(function (resolve, reject){

        var qry = 'SELECT r.id AS owner_roster_id, r.owner_id, o.first_name || \' \' || o.last_name || \' \' || o.suffix AS owner_name, ';
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
        qry = qry + 'WHERE owner_id = ($1::int) ';
        if (activeOnly){
            qry = qry + 'AND r.roster_active = true ';
        }

        qry = qry + 'UNION ';
        qry = qry + 'SELECT r.id AS owner_roster_id, r.owner_id, o.first_name || \' \' || o.last_name || \' \' || o.suffix AS owner_name, '
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
        qry = qry + 'WHERE owner_id = ($1::int) ';
        if (activeOnly){
            qry = qry + 'AND r.roster_active = true ';
        }
        qry = qry + 'ORDER BY 10, 7 DESC, 5';

//        var qry = 'SELECT * FROM ff_owner_roster WHERE owner_id = ($1::int)';

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [ownerId], function (err, ownerRoster) {
            console.log("*** main.getRosterByOwner - QUERY-EXIT-POINT");
            console.log("*** main.getRosterByOwner - OWNERROSTER COUNT: " + ownerRoster.rowCount);
            resolve(ownerRoster);
        }, function(err){
            console.log("*** main.getRosterByOwner *** - SELECT error: " + err);
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

//----------------------------------------------------------------------------------
// Read the players into the owners roster table
//----------------------------------------------------------------------------------

exports.processMoves = function(req){
    console.log("*** main.processMoves  - ENTRY-POINT");

    var ownerid = Number(req.body.ownerid);
    var dropPlayerId = req.body.dropPlayerId;
    var addPlayerId = req.body.addPlayerId;

    console.log("*** main.processMoves  - ownerid: " + ownerid);
    console.log("*** main.processMoves  - req.body.dropPlayerId type: " + typeof req.body.dropPlayerId);
    console.log("*** main.processMoves  - dropPlayerId: " + dropPlayerId);
    console.log("*** main.processMoves  - dropPlayerId type: " + typeof dropPlayerId);
    console.log("*** main.processMoves  - dropPlayerId lenght: " + dropPlayerId.length);
    console.log("*** main.processMoves  - addPlayerId: " + addPlayerId);

    return new Promise(function (resolve, reject){

        if (typeof dropPlayerId === 'object') {
            dpLength = dropPlayerId.length;
            for (i = 0; i < dpLength; i++) {
                console.log("*** main.processMoves *** - DropPlayerLoop - dropPlayerId: " + dropPlayerId[i]);
                console.log("*** main.processMoves  - CALL DELETEFROMROSTER");
                // Players are dropped using the id of the DB record which is an integer
                // so we need to convert the string value that is returned in the request
                var dropRosterRow = Number(dropPlayerId[i]);
                main.deleteFromRoster(dropRosterRow).then(function(rosterItem){
                    console.log('*** main.processMoves - *** RETURN FROM DELETEFROMROSTER');
                    //resolve();
                }, function(err) {
                    console.log("*** main.processMoves *** - ERROR DELETEFROMROSTER EXIT-POINT");
                    console.log(err);
                    //res.status(500).send();
                });

            }
        } else {
            console.log("*** main.processMoves  - CALL DELETEFROMROSTER");
            // Players are dropped using the id of the DB record which is an integer
            // so we need to convert the string value that is returned in the request
            var dropRosterRow = Number(dropPlayerId);
            main.deleteFromRoster(dropRosterRow).then(function(rosterItem){
                console.log('*** main.processMoves - *** RETURN FROM DELETEFROMROSTER');
            }, function(err) {
                console.log("*** main.processMoves *** - ERROR DELETEFROMROSTER EXIT-POINT");
                console.log(err);
                //res.status(500).send();
            });
        }

        if (typeof addPlayerId === 'object') {
            apLength = addPlayerId.length;
            for (i = 0; i < apLength; i++) {
                main.addToRoster(ownerid, addPlayerId[i]).then(function(rosterItem){
                    console.log('*** main.processMoves - *** RETURN FROM ADDTOROSTER');
                    //resolve();

                }, function(err) {
                    console.log("*** main.processMovest *** - ERROR ADDTOROSTER EXIT-POINT");
                    console.log(err);
                    //res.status(500).send();
                });
            }
        } else {
            main.addToRoster(ownerid, addPlayerId).then(function(rosterItem){
                console.log('*** main.processMoves - *** RETURN FROM ADDTOROSTER');
                //resolve();

            }, function(err) {
                console.log("*** main.processMovest *** - ERROR ADDTOROSTER EXIT-POINT");
                console.log(err);
                //res.status(500).send();
            });
        }
        resolve();
    });
};
