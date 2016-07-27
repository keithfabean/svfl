// app.js
// This module is the main site routing control server.

// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();

 // include the Main code file
 var main = require('./main.js')


// Global app configuration section
app.set('port', process.env.PORT || 3000);
app.set('views', 'site/views');  // Specify the folder to find templates
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

// //-------------------------------------------------------------
// //require/import the mongodb native drivers.
// var mongodb = require('mongodb');
//
// //We need to work with "MongoClient" interface in order to connect to a mongodb server.
// var MongoClient = mongodb.MongoClient;
//
// // Connection URL. This is where your mongodb server is running.
// //         mongodb://<dbuser>:<dbpassword>@ds019063.mlab.com:19063/svfl
// var url = 'mongodb://svflaccess:svfl@ds019063.mlab.com:19063/svfl';
//
// // Use connect method to connect to the Server
// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     //HURRAY!! We are connected. :)
//     console.log('Connection established to', url);
//
//     // do some work here with the database.
//     var collection = db.collection('SVFLOwner');
//
//     // Insert some users
//     collection.find().sort({grandTotals: -1}).toArray(function (err, owners) {
//       if (err) {
//         console.log(err);
//       } else if (owners.length) {
//         console.log('Found:', owners);
//         	res.render('pages/standings', { standings: owners, titleText: "SVFL Standings"})
//       } else {
//         console.log('No document(s) found with defined "find" criteria!');
//       }
//     });
//
//     //Close connection
//     //db.close();
//   }
// });
//-------------------------------------------

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

// Attach the Express app to Cloud Code.
app.listen(app.get('port'), function(){
//  console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to Terminate');
});
