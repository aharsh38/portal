var express = require('express');

var facultyRoutes = function (Faculty, Registration) {
	var facultyRouter = express.Router();
	var facultyController = require('../controllers/facultyController')(Faculty, Registration);



	// facultyRouter.get('/getFaculty', facultyController.getFaculty);
	facultyRouter.patch('/:facultyId/settings/changePassword', facultyController.facultyChangePassword);

	facultyRouter.post('/:facultyId/registrations/confirm', registrationController.confirmRegistration);

	facultyRouter.get('/:facultyId/registrations', registrationController.getFacultyRegistrations);

	facultyRouter.get('/:facultyId/registrationSummary', registrationController.getFacultySummary);

	// fac
	// facultyRouter.post('/forgotPasswordSet', facultyController.forgotPasswordSet);
	// facultyRouter.get('/registration', facultyController.seeRegistration);

	return facultyRouter;
};

module.exports = facultyRoutes;
