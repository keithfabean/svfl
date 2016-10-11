// middleware.js
// This module contains the functionality to ensure the user has signed in and has a current token.

console.log('*** Middleware.js *** - Entry Point');

var cryptojs = require('crypto-js');

//console.log('*** Middleware.js *** - require user.js')
// include the Main code file
//var user = require('./user.js')

var exports = module.exports = {};

exports.requireAuthentication = function(req, res, next){
            console.log('*** Middleware.js *** - 1');
            sess = req.session;

            console.log('*** Middleware.js *** - Session Auth: ' + sess.Auth);

            if(!sess.Auth) {
                //next();
                res.redirect('/signin');
            }
            var token = sess.Auth;

            //var token = req.get('Auth') || '';
            //var token = req.header('Auth') || '';

            var tokenHash = cryptojs.MD5(token).toString();

            //Session set when user Request our app via URL
            console.log('*** middleware.requireAuthentication - token: ' + token);
            console.log('*** middleware.requireAuthentication - tokenHash: ' + tokenHash);

            // If the token exists in the DB we're good to go
            console.log('*** Middleware.js *** - 2');
            user.findToken(tokenHash).then(function(tokenInstance){
                console.log('*** middleware.requireAuthentication - tokenInstance: ');
                console.log(tokenInstance);
                if (!tokenInstance || tokenInstance.rowCount === 0){
                    console.log('*** middleware.requireAuthentication - NO TOKENINSTANCE:');
                    //throw new error();
                    req.session.error = 'Please sign in!';
                    //next();
                    res.redirect('/signin');
                }

                req.token = tokenInstance;
                return user.findByToken(token);
            }).then(function(userInstance){
                req.user = userInstance;
                next();
            }).catch(function(){
                console.log('*** middleware.requireAuthentication - CATCH ERROR:');
                //req.session.error = 'Please sign in!';
                res.redirect('/signin');
                //res.status(401).send();
            });
};
