var express = require('express');

var registrationRoutes = function(Registration) {
    var registrationRouter = express.Router();
    var registrationController = require('../controllers/registrationController')(Registration);
    var registrationMiddleware = require('../middlewares/getParamRegistration')(Registration);

    // registrationRouter.use('/:teamId', registrationMiddleware);
    registrationRouter.param('teamId', registrationMiddleware);

    registrationRouter.get('/getRegistration', registrationController.getRegistration);
    registrationRouter.post('/create', registrationController.register);
    registrationRouter.get('/downloadSlip/:teamId', registrationController.downloadSlip);
    //registrationAuthRouter.patch('/oneTimeEdit/:teamId', registrationController.oneTimeEdit);
    return registrationRouter;
};

module.exports = registrationRoutes;
