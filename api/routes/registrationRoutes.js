var express = require('express');

var registrationRoutes = function (Registration) {
	var registrationRouter = express.Router();
	var registrationController = require('../controllers/registrationController')(Registration);
	var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);

	// registrationRouter.use('/:teamId', registrationMiddleware);
	registrationRouter.param('teamId', registrationMiddleware);

	registrationRouter.get('/getRegistration', registrationController.getRegistration);
	registrationRouter.get('/exportRegistration', registrationController.exportRegistration);
	registrationRouter.get('/getAllRegistrationData', registrationController.getAllRegistrationData);
	registrationRouter.post('/register', registrationController.register);
    registrationRouter.get('/downloadSlip/:teamId', registrationController.downloadSlip);
	//registrationAuthRouter.patch('/oneTimeEdit/:teamId', registrationController.oneTimeEdit);
	//export Registration
	return registrationRouter;
};

module.exports = registrationRoutes;
