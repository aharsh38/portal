var express = require('express');
var multipart = require('connect-multiparty');

var registrationRoutes = function (Registration) {
	var registrationRouter = express.Router();
	var registrationController = require('../controllers/registrationController')(Registration);
	var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);

	memberRouter.use('/upload/pitch', multipartMiddleware, function (request, response, next) {
		console.log("Mulipart");
		next();
	});
	// registrationRouter.use('/:teamId', registrationMiddleware);
	// registrationRouter.param('teamId', registrationMiddleware);

	// registrationRouter.get('/getRegistration', registrationController.getRegistration);
	// registrationRouter.get('/exportRegistration', registrationController.exportRegistration);
	// registrationRouter.get('/getAllRegistrationData', registrationController.getAllRegistrationData);
	registrationRouter.post('/create', registrationController.register);
	registrationRouter.get('/downloadSlip/:teamId', registrationController.downloadSlip);
	registrationRouter.get('/confirm/downloadSlip/:teamId', registrationController.downloadConfirmSlip);
	registrationRouter.get('/upload/pitch', registrationController.uploadPitch);
	//registrationAuthRouter.patch('/oneTimeEdit/:teamId', registrationController.oneTimeEdit);
	//export Registration
	return registrationRouter;
};

module.exports = registrationRoutes;
