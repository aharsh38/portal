var express = require('express');

var mobileRoutes = function(Faculty, Member, Registration, College, Events) {
    var mobileRouter = express.Router();

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
    mobileRouter.get('/getEventsBySectionM', eventController.getEventsBySectionM);


    return mobileRouter;
};

module.exports = mobileRoutes;
