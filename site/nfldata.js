// nfldata.js
// This module contains the functionality for managing all the NFL Game and Player data to be served to the web site pages.

console.log('*** nfldata.js *** - Entry Point');

var exports = module.exports = {};

//----------------------------------------------------------------------------------
// Retrieve the Users list
//exports.getThisWeekGames = function(request, response, callback) {
exports.getThisWeekGames = function(callback) {
    console.log("*** nfldata.getThisWeekGames 001 - ENTRY-POINT");

        var qry = 'SELECT m.season_type, m.season_year, g.week, g.away_team, g.away_score, ';
        qry = qry + 'g.home_team, g.home_score, g.day_of_week, finished, g.start_time, to_char(start_time, \'DY HH12:MI\') AS day_time ';
        qry = qry + 'FROM game g INNER JOIN meta m ON g.season_year = m.season_year AND g.season_type = m.season_type AND g.week = m.week';

        //qry = 'SELECT * FROM users';

        // Read the Owners into the collection
        dbConnect.query(qry, function (err, games) {
            if (err) {
                console.log("*** nfldata.getThisWeekGames 006 - SELECT games ERROR: ",err);
            } else if (games.rows) {
                console.log("*** nfldata.getThisWeekGames 007 - FOUND games - Count: ", games.rowCount);
                //console.log("*** nfldata.getThisWeekGames 007 - FOUND games: ", games.rows);
                return callback(games);

                // dbConnect.closeDBConnection(db);
            } else {
                console.log("*** nfldata.getThisWeekGames 008 - No document(s) found for games!");
            }
        });
};

// //----------------------------------------------------------------------------------
// // Retrieve the Games that are in the Schedule for this week
// exports.getThisWeekGames = function() {
//     console.log('*** nfldata.getThisWeekGames 001 - ENTRY-POINT');
//
//     return new Promise(function (resolve, reject){
//
//         var qry = 'SELECT g.away_team, g.away_score, g.home_team, g.home_score, g.day_of_week, g.start_time ';
//         qry = qry + 'FROM game g INNER JOIN meta m ON g.season_year = m.season_year AND g.season_type = m.season_type AND g.week = m.week';
//
//         qry = 'SELECT * FROM users';
//
//         console.log('*** nfldata.getThisWeekGames *** - Execute the query ' + qry);
//         // Read the GAMES into the collection
//         dbConnect.query(qry, function (err, games) {
//             resolve(games);
//         }, function(err){
//             console.log('*** nfldata.getThisWeekGames 006 - SELECT current games ERROR: ' + err);
//             reject();
//         });
//
//     });
//
// };

//----------------------------------------------------------------------------------
// Retrieve the Player lists by Position for the Draft page
exports.getPlayersForDraft = function(request, response) {
    console.log('*** nfldata.getPlayersForDraft *** - ENTRY-POINT');

    var players = {};
    return new Promise(function (resolve, reject){

        // ----------  Quarterbacks  ---------
        var qry = 'SELECT p.player_id, p.gsis_name, p.full_name, p.position, \'QB\' as category, p.team, p.status, ';
        qry = qry + 'array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
        qry = qry + 'array_length(array_agg(o.full_name), 1) AS nbr_of_owners ';
        qry = qry + 'FROM player p ';
        qry = qry + 'LEFT OUTER JOIN ff_owner_roster r ON p.player_id = r.player_id ';
        qry = qry + 'LEFT OUTER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'WHERE p.position = \'QB\' ';
        qry = qry + 'GROUP BY p.player_id, p.gsis_name, p.full_name, p.position, category, p.team, p.status, p.last_name ';
        qry = qry + 'ORDER BY p.last_name';

        // console.log('*** nfldata.getPlayersForDraft - *** Execute QB query ');
        // Read the Player into the collection
        dbConnect.query(qry, [], function (err, qBacks) {
            console.log('*** nfldata.getPlayersForDraft - *** QBACKS Count: ' + qBacks.rowCount);

            players.qb = qBacks

        }, function(err){
            console.log('*** nfldata.getPlayersForDraft 006 - SELECT QBACKS ERROR: ' + err);
            reject(err);
        });

        // ----------  Runningbacks  ---------
        var qry = 'SELECT p.player_id, p.gsis_name, p.full_name, p.position, \'RB\' as category, p.team, p.status, ';
        qry = qry + 'array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
        qry = qry + 'array_length(array_agg(o.full_name), 1) AS nbr_of_owners ';
        qry = qry + 'FROM player p ';
        qry = qry + 'LEFT OUTER JOIN ff_owner_roster r ON p.player_id = r.player_id ';
        qry = qry + 'LEFT OUTER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'WHERE p.position IN(\'FB\', \'RB\') ';
        qry = qry + 'GROUP BY p.player_id, p.gsis_name, p.full_name, p.position, category, p.team, p.status, p.last_name ';
        qry = qry + 'ORDER BY p.last_name';

        // console.log('*** nfldata.getPlayersForDraft - *** Execute RB query ');
        // Read the Player into the collection
        dbConnect.query(qry, [], function (err, rBacks) {
            console.log('*** nfldata.getPlayersForDraft - *** RBACKs Count: ' + rBacks.rowCount);

            players.rb = rBacks

        }, function(err){
            console.log('*** nfldata.getPlayersForDraft 006 - SELECT RBACKs ERROR: ' + err);
            reject(err);
        });

        // ----------  Receivers  ---------
        var qry = 'SELECT p.player_id, p.gsis_name, p.full_name, p.position, \'RC\' as category, p.team, p.status, ';
        qry = qry + 'array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
        qry = qry + 'array_length(array_agg(o.full_name), 1) AS nbr_of_owners ';
        qry = qry + 'FROM player p ';
        qry = qry + 'LEFT OUTER JOIN ff_owner_roster r ON p.player_id = r.player_id ';
        qry = qry + 'LEFT OUTER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'WHERE p.position IN(\'TE\', \'WR\') ';
        qry = qry + 'GROUP BY p.player_id, p.gsis_name, p.full_name, p.position, category, p.team, p.status, p.last_name ';
        qry = qry + 'ORDER BY p.last_name';

        // console.log('*** nfldata.getPlayersForDraft - *** Execute RECEIVER query ');
        // Read the Player into the collection
        dbConnect.query(qry, [], function (err, receivers) {
            console.log('*** nfldata.getPlayersForDraft - *** RECEIVERS Count: ' + receivers.rowCount);

            players.rc = receivers

        }, function(err){
            console.log('*** nfldata.getPlayersForDraft 006 - SELECT RECEIVERS ERROR: ' + err);
            reject(err);
        });

        // ----------  Kickers  ---------
        var qry = 'SELECT p.player_id, p.gsis_name, p.full_name, p.position, \'K\' as category, p.team, p.status, ';
        qry = qry + 'array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
        qry = qry + 'array_length(array_agg(o.full_name), 1) AS nbr_of_owners ';
        qry = qry + 'FROM player p ';
        qry = qry + 'LEFT OUTER JOIN ff_owner_roster r ON p.player_id = r.player_id ';
        qry = qry + 'LEFT OUTER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'WHERE p.position = \'K\' ';
        qry = qry + 'GROUP BY p.player_id, p.gsis_name, p.full_name, p.position, category, p.team, p.status, p.last_name ';
        qry = qry + 'ORDER BY p.last_name';

        // console.log('*** nfldata.getPlayersForDraft - *** Execute KICKER query ');
        // Read the Player into the collection
        dbConnect.query(qry, [], function (err, kickers) {
            console.log('*** nfldata.getPlayersForDraft - *** KICKERS Count: ' + kickers.rowCount);

            players.kickers = kickers

        }, function(err){
            console.log('*** nfldata.getPlayersForDraft 006 - SELECT KICKERS ERROR: ' + err);
            reject(err);
        });

        // ----------  defense  ---------
        var qry = 'SELECT t.team_id AS player_id, t.name AS gsis_name, ';
        qry = qry + 't.city || \' \' || t.name AS full_name, ';
        qry = qry + '\'UNK\' AS position, \'DEF\' as category, ';
        qry = qry + 't.team_id AS team, \'Active\' AS status, ';
        qry = qry + 'array_to_string(array_agg(o.full_name), \', \') AS owner_names, ';
        qry = qry + 'array_length(array_agg(o.full_name), 1) AS nbr_of_owners ';
        qry = qry + 'FROM team t ';
        qry = qry + 'LEFT OUTER JOIN ff_owner_roster r ON t.team_id = r.player_id ';
        qry = qry + 'LEFT OUTER JOIN ff_owners o ON r.owner_id = o.id ';
        qry = qry + 'WHERE t.team_id != \'UNK\' ';
        qry = qry + 'GROUP BY player_id, gsis_name, full_name, position, category, team, status, t.team_id ';
        qry = qry + 'ORDER BY t.team_id';

        // console.log('*** nfldata.getPlayersForDraft - *** Execute defense query ');
        // Read the Player into the collection
        dbConnect.query(qry, [], function (err, defense) {
            console.log('*** nfldata.getPlayersForDraft - *** DEFENSE Count: ' + defense.rowCount);

            players.defense = defense

            resolve(players);
        }, function(err){
            console.log('*** nfldata.getPlayersForDraft 006 - SELECT DEFENSE ERROR: ' + err);
            reject(err);
        });

    });

};

//----------------------------------------------------------------------------------
// Retrieve the Player lists by Position for the Draft page
exports.getScoring = function(request, response) {
    console.log('*** nfldata.getScoring 001 - ENTRY-POINT');

    return new Promise(function (resolve, reject){

        // SELECT pp.gsis_id, pp.drive_id, pp.play_id, pp.player_id, pp.team,
        // 	   p.gsis_name, p.team,
        // 	   pp.defense_int_tds, pp.defense_int_yds
        // 	   , g.week
        //   FROM play_player pp
        //   INNER JOIN player p
        //   	ON pp.player_id = p.player_id
        //   	AND pp.team = p.team
        //   INNER JOIN game g ON pp.gsis_id = g.gsis_id
        //   INNER JOIN meta m ON g.season_year = m.season_year
        //   	AND g.season_type = 'Preseason'
        // --	AND g.week = 1
        //  WHERE pp.defense_int_tds != 0

        var qry = 'SELECT g.away_team, g.away_score, g.home_team, g.home_score, g.day_of_week, g.start_time';
        qry = qry + 'FROM game g INNER JOIN meta m ON g.season_year = m.season_year AND g.season_type = m.season_type AND g.week = m.week';

        console.log('*** nfldata.getScoring 005 - Execute the query ');
        // Read the GAMES into the collection
        dbConnect.query(qry, function (err, games) {
            resolve(games);
        }, function(err){
            console.log('*** nfldata.getScoring 006 - SELECT current games ERROR: ' + err);
            reject();
        });
    });

};
