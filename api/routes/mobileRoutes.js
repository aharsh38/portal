var express = require('express');

var mobileRoutes = function (Registration, Events) {
	var mobileRouter = express.Router();
	console.log("PROBLEM HERE 2");
	var registrationController = require('../controllers/registrationController')(Registration);
	var eventController = require('../controllers/eventController')(Events);

	var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);
	var eventMiddleware = require('../middlewares/getParamEvent')(Events);

	mobileRouter.param('teamId', registrationMiddleware);
	mobileRouter.param('eventId', eventMiddleware);

	mobileRouter.get('/eventBySection', eventController.getEventsBySection);
	mobileRouter.get('/getSingleEvent/:eventId', eventController.getSingleEvent);
	mobileRouter.post('/create', registrationController.register);
	mobileRouter.get('/downloadSlip/:teamId', registrationController.downloadSlip);
	mobileRouter.get('/getAllEvents', eventController.getAllEvents);
	mobileRouter.get('/eventSection/:eventsection', eventController.getEventsBySectionM);


	return mobileRouter;
};

module.exports = mobileRoutes;
