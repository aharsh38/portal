var express = require('express');
// var favicon = require('serve-favicon');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var config = require('./api/config/config');
require('./api/config/passport');

var dbURI = 'mongodb://gtutest:gtutechfestldce17@ds161039.mlab.com:61039/gtutechfesttest';

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

// app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static('public'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
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

var authRouter = require('./api/routes/authRoutes')(Faculty, Member);
app.use('/api/auth', authRouter);

// var collegeRouter = require('./api/routes/collegeRoutes')(College);
// app.use('/api/college', collegeRouter);
//
// var eventRouter = require('./api/routes/eventRoutes')(Events);
// app.use('/api/event', eventRouter);

// var memberRouter = require('./api/routes/memberRoutes')(Faculty, Member, Registration, College, Events);
// app.use('/api/members', memberRouter);
//
// var facultyRouter = require('./api/routes/facultyRoutes')(Faculty, Registration);
// app.use('/api/faculty', facultyRouter);
//
// var registrationRouter = require('./api/routes/registrationRoutes')(Registration);
// app.use('/api/registration', registrationRouter);

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
