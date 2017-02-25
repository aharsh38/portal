var express = require('express');

var facultyRoutes = function (Faculty, Registration) {
	var facultyRouter = express.Router();
	var facultyController = require('../controllers/facultyController')(Faculty, Registration);

	facultyRouter.get('/getFaculty', facultyController.getFaculty);
	facultyRouter.post('/forgotPasswordSet', facultyController.forgotPasswordSet);
	facultyRouter.get('/registration', facultyController.seeRegistration);

	return facultyRouter;
};

module.exports = facultyRoutes;
