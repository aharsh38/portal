var express = require('express');

var collegeRoutes = function (College) {
    var collegeRouter = express.Router();
    var collegeController = require('../controllers/collegeController')(College);

    collegeRouter.get('/importCollege', collegeController.importCollege);
    collegeRouter.get('/getAllCollege', collegeController.getAllCollege);
    collegeRouter.get('/searchFacultyByCity', collegeController.searchFacultyByCity);
    return collegeRouter;
};

module.exports = collegeRoutes;
