// user.js
// This module contains the functionality for managing all the user data to be served to the web site pages.

console.log('*** user.js *** - Entry Point');


var bcrypt = require('bcrypt');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var cryptojs = require('crypto-js');
var moment = require('moment');
var now = moment();

var exports = module.exports = {};

//******CHANGED*******
// console.log('*** user.js *** - require db.js')
// // Include the code to connect to a postgres database
// var dbConnect = require('./db.js');
//******CHANGED*******

//----------------------------------------------------------------------------------
// Write the drafted player into the owners roster table
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
exports.getRosterByOwner = function(ownerId){
    console.log("*** user.getRosterByOwner  - ENTRY-POINT");
    console.log("*** user.getRosterByOwner  - OWNERID: " + ownerId);

    return new Promise(function (resolve, reject){

        var qry = 'SELECT p.full_name, p.team, p.position, p.status, ';
        qry = qry + 'CASE WHEN p.position=\'FB\' THEN \'RB\' ';
        qry = qry + 'WHEN p.position=\'RB\' THEN \'RB\' ';
        qry = qry + 'WHEN p.position=\'TE\' THEN \'RC\' ';
        qry = qry + 'WHEN p.position=\'WR\' THEN \'RC\' ';
        qry = qry + 'WHEN p.position=\'QB\' THEN \'QB\' ';
        qry = qry + 'WHEN p.position=\'K\' THEN \'K\' ';
        qry = qry + 'END as category ';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN player p ON r.player_id = p.player_id ';
        qry = qry + 'WHERE owner_id = ($1::int) '

        qry = qry + 'UNION ';
        qry = qry + 'SELECT t.city || \' \' || t.name AS full_name, ';
        qry = qry + 't.team_id AS team, ';
        qry = qry + '\'UNK\' AS position, ';
        qry = qry + '\'Active\' AS status, ';
        qry = qry + '\'DEF\' as category ';
        qry = qry + 'FROM ff_owner_roster r ';
        qry = qry + 'INNER JOIN team t ON r.player_id = t.team_id ';
        qry = qry + 'WHERE owner_id = ($1::int)';

//        var qry = 'SELECT * FROM ff_owner_roster WHERE owner_id = ($1::int)';

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [ownerId], function (err, ownerRoster) {
            console.log("*** user.getRosterByOwner - QUERY-EXIT-POINT");
            console.log("*** user.getRosterByOwner - OWNERROSTER COUNT: " + ownerRoster.rowCount);
            resolve(ownerRoster);
        }, function(err){
            console.log("*** user.getRosterByOwner 005 - INSERT error: " + err);
            reject();
        });
    });
};


//----------------------------------------------------------------------------------
// Authenticate the User
exports.authenticate = function(body) {
    console.log("*** user.authenticate 001 - AUTHENTICATE - SUCCESS ENTRY-POINT");
    return new Promise(function (resolve, reject){
        if ((typeof body.email !== 'string' || body.email.length === 0) ||
        (typeof body.password !== 'string' || body.password.length === 0)) {
            //return res.status(400).send('invalid user id or password.');
            return reject();
        }

        //var qry = 'SELECT id, email, password_hash FROM ff_users WHERE email = ($1)';

        var qry = 'SELECT o.id AS owner_id, o.first_name || \' \' || o.last_name AS full_name, ';
        qry = qry + 'u.id AS user_id, u.email, u.password_hash ';
        qry = qry + 'FROM ff_users u INNER JOIN ff_owners o ON o.user_id = u.id ';
        qry = qry + 'WHERE u.email = ($1)';

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [body.email], function (err, user) {
            console.log("*** user.authenticate 002 - user rowCount: " + user.rowCount);
            console.log(user.rows[0]);
            console.log("*** user.authenticate 002 - AUTHENTICATE - user Id: " + user.rows[0].user_id);
            console.log("*** user.authenticate 002 - AUTHENTICATE - email: " + user.rows[0].email);
            console.log("*** user.authenticate 002 - AUTHENTICATE - hash: " + user.rows[0].password_hash);

            // If a user IS NOT returned OR the passwords DON'T match, send a 401 response.
            //if (!user || !bcrypt.compareSync(body.password, user.rows[0].password_hash)) {
            if (user.rowCount === 0 || !bcrypt.compareSync(body.password, user.rows[0].password_hash)) {
                //return res.status(401).send('User Not Found!');
                return reject();
            }

            resolve(user);
        }, function(err){
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the access token to the db
exports.createToken = function(token){
    console.log("*** user.createToken 001 - createToken - ENTRY-POINT");
    return new Promise(function (resolve, reject){
        // if ((typeof body.email !== 'string' || body.email.length === 0) ||
        // (typeof body.password !== 'string' || body.password.length === 0)) {
        //     //return res.status(400).send('invalid user id or password.');
        //     return reject();
        // }

        var hash = cryptojs.MD5(token).toString();
        console.log('**** token.js **** - token value: ' + token);
        console.log('**** token.js **** - token hash: ' + hash);

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query('Insert INTO ff_tokens VALUES (DEFAULT, ($1), ($2), ($3)) RETURNING *', [hash, '09/26/2016 12:07:48 PDT', '09/26/2016 12:07:48 PDT'], function (err, tokenInstance) {
            resolve(tokenInstance);
        }, function(err){
            console.log("*** user.createToken 005 - createToken - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Delete the access token from the db
exports.deleteToken = function(token){
    console.log("*** user.deleteToken 001 - deleteToken - ENTRY-POINT");
    return new Promise(function (resolve, reject){

        var hash = cryptojs.MD5(token).toString();
        console.log('**** deleteToken **** - token value: ' + token);
        console.log('**** deleteToken **** - token hash: ' + hash);

        //-----------   |SQL Statement ---------------------------------------|  |$1 variable|
        dbConnect.query('DELETE FROM ff_tokens t WHERE t."tokenHash" = ($1::text)', [hash], function (err, tokenInstance) {
            resolve(tokenInstance);
        }, function(err){
            console.log("*** user.deleteToken 005 - deleteToken - DELETE error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the access token to the db
exports.findToken = function(tokenHash){
    console.log("*** user.findToken 001 - ENTRY-POINT");
    console.log("*** user.findToken 002 - tokenHash: " + tokenHash);

    var qry = 'SELECT * FROM ff_tokens t WHERE t."tokenHash" = $1::text';
    //var qry1 = 'SELECT * FROM tokens t WHERE t."tokenHash" = \'' + tokenHash + '\'';

    console.log("*** user.findToken 003 - qry: " + qry);
    //console.log("*** user.findToken 002 - qry1: " + qry1);

    return new Promise(function (resolve, reject){
        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [tokenHash], function (err, tokenInstance) {
            console.log('*** user.findToken 004 - findToken - Success: ');
            console.log('*** user.findToken 004.1 - tokenInstance Row Count: ' + tokenInstance.rowCount);
            //console.log(tokenInstance);
            resolve(tokenInstance);
        }, function(err){
            console.log('*** user.findToken 005 - findToken - error: ' + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the access token to the db
exports.findByToken = function(token){
    console.log("*** user.findByToken 001 - ENTRY-POINT");
    return new Promise(function(resolve, reject){
        try{
            var decodedJWT = jwt.verify(token, 'qwerty098');
            var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#');
            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

            console.log('**** findByToken **** - token: ' + token);
            console.log('**** findByToken **** - tokenData: ');
            console.log(tokenData);

            var qry = 'SELECT o.id AS owner_id, o.first_name || \' \' || o.last_name AS full_name, ';
            qry = qry + 'u.id AS user_id, u.email ';
            qry = qry + 'FROM ff_users u INNER JOIN ff_owners o ON o.user_id = u.id ';
            qry = qry + 'WHERE u.id = ($1)';

            console.log("*** user.findByToken 001.1 - exec query" + qry);

            //dbConnect.query('SELECT * FROM ff_users WHERE id = ($1)', [tokenData.id], function (err, user) {
            dbConnect.query(qry, [tokenData.id], function (err, user) {
                if (user){
                    resolve(user);
                } else {
                    console.log("*** user.findByToken 002 - DID Not Find User - ERR: " + err);
                    reject();
                }
            }, function(err){
                console.log("*** user.findByToken 003 - DID Not Find User - ERR: " + err);
                reject();
            });
        } catch(err){
            reject();
        }
    });

    // return new Promise(function (resolve, reject){
    //     //-----------   |SQL Statement-----------------------------|  |$1 variable|
    //     dbConnect.query('SELECT * FROM users WHERE tokenHash = ($1)', [token], function (err, tokenInstance) {
    //         resolve(tokenInstance);
    //     }, function(err){
    //         console.log("*** user.findUserByToken 005 - createToken - INSERT error: " + err);
    //         reject();
    //     });
    // });
};

//----------------------------------------------------------------------------------
// Generate the Users access token
exports.generateToken = function(type, user){
    console.log("*** user.generateToken 001 - generateToken - ENTRY-POINT");
    if (!_.isString(type)){
        console.log("*** user.generateToken 002 - generateToken - type was not a string");
        return undefined;
    }
    try {
        var stringData = JSON.stringify({id: user.rows[0].user_id, type: type});
        var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString();
        // jwt.sign takes the data to encrypt and a password used to encrypt the data
        var token = jwt.sign({token: encryptedData}, 'qwerty098');

        console.log('**** generateToken **** - stringData: ' + stringData);
        console.log('**** generateToken **** - encryptedData: ' + encryptedData);
        console.log('**** generateToken **** - token: ' + token);

        return token;
    } catch(err){
        console.log("*** user.generateToken 009 - generateToken - catch error");
        console.error(err);
        return undefined;
    }
};

//----------------------------------------------------------------------------------
// Write the user information to the db
exports.createUser = function(req){
    console.log("*** user.createUser - ENTRY-POINT");

    return new Promise(function (resolve, reject){
        // if ((typeof body.email !== 'string' || body.email.length === 0) ||
        // (typeof body.password !== 'string' || body.password.length === 0)) {
        //     //return res.status(400).send('invalid user id or password.');
        //     return reject();
        // }

        var userId = req.body.email;
        console.log("*** user.createUser - USERID: " + userId);
        var userPW = req.body.password;
        console.log("*** user.createUser - PASSWORD: " + userPW);

        var salt = bcrypt.genSaltSync(10);
        var hashedPassword  = bcrypt.hashSync(userPW, salt);

        var qry = 'Insert INTO ff_users '
        qry = qry + '(email, salt, password_hash, "createdAt", "updatedAt") ';
        qry = qry + 'VALUES (($1::text), ($2::text), ($3::text), ($4), ($5)) RETURNING *'

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [userId, salt, hashedPassword, '11/05/2016 12:07:48 PDT', '11/05/2016 12:07:48 PDT'], function (err, userInstance) {
            resolve(userInstance);
        }, function(err){
            console.log("*** user.createToken 005 - createToken - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Retrieve the Users list
exports.getUsers = function(request, response, callback) {
    console.log("*** user.getUsers 001 - GETUSERS - ENTRY-POINT");

    console.log("*** user.getUsers 002 - GETUSERS - Go Get The DB Connection");
    // Make the call to Open a Connection to the database
    // dbConnect.getDBConnectionPromise()
    // .then(db => {
    //     //    console.log("*** main.getStandings 004 - GETSTANDINGS - SET the Collection of SVFLOwners");
    //     // Get the documents collection
    //     //    var collection = db.collection('SVFLOwner');
    //
    //     console.log("*** main.getStandings 005 - GETUSERS - Execute the query ");

        // Read the Owners into the collection
        dbConnect.query('SELECT * FROM ff_users', function (err, users) {
            if (err) {
                console.log("*** user.getUsers 006 - GETUSERS - SELECT USERS ERROR: ",err);
            } else if (users.rows) {
                console.log("*** user.getUsers 007 - GETUSERS - FOUND USERS - Count: ", users.length);
                console.log("*** user.getUsers 007 - GETUSERS - FOUND USERS: ", users.rows);
                return callback(users);

                // dbConnect.closeDBConnection(db);
            } else {
                console.log("*** user.getUsers 008 - GETUSERS - No document(s) found for users!");
            }
        });
};
