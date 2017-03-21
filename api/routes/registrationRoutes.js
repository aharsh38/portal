var express = require('express');

var registrationRoutes = function (Registration) {
	var registrationRouter = express.Router();
	var registrationController = require('../controllers/registrationController')(Registration);
	var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);

	// registrationRouter.use('/:teamId', registrationMiddleware);
	// registrationRouter.param('teamId', registrationMiddleware);

	// registrationRouter.get('/getRegistration', registrationController.getRegistration);
	// registrationRouter.get('/exportRegistration', registrationController.exportRegistration);
	// registrationRouter.get('/getAllRegistrationData', registrationController.getAllRegistrationData);
	registrationRouter.post('/create', registrationController.register);
	registrationRouter.get('/downloadSlip/:teamId', registrationController.downloadSlip);
	registrationRouter.get('/confirm/downloadSlip/:teamId', registrationController.downloadConfirmSlip);
	//registrationAuthRouter.patch('/oneTimeEdit/:teamId', registrationController.oneTimeEdit);
	//export Registration
	return registrationRouter;
};

module.exports = registrationRoutes;
