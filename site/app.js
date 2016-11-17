// app.js
// This module is the main site routing control server.

console.log('*** app.js *** - Entry Point')


// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

// These lines are required to set up Express session management.
session = require('express-session');
app.use(session({
                secret: '@#Sv%$fL*&',
                resave: false,
                saveUninitialized: false
            }
));

// Define variables
var sess;
gOwner = '';

// Global app configuration section
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');  // Specify the folder to find templates
//app.set('views', 'views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine

// app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.

// Middleware for reading request body
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(express.static(_dirname + '/public'));    // Middleware Directory that contains static content & css files

//app.use(express.cookieParser('YOUR_SIGNING_SECRET'));
//app.use(express.cookieSession({ cookie: { maxAge: 3600000 } }));

var _ = require('underscore');
var moment = require('moment');
var now = moment();

console.log('*** app.js *** - require db.js');
// include the Database connection code file
dbConnect = require('./db.js');

//----------------------------------------------------------------------------------------------
//******* include the other code modules
//----------------------------------------------------------------------------------------------

console.log('*** app.js *** - require main.js');
// include the Main code file
//var main = require('./main.js')
main = require('./main.js');

console.log('*** app.js *** - require user.js');
// include the User code file
//var user = require('./user.js')
user = require('./user.js');

// console.log('*** app.js *** - require nfldata.js');
// include the NFLData code file
nfldata = require('./nfldata.js');

console.log('*** app.js *** - require middleware.js');
//var middleware = require('./middleware.js')(db);
var middleware = require('./middleware.js');

// Delay getting this weeks games until dbConnect hasbeen established.
setTimeout(function (){

    nfldata.getThisWeekGames(function(games) {
        console.log('*** app.js *** - Return from getThisWeekGames');

        twGames = games

        console.log('*** app.js *** - getThisWeekGames GAMES ROWCOUNT: ' + games.rowCount);
        console.log('*** app.js *** - getThisWeekGames twGames ROWCOUNT: ' + twGames.rowCount);

        console.log('*** app.js *** - Return from getThisWeekGames - SUCCESS EXIT-POINT');
    },function(error) {
        console.log('*** app.js *** - getThisWeekGames ERROR: ' + error);
        console.log(error);
    });	//end getThisWeekGames

    //     nfldata.getThisWeekGames().then(function (games){
    //         console.log('*** app.js *** - Return from getThisWeekGames');
    //         twGames = games
    //         console.log(games.rowCount);
    //         console.log(twGames.rows);
    //
    //     }).catch(function(err) {
    //         //res.status(401).send('Could not authenticate.' + err);
    //         console.log('*** app.js *** - CATCH Block Get This Week Games');
    //         //res.redirect('/signin');
    //     });

}, 1000);   // delay 1 seconds

//----------------------------------------------------------------------------------------------
//**              BEGIN APPLICATION ROUTES
//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/', function(req, res) {
    //console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));

    res.render('pages/home', {titleText: "SVFL Home", games: twGames, owner: gOwner });
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/about', function(req, res) {
//		console.log("*** app.get/about 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/about', {titleText: 'SVFL About', games: twGames, owner: gOwner});
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/contact', middleware.requireAuthentication, function(req, res) {
//		console.log("*** app.get/contact 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/contact', { titleText: 'SVFL Contact Information', games: twGames, owner: gOwner });
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/draft', middleware.requireAuthentication, function(req, res) {
    //		console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));
    gOwner = req.user

    nfldata.getPlayersForDraft(req, res).then(function(players){

        var qBacks = players.qb
        console.log('*** app.get/draft - *** PLAYERS.QBACKS Count: ' + qBacks.rowCount);
        var kickers = players.kickers
        console.log('*** app.get/draft - *** PLAYERS.KICKERS Count: ' + kickers.rowCount);
        playersList = players;

        ownerId = gOwner.rows[0].owner_id;
        return main.getRosterByOwner(ownerId);

    }).then(function(ownerRoster){
        console.log('*** app.get/draft - *** OWNERROSTER Count: ' + ownerRoster.rowCount);

        res.render('pages/draft', {titleText: 'SVFL Draft', games: twGames, owner: gOwner, playerList: playersList, roster: ownerRoster});

    }).catch(function(err) {
//    }), function(err) {
        console.log("*** app.get/draft *** - ERROR EXIT-POINT");
        console.log(err);
        //res.status(500).send();
    });


    //res.render('pages/draft', {titleText: 'SVFL Draft', games: twGames, players: players});
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.post('/draft', middleware.requireAuthentication, function(req, res) {

    console.log("*** app.post/draft *** - Request.Body.Ownerid" + req.body.ownerid);
    console.log("*** app.post/draft *** - Request.Body.AddPlayerId" + req.body.addplayerId);

    main.addRoster(req).then(function(rosterItem){
        console.log('*** app.post/draft - *** ROSTERITEM Count: ' + rosterItem.rowCount);
        res.redirect('/draft');

    }, function(err) {
        console.log("*** app.post/draft *** - ERROR EXIT-POINT");
        console.log(err);
        //res.status(500).send();
    });


});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/home', function(req, res) {
//		console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/home', {titleText: 'SVFL Home', games: twGames, owner: gOwner});
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/standings', middleware.requireAuthentication, function(req, res) {
//app.get('/standings', function(req, res) {
    console.log("*** app.get/standings 001 - ENTRY-POINT");
    //gOwner = req.user

    console.log("*** app.get/standings 003.3 - getStandings gOwner ROWCOUNT: " + gOwner.rowCount);
    console.log("*** app.get/standings 003.4 - getStandings gOwner ROW 0 FIRSTNAME: " + gOwner.rows[0].full_name);

    //	console.log("*** app.get/standings 002 - Request.body.username: " + req.body.username);

    console.log("*** app.get/standings 002 - GETSTANDINGS - BEFORE-CALL");
    main.getStandings(req, res, function(weekStandings) {
        console.log("*** app.get/standings 003 - RUN-GETSTANDINGS - SUCCESS ENTRY-POINT");
        console.log("*** app.get/standings 003.1 - getStandings weekStanding ROWCOUNT: " + weekStandings.rowCount);
        console.log("*** app.get/standings 003.2 - getStandings weekStanding ROW 0 FIRSTNAME: " + weekStandings.rows[0].first_name);

        res.render('pages/standings', { titleText: "SVFL Standings", standings: weekStandings, games: twGames, owner: gOwner})

        console.log("*** app.get/standings 004 - RUN-GETSTANDINGS - SUCCESS EXIT-POINT");
    },function(error) {
        console.log("*** app.get/standings 005 - RUN-GETSTANDINGS - ERROR EXIT-POINT");
        console.log(error);
    });	//end getStandings

    console.log("*** app.get/standings 010 - EXIT-POINT");
}); //end /standings

//----------------------------------------------------------------------------------------------
// This is route request for displaying the lineup page
//----------------------------------------------------------------------------------------------

app.get('/lineup', middleware.requireAuthentication, function(req, res){
    console.log('*** app.get/lineup - *** ENTRY POINT');

    gOwner = req.user
    ownerId = gOwner.rows[0].owner_id;

    main.getRosterByOwner(ownerId).then(function(ownerRoster){
        console.log('*** app.get/lineup - *** OWNERROSTER Count: ' + ownerRoster.rowCount);

        res.render('pages/lineup', {titleText: 'SVFL Line-Up', games: twGames, owner: gOwner, roster: ownerRoster});

    }).catch(function(err) {
        console.log("*** app.get/lineup *** - ERROR EXIT-POINT");
        console.log(err);
        //res.status(500).send();
    });

});

//----------------------------------------------------------------------------------------------
// This is route request for displaying the lineup page
//----------------------------------------------------------------------------------------------

app.post('/lineup', middleware.requireAuthentication, function(req, res){
    console.log('*** app.post/lineup - *** ENTRY POINT');

    console.log("*** app.post/lineup *** - Request.Body: ");
    console.log(req.body);

    // user.createLineup(req).then(function(rosterItem){
    //     console.log('*** app.post/lineup - *** ROSTERITEM Count: ' + rosterItem.rowCount);
        res.redirect('/lineup');

    // }, function(err) {
    //     console.log("*** app.post/lineup *** - ERROR EXIT-POINT");
    //     console.log(err);
    //     //res.status(500).send();
    // });

});

//----------------------------------------------------------------------------------------------
// This is route request for logging out
//----------------------------------------------------------------------------------------------

app.get('/logout', function(req, res) {
    console.log('*** Middleware.js *** - Session Auth: ' + sess.Auth);

    sess = req.session;
    //
    // if(!sess.Auth) {
    //     //next();
    //     res.redirect('/signin');
    // }
    var token = sess.Auth;

    user.deleteToken(token).then(function (tokenInstance) {
        req.session.destroy(function(err) {
            if(err) {
                console.log('*** app.get/logout - SessionDestroy - ERROR: ' + err);
                res.redirect('back');
            } else {
                res.redirect('/signin');
            }
        })
    }).catch(function(err) {
        console.log("*** app.post/user/login 020 - CATCH Block REDIRECT - SIGNIN");
        //res.status(401).send('Could not authenticate.' + err);
        res.redirect('/signin');
    });
});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.get('/moves', middleware.requireAuthentication, function(req, res){

    res.render('pages/moves', {titleText: 'SVFL Line-Up', games: twGames, owner: gOwner});

});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.get('/register', function(req, res){

//  res.render('pages/register', {titleText: 'SVFL Registration', games: twGames, owner: gOwner});

});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.post('/register', function(req, res){
  // //Make sure only valid fields are in the body
  // var body = _.pick(req.body, 'userId', 'password');
  //
  // db.user.create(body).then(function(user){
  //     res.status(200).json(user.toPublicJSON());
  // }, function(err){
  //   console.log(body);
  //   console.log(err);
  //   res.status(400).json(err);
  // });

  console.log("*** app.post/register *** - Request.Body.Ownerid: " + req.body.email);
  console.log("*** app.post/register *** - Request.Body.Password: " + req.body.password);

  user.createUser(req).then(function(user){

      console.log('*** app.post/register - *** USER Count: ' + user.rowCount);
      res.status(200).json(user);

//            res.redirect('/standings');

  }, function(err) {
      console.log("*** app.post/draft *** - ERROR EXIT-POINT");
      console.log(err);
      res.status(400).json(err);
  });


});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.get('/rosters', middleware.requireAuthentication, function(req, res){
    console.log('*** app.get/rosters - *** ENTRY POINT');

    gOwner = req.user
    ownerId = gOwner.rows[0].owner_id;

    main.getRosters(req, res).then(function(ownerRoster){
        console.log('*** app.get/rosters - *** OWNERROSTER Count: ' + ownerRoster.rowCount);

        res.render('pages/rosters', {titleText: 'SVFL Line-Up', games: twGames, owner: gOwner, roster: ownerRoster});

    }).catch(function(err) {
        console.log("*** app.get/rosters *** - ERROR EXIT-POINT");
        console.log(err);
        //res.status(500).send();
    });

    //res.render('pages/rosters', {titleText: 'SVFL Rosters', games: twGames, owner: gOwner});

});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.get('/rules', middleware.requireAuthentication, function(req, res){

    res.render('pages/rules', {titleText: 'SVFL Rosters', games: twGames, owner: gOwner});

});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.get('/scoring', middleware.requireAuthentication, function(req, res){

    res.render('pages/scoring', {titleText: 'SVFL Scoring', games: twGames, owner: gOwner});

});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.get('/signin', function(req, res) {
//		console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));

    console.log('*** app.get/signin *** - twGames ROWCOUNT: ' + twGames.rowCount);

    res.render('pages/signin', {titleText: "SVFL Sign In", games: twGames, owner: gOwner, authErrMessage: "Could not Authenticate."});
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
//----------------------------------------------------------------------------------------------

app.post('/signin', function(req, res){
    console.log("*** app.post/signin 001 - SUCCESS ENTRY-POINT");
    console.log('*** app.post/signin 001 - Request Body:');
    //console.log(req);
    console.log(req.body);

    //Make sure only valid fields are in the body
    var body = _.pick(req.body, 'email', 'password');

    console.log('*** app.post/signin 001.1 - Body:');
    console.log(body);

    var userInstance;
    var token;

    user.authenticate(body).then(function (userResult){
        sess = req.session;

        console.log('*** app.post/user/signin - AUTHENTICATE - PROMISE RETURN ENTRY-POINT');
        console.log('*** app.post/user/signin - USERRESULT.ROWCOUNT: ' + userResult.rowCount);

        token = user.generateToken('authentication', userResult);

        console.log("*** app.post/user/login 003 - AUTHENTICATE - Value of Token: ");
        console.log(token);

        userInstance = userResult;
        gOwner = userInstance.rows[0];

        console.log('**** app.post user/login **** - userInstance/gOwner: ');
        console.log(userInstance);
        console.log(gOwner);

        return user.createToken(token);

    }).then(function(tokenInstance){
        console.log("*** app.post/user/login 008 - USER: ");
        console.log(userInstance.rows[0]);
        console.log("*** app.post/user/login 009 - TOKEN: ");
        console.log(token);
        console.log("*** app.post/user/login 010 - TOKENINSTANCE.rows[0]: ");
        console.log(tokenInstance.rows[0]);
        console.log("*** app.post/user/login 011 - TOKENHASH: ");
        console.log(tokenInstance.rows[0].tokenHash);

        console.log('*** app.post/user/login 012 - setting the AUTH header userInstance.row')
        //res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
        //res.setHeader('Auth', token).json(userInstance.rows[0]);
        res.setHeader('Auth', token);

        var verToken = res.getHeader('Auth') || 'Nada';
        console.log('*** app.post/user/login 013 - Verify the AUTH header: ' + verToken);

        //In this we are assigning email to sess.email variable.
        //email comes from HTML page.
          sess.Auth = token;
          sess.owner = userInstance.rows[0];
//          gOwner = userInstance.rows[0];
          //res.end('done');

        res.redirect('/standings');
    }).catch(function(err) {
        //res.status(401).send('Could not authenticate.' + err);
        console.log("*** app.post/user/login 020 - CATCH Block REDIRECT - SIGNIN");
        res.redirect('/signin');
    });

});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.get('/trades', middleware.requireAuthentication, function(req, res){

    res.render('pages/trades', {titleText: 'SVFL Trades', games: twGames, owner: gOwner});

});

//----------------------------------------------------------------------------------------------
// This is route request for
//----------------------------------------------------------------------------------------------

app.post('/trades', middleware.requireAuthentication, function(req, res){

    res.redirect('/trades');

});

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
// This route request is UNUSED by the app.  Test for returning Game list
//----------------------------------------------------------------------------------------------

app.get('/games', function(req, res){
  // //Make sure only valid fields are in the body
  // var body = _.pick(req.body, 'userId', 'password');

  nfldata.getThisWeekGames(req, res, function(games) {
      console.log("*** app.get/games 003 - RUN-getThisWeekGames - SUCCESS ENTRY-POINT");
      console.log("*** app.get/games 003.1 - getThisWeekGames Function Results: " + games.rows);

      res.status(200).json(games);

      console.log("*** app.get/users 004 - RUN-getThisWeekGames - SUCCESS EXIT-POINT");
  },function(error) {
      console.log("*** app.get/users 005 - RUN-getThisWeekGames - ERROR EXIT-POINT");
      console.log(error);
  });	//end GETUSERS


  // user.getThisWeekGames().then(function (games){
  //     console.log('*** *** app.get/ *** - Return from getThisWeekGames');
  //     twGames = games;
  //     console.log(games.rowCount);
  //     console.log(twGames.rows);
  //
  //     res.status(200).json(games);
  //
  // }).catch(function(err) {
  //     console.log('*** *** app.get/ *** - CATCH Block Get This Week Games' + err);
  //     res.status(401).send('Could not find Games.' + err);
  //     //res.redirect('/signin');
  // });



});

//----------------------------------------------------------------------------------------------
// This route request is UNUSED by the app.  Test for returning User list
//----------------------------------------------------------------------------------------------
app.get('/users', function(req, res){
  // //Make sure only valid fields are in the body
  // var body = _.pick(req.body, 'userId', 'password');
  //
  user.getUsers(req, res, function(users) {
      console.log("*** app.get/users 003 - RUN-GETUSERS - SUCCESS ENTRY-POINT");
      console.log("*** app.get/users 003.1 - getUsers Function Results: " + users.rows);

      res.status(200).json(users);
//      res.render('pages/standings', { standings: owners, titleText: "SVFL Standings"})

      console.log("*** app.get/users 004 - RUN-GETUSERS - SUCCESS EXIT-POINT");
  },function(error) {
      console.log("*** app.get/users 005 - RUN-GETUSERS - ERROR EXIT-POINT");
      console.log(error);
  });	//end GETUSERS

});

//----------------------------------------------------------------------------------------------

// Attach the Express app to Cloud Code.
app.listen(app.get('port'), function(){
//  console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to Terminate');
    console.log('*** Fantasy Football App Started ***')
});
