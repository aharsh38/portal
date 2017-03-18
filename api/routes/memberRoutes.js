var express = require('express');
var multipart = require('connect-multiparty');


var memberRoutes = function (Faculty, Member, Registration, College, Events) {
	var memberRouter = express.Router();
	var multipartMiddleware = multipart({
		autoFiles: true,
		maxFileSize: 2000000
	});

	var memberController = require('../controllers/memberController')(Faculty, Member, College);
	var facultyController = require('../controllers/facultyController')(Faculty, Registration);
	var registrationController = require('../controllers/registrationController')(Registration);
	var eventController = require('../controllers/eventController')(Events);
	var collegeController = require('../controllers/collegeController')(College);

<<<<<<< HEAD
	var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);
	var facultyMiddleware = require('../middlewares/getParamFaculty')(Faculty);
	var eventMiddleware = require('../middlewares/getParamEvent')(Events);
	var memberMiddleware = require('../middlewares/getParamMember')(Member);
=======
    memberRouter.use('/upload', multipartMiddleware, function(request, response, next) {
        console.log("Mulipart");
        next();
    });
    memberRouter.use('/uploadImage', multipartMiddleware, function(request, response, next) {
        console.log("Mulipart");
        next();
    });
    memberRouter.use('/uploadIcons', multipartMiddleware, function(request, response, next) {
        console.log("Mulipart");
        next();
    });
>>>>>>> master

	memberRouter.use('/upload', multipartMiddleware, function (request, response, next) {
		console.log("Mulipart");
		next();
	});
	memberRouter.use('/uploadImage', multipartMiddleware, function (request, response, next) {
		console.log("Mulipart");
		next();
	});

	memberRouter.param('teamId', registrationMiddleware);
	memberRouter.param('facultyId', facultyMiddleware);
	memberRouter.param('eventId', eventMiddleware);
	memberRouter.param('memberId', memberMiddleware);


	memberRouter.patch('/faculty/verify/:facultyId', memberController.verifyFaculty);
	memberRouter.patch('/faculty/reject/:facultyId', memberController.rejectFaculty);


	memberRouter.get('/registration/eventRegistrationData', registrationController.getAllEventsRegistrationData);
	memberRouter.get('/registration/exportUnconfirmedRegistration', registrationController.exportUnconfirmedRegistration);
	memberRouter.get('/faculty', facultyController.getAllFacultyCoordinators);


	memberRouter.get('/registration/exportUnconfirmedRegistration', registrationController.exportUnconfirmedRegistration);
	memberRouter.get('/faculty', facultyController.getAllFacultyCoordinators);

<<<<<<< HEAD
	// memberRouter.get('/registrations/', registrationController.getAllEventsRegistrationData);
	memberRouter.get('/importCollege', collegeController.importCollege);
=======
    memberRouter.post('/upload', eventController.uploadDocs);
    memberRouter.post('/uploadImage', eventController.uploadImage);
    memberRouter.post('/uploadIcons', eventController.uploadIcons);
>>>>>>> master

	memberRouter.post('/upload', eventController.uploadDocs);
	memberRouter.post('/uploadImage', eventController.uploadImage);

	memberRouter.get('/exportVFSList', facultyController.exportVFSList);
	memberRouter.get('/exportUVFList', facultyController.exportUVFList);

	// memberRouter.route('/events_in_section').get(eventController.getEventsBySection);
	memberRouter.route('/events')
		.post(eventController.createEvent)
		.get(eventController.getAllEvents);

	memberRouter.route('/events/:eventId')
		.get(eventController.getSingleEvent)
		.put(eventController.updateEvent)
		.delete(eventController.deleteEvent);

	// memberRouter.get('/registrations/', registrationController.getRegistration);
	memberRouter.post('/registrations/export', registrationController.exportRegistration);
	// memberRouter.get('/registrations/allEventsExport', registrationController.exportForCertificate);

	memberRouter.patch('/settings/changePassword', memberController.memberChangePassword);

	return memberRouter;
};

module.exports = memberRoutes;
