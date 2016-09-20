// app.js
// This module is the main site routing control server.

// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var _ = require('underscore');

// include the Main code file
var main = require('./main.js')


// Global app configuration section
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');  // Specify the folder to find templates
//app.set('views', 'views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine

// app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.

//app.use(express.static(_dirname + '/public'));    // Middleware Directory that contains statis content & css files
//app.use(express.bodyParser());    // Middleware for reading request body

//app.use(express.cookieParser('YOUR_SIGNING_SECRET'));
//app.use(express.cookieSession({ cookie: { maxAge: 3600000 } }));

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
app.get('/contact', function(req, res) {
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
app.get('/standings', function(req, res) {
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
  main.getUsers(req, res, function(users) {
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

app.post('/user', function(req, res){
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

// Attach the Express app to Cloud Code.
app.listen(app.get('port'), function(){
//  console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to Terminate');
});
