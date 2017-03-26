var express = require('express');
// var favicon = require('serve-favicon');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var config = require('./api/config/config');
//var cors = require('cors');
//var cors = require('express-cors');
var request = require('request');
require('./api/config/passport');

var dbURI = config.mongoURI;

// var dbURI = "mongodb://localhost/gtutechfest1";

// var dbURI = "mongodb://localhost/gtutestingFinal";
//var dbURI = "mongodb://localhost/gtutesting";

// var dbURI = 'mongodb://hraw1699:fdtdcdr6m@ds161039.mlab.com:61039/gtutechfesttest';
//var dbURI = "mongodb://localhost/gtutestingFinal";
//var dbURI = "mongodb://localhost/gtutesting";

// var dbURI = 'mongodb://hraw:fdtdcdr6m@ds131480.mlab.com:31480/gtutechfesttest1';
//var dbURI = 'mongodb://gtutest1:fdtdcdr6m@ds161039.mlab.com:61039/gtutechfesttest';

//var dbURI = 'mongodb://hraw1699:fdtdcdr6m@ds161039.mlab.com:61039/gtutechfesttest';
// var whitelist = ['http://portal.gtu.ac.in', 'http://techfest.gtu.ac.in'];
// var corsOptions = {
//     origin: function(origin, callback) {
//         console.log(origin);
//         var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
//         callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
//     }
// };

// var dbURI = config.testMongo;

mongoose.Promise = global.Promise;

var db = mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});


var app = express();
var port = 9000;
app.set('x-powered-by', false);

app.use(function (request, response, next) {
	console.log("IP:::::   ", request.connection.remoteAddress);
	next();
});

// app.use(cors({
//     allowedOrigins: [
//         'techfest.gtu.ac.in.com'
//     ]
// }))
// app.use(cors(corsOptions));
// app.use(helmet());

app.use(express.static('public'));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
// app.post('/submit',function(req,res){
//   // g-recaptcha-response is the key that browser will generate upon form submit.
//   // if its blank or null means user has not selected the captcha, so return the error.
//   if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
//     return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
//   }
//   // Put your secret key here.
//   var secretKey = "<<put your secret key>>";
//   // req.connection.remoteAddress will provide IP address of connected user.
//   var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
//   // Hitting GET request to the URL, Google will respond with success or error scenario.
//   request(verificationUrl,function(error,response,body) {
//     body = JSON.parse(body);
//     // Success will be true or false depending upon captcha validation.
//     if(body.success !== undefined && !body.success) {
//       return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
//     }
//     res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
//   });
// });
app.use(bodyParser.json());

app.use(passport.initialize());


var authenticate = require('./api/middlewares/authenticate')(config);
var College = require('./api/models/collegeModel');
var Events = require('./api/models/eventModel');
var Member = require('./api/models/memberModel');
var Faculty = require('./api/models/facultyModel');
var Registration = require('./api/models/registrationModel');

// var registrationController = require('./api/controllers/registrationController')(Registration);
// registrationController.generatePDFTest();

//var authRouter = require('./api/routes/authRoutes')(Faculty, Member);
//app.use('/api/auth', authRouter);

var mobileRouter = require('./api/routes/mobileRoutes')(Registration, Events);
app.use('/api/mobile', mobileRouter);

//
var collegeRouter = require('./api/routes/collegeRoutes')(College);
app.use('/api/college', collegeRouter);
//
// // var eventRouter = require('./api/routes/eventRoutes')(Events);
// // app.use('/api/event', eventRouter);
//
//var memberRouter = require('./api/routes/memberRoutes')(Faculty, Member, Registration, College, Events);
// app.use('/api/members', memberRouter);
//app.use('/api/members', authenticate.memberAuth, memberRouter);
//
var facultyRouter = require('./api/routes/facultyRoutes')(Faculty, Registration);
//app.use('/api/faculty', facultyRouter);
app.use('/api/faculty', authenticate.facultyAuth, facultyRouter);
//
var registrationRouter = require('./api/routes/registrationRoutes')(Registration);
app.use('/api/registration', registrationRouter);

// app.listen(port, function () {
// 	console.log("Now Running on port " + port);
// });




app.get('*', function (request, response) {
	response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, function () {
	console.log("Now Running on port" + port);
});

module.exports = app;
