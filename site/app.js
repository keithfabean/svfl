// app.js
// This module is the main site routing control server.

console.log('*** app.js *** - Entry Point')


// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

// These lines are required to set up Express session management.
session = require('express-session');
app.use(session({secret: '@#Sv%$fL*&'}));
var sess;

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

console.log('*** app.js *** - require db.js');
// include the Database connection code file
dbConnect = require('./db.js')

//----------------------------------------------------------------------------------------------
//******* include the other code modules
//----------------------------------------------------------------------------------------------

console.log('*** app.js *** - require main.js');
// include the Main code file
//var main = require('./main.js')
main = require('./main.js')

console.log('*** app.js *** - require user.js');
// include the Main code file
//var user = require('./user.js')
user = require('./user.js')

//******CHANGED*******
console.log('*** app.js *** - require middleware.js');
//var middleware = require('./middleware.js')(db);
var middleware = require('./middleware.js');
//******CHANGED*******


//----------------------------------------------------------------------------------------------
//**              BEGIN APPLICATION ROUTES
//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {
//		console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/home', {titleText: "SVFL Home" });
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/about', function(req, res) {
//		console.log("*** app.get/about 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/about', {titleText: 'SVFL About'});
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/contact', middleware.requireAuthentication, function(req, res) {
//		console.log("*** app.get/contact 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/contact', { titleText: 'SVFL Contact Information' });
});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/home', function(req, res) {
//		console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/home', {titleText: 'SVFL Home'});
});

//----------------------------------------------------------------------------------------------

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/standings', middleware.requireAuthentication, function(req, res) {
//app.get('/standings', function(req, res) {
    console.log("*** app.get/standings 001 - ENTRY-POINT");
    //	console.log("*** app.get/standings 002 - Request.body.username: " + req.body.username);

    console.log("*** app.get/standings 002 - GETSTANDINGS - BEFORE-CALL");
    main.getStandings(req, res, function(owners) {
        console.log("*** app.get/standings 003 - RUN-GETSTANDINGS - SUCCESS ENTRY-POINT");
        console.log("*** app.get/standings 003.1 - getStandings Function Results: " + owners.rows);
        console.log("*** app.get/standings 003.2 - getStandings Function Results: " + owners.rows[0].firstName);

        res.render('pages/standings', { standings: owners, titleText: "SVFL Standings"})

        console.log("*** app.get/standings 004 - RUN-GETSTANDINGS - SUCCESS EXIT-POINT");
    },function(error) {
        console.log("*** app.get/standings 005 - RUN-GETSTANDINGS - ERROR EXIT-POINT");
        console.log(error);
    });	//end getStandings

    console.log("*** app.get/standings 010 - EXIT-POINT");
}); //end /standings

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

app.get('/register', function(req, res){

  res.render('pages/register', {titleText: 'SVFL Registration'});

});

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

});

//----------------------------------------------------------------------------------------------
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/signin', function(req, res) {
//		console.log("*** app.get/home 001 - Logged In UserName: " + Parse.User.current().get('username'));
        res.render('pages/signin', {titleText: "SVFL Sign In", authErrMessage: "Could not Authenticate."});
});

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

        console.log('*** app.post/user/login 002 - AUTHENTICATE - PROMISE RETURN ENTRY-POINT');
        console.log(userResult);
        //var token = user.generateToken('authentication', userResult);
        token = user.generateToken('authentication', userResult);

        console.log("*** app.post/user/login 003 - AUTHENTICATE - Value of Token: ");
        console.log(token);

        userInstance = userResult;

        console.log('**** app.post user/login **** - userInstance: ');
        console.log(userInstance);

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

        // console.log('*** app.post/user/login 011a - setting the Content-Type Header')
        // res.setHeader('Content-Type', 'application/json');

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
          //res.end('done');

        res.redirect('/standings');
    }).catch(function(err) {
        //res.status(401).send('Could not authenticate.' + err);
        console.log("*** app.post/user/login 020 - CATCH Block REDIRECT - SIGNIN");
        res.redirect('/signin');
    });

});


//----------------------------------------------------------------------------------------------

// Attach the Express app to Cloud Code.
app.listen(app.get('port'), function(){
//  console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to Terminate');
});
