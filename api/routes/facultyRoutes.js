var express = require('express');

var facultyRoutes = function (Faculty, Registration) {
	var facultyRouter = express.Router();
	var facultyController = require('../controllers/facultyController')(Faculty, Registration);
	var registrationController = require('../controllers/registrationController')(Registration);

	var facultyMiddleware = require('../middlewares/getParamFaculty')(Faculty);

	facultyRouter.param('facultyId', facultyMiddleware);

	facultyRouter.patch('/settings/changePassword', facultyController.facultyChangePassword);
	facultyRouter.post('/:facultyId/registrations/confirm', facultyController.confirmRegistration);
	facultyRouter.get('/:facultyId/registrations', registrationController.getFacultyRegistrations);
	facultyRouter.post('/:facultyId/addStudentCoordinator', facultyController.addStudentCoordinator);
	facultyRouter.get('/getFaculty', facultyController.getFaculty);

	// facultyRouter.post('/:facultyId/studentCoordinator', facultyController.addStudentController);
	// facultyRouter.put('/:facultyId/studentCoordinator/edit', facultyController.editStudentController);


	//To Remove
	// facultyRouter.get('/:facultyId/registrations/summary', registrationController.getFacultySummary);

	return facultyRouter;
};

module.exports = facultyRoutes;
