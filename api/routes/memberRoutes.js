var express = require('express');

var memberRoutes = function (Faculty, Member, Registration, College, Events) {
	var memberRouter = express.Router();

	var memberController = require('../controllers/memberController')(Faculty, Member, College);
	var facultyController = require('../controllers/facultyController')(Faculty, Registration);
	var registrationController = require('../controllers/registrationController')(Registration);
	var eventController = require('../controllers/eventController')(Events);
	var collegeController = require('../controllers/collegeController')(College);

	var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);
	var facultyMiddleware = require('../middlewares/getParamFaculty')(Faculty);
	var eventMiddleware = require('../middlewares/getParamEvent')(Events);
	var memberMiddleware = require('../middlewares/getParamMember')(Member);

	memberRouter.param('teamId', registrationMiddleware);
	memberRouter.param('facultyId', facultyMiddleware);
	memberRouter.param('eventId', eventMiddleware);
	memberRouter.param('memberId', memberMiddleware);

	memberRouter.patch('/faculty/verify/:facultyId', memberController.verifyFaculty);
	memberRouter.patch('/faculty/reject/:facultyId', memberController.rejectFaculty);
	memberRouter.get('/registration/exportUnconfirmedRegistration', registrationController.exportUnconfirmedRegistration);
	memberRouter.get('/faculty', facultyController.getAllFacultyCoordinators);

	// memberRouter.get('/registrations/', registrationController.getAllEventsRegistrationData);
	// memberRouter.post('/registrations/export', registrationController.exportRegistration);
	// memberRouter.get('/registrations/allEventsExport', registrationController.exportForCertificate);

	// memberRouter.patch('/settings/:memberId/changePassword', memberController.memberChangePassword);

	return memberRouter;
};

module.exports = memberRoutes;
