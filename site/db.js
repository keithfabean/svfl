// db.js
// File to manage a PostgreSQL DB Connection

console.log('*** db.js *** - Entry Point');


//require/import the npm Postgres module.
var pg = require('pg');

var env = process.env.NODE_ENV || 'development';

    if (env ==='production'){
        console.log("*** db.js 001 - PRODUCTION - ENTRY-POINT");

        // Connection string for the Independant SVFL DataBase
        // var pgClient = new pg.Client({
        //     user: "ybiomfigpvqjzf",
        //     password: "i-ClJgj2cxGEuFtasAWgQkTvBS",
        //     database: "d4u42c1bctudfk",
        //     port: 5432,
        //     host: "ec2-54-163-238-215.compute-1.amazonaws.com",
        //     ssl: true
        // });

        // Connection for th integrated SVFL database
        var pgClient = new pg.Client({
            user: "ljgifvgtcccpxh",
            password: "sBsaLykzxWuXI7ZjR_QeZwpimM",
            database: "d6t3kl9igl2kdc",
            port: 5432,
            host: "ec2-23-23-95-27.compute-1.amazonaws.com",
            ssl: true
        });

        console.log("*** db.js 001.1 - PRODUCTION - Execute Connection");
        // Use connect method to connect to the Server
        pgClient.connect(function (err) {

            if (err) {
                console.log("*** db.js 001.2 - PRODUCTION - Unable to connect to the Heroku/Postgres server. Error:", err);
                // reject(err); // failure
            } else {
                //HURRAY!! We are connected.
                console.log("*** db.js 001.3 - PRODUCTION - Connection established to Production");
                // resolve(pgClient); // success
            }
        });

    } else{
        console.log("*** db.js 002 - LOCALHOST - ENTRY-POINT");
        var pgClient = new pg.Client({
            user: "postgres",
            password: "",
            database: "postgres",
            port: 5432,
            host: "localhost"
        });

        console.log("*** db.js 002.1 - LOCALHOST - Execute Connection");
        // Use connect method to connect to the Server
        pgClient.connect(function (err) {

            if (err) {
                console.log("*** db.js 002.2 - LOCALHOST - Unable to connect to the Heroku/Postgres server. Error:", err);
                // reject(err); // failure
            } else {
                //HURRAY!! We are connected.
                console.log("*** db.js 002.3 - LOCALHOST - Connection established to LocalHost");
                // resolve(pgClient); // success
            }
        });
    }

module.exports = pgClient;
