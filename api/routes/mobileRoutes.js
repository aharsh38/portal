var express = require('express');

var mobileRoutes = function (Faculty, Member, Registration, College, Events) {
	var mobileRouter = express.Router();

  var registrationController = require('../controllers/registrationController')(Registration);
  var eventController = require('../controllers/eventController')(Events);

  var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);
  var eventMiddleware = require('../middlewares/getParamEvent')(Events);

  memberRouter.param('teamId', registrationMiddleware);
  memberRouter.param('eventId', eventMiddleware);

  mobileRouter.get('/eventBySection', eventController.getEventsBySection);
  mobileRouter.get('/getSingleEvent/:eventId', eventController.getSingleEvent);
  mobileRouter.post('/create', registrationController.register);
  mobileRouter.get('/downloadSlip/:teamId', registrationController.downloadSlip);


	return mobileRouter;
};

module.exports = memberRoutes;
