var express = require('express');

var facultyRoutes = function(Faculty, Registration) {
    var facultyRouter = express.Router();
    var facultyController = require('../controllers/facultyController')(Faculty, Registration);
    var registrationController = require('../controllers/registrationController')(Registration);

    var facultyMiddleware = require('../middlewares/getParamFaculty')(Faculty);

    facultyRouter.param('facultyId', facultyMiddleware);

    facultyRouter.post('/:facultyId/updateFaculty', facultyController.updateFaculty);
    facultyRouter.patch('/settings/changePassword', facultyController.facultyChangePassword);
    facultyRouter.post('/:facultyId/registrations/confirm', facultyController.confirmRegistration);
    facultyRouter.get('/:facultyId/registrations', registrationController.getFacultyRegistrations);
    facultyRouter.post('/:facultyId/studentCoordinator', facultyController.addStudentCoordinator);
    facultyRouter.get('/:facultyId/studentCoordinator', facultyController.getStudentCoordinator);
    //facultyRouter.get('/check', facultyController.checkFacultyVerified);
    facultyRouter.get('/getFaculty', facultyController.getFaculty);
    facultyRouter.get('/:facultyId/getEachFaculty', facultyController.getEachFaculty);
    // facultyRouter.put('/:facultyId/studentCoordinator/edit', facultyController.editStudentController);


    //To Remove
    // facultyRouter.get('/:facultyId/registrations/summary', registrationController.getFacultySummary);

    return facultyRouter;
};

module.exports = facultyRoutes;
