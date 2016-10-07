// user.js
// This module contains the functionality for managing all the user data to be served to the web site pages.

console.log('*** user.js *** - Entry Point');


var bcrypt = require('bcrypt');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var cryptojs = require('crypto-js');

var exports = module.exports = {};

//******CHANGED*******
// console.log('*** user.js *** - require db.js')
// // Include the code to connect to a postgres database
// var dbConnect = require('./db.js');
//******CHANGED*******


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

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query('SELECT id, email, password_hash FROM users WHERE email = ($1)', [body.email], function (err, user) {
            console.log("*** user.authenticate 002 - user rowCount: " + user.rowCount);

            // If a user IS NOT returned OR the passwords DON'T match, send a 401 response.
            //if (!user || !bcrypt.compareSync(body.password, user.rows[0].password_hash)) {
            if (user.rowCount === 0 || !bcrypt.compareSync(body.password, user.rows[0].password_hash)) {
                //return res.status(401).send('User Not Found!');
                return reject();
            }
            console.log("*** user.authenticate 002 - AUTHENTICATE - user Id: " + user.rows[0].id);
            console.log("*** user.authenticate 002 - AUTHENTICATE - email: " + user.rows[0].email);
            console.log("*** user.authenticate 002 - AUTHENTICATE - hash: " + user.rows[0].password_hash);

            resolve(user);
        }, function(err){
            reject();
        });
    });
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
        console.log("*** user.generateToken 003 - generateToken - JSON stringify");
        var stringData = JSON.stringify({id: user.rows[0].id, type: type});
        console.log("*** user.generateToken 004 - generateToken - encrypt data");
        var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString();
        // jwt.sign takes the data to encrypt and a password used to encrypt the data
        var token = jwt.sign({token: encryptedData}, 'qwerty098');
        return token;
    } catch(err){
        console.log("*** user.generateToken 009 - generateToken - catch error");
        console.error(err);
        return undefined;
    }
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

//INSERT INTO tokens VALUES (DEFAULT, '123abc', '09/26/2016 12:07:48 PDT', '09/26/2016 12:07:48 PDT')

        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query('Insert INTO tokens VALUES (DEFAULT, ($1), ($2), ($3)) RETURNING *', [hash, '09/26/2016 12:07:48 PDT', '09/26/2016 12:07:48 PDT'], function (err, tokenInstance) {
            resolve(tokenInstance);
        }, function(err){
            console.log("*** user.createToken 005 - createToken - INSERT error: " + err);
            reject();
        });
    });
};

//----------------------------------------------------------------------------------
// Write the access token to the db
exports.findToken = function(tokenHash){
    console.log("*** user.findToken 001 - ENTRY-POINT");
    console.log("*** user.findToken 002 - tokenHash: " + tokenHash);

    var qry = 'SELECT * FROM tokens t WHERE t."tokenHash" = $1::text';
    //var qry1 = 'SELECT * FROM tokens t WHERE t."tokenHash" = \'' + tokenHash + '\'';

    console.log("*** user.findToken 003 - qry: " + qry);
    //console.log("*** user.findToken 002 - qry1: " + qry1);

    return new Promise(function (resolve, reject){
        //-----------   |SQL Statement-----------------------------|  |$1 variable|
        dbConnect.query(qry, [tokenHash], function (err, tokenInstance) {
            console.log('*** user.findToken 004 - findToken - Success: ' + err);
            console.log('*** user.findToken 004.1 - tokenInstance Row Count: ' + tokenInstance.rowCount);
            console.log(tokenInstance);
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

            console.log("*** user.findByToken 001.1 - exec query");

            dbConnect.query('SELECT * FROM users WHERE id = ($1)', [tokenData.id], function (err, user) {
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
        dbConnect.query('SELECT * FROM users', function (err, users) {
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
