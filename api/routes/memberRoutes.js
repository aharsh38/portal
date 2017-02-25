var express = require('express');

var memberRoutes = function (Faculty, Member) {
    var memberRouter = express.Router();
    var memberController = require('../controllers/memberController')(Faculty, Member);

    memberRouter.patch('/verifyFaculty', memberController.verifyFaculty);
    memberRouter.post('/forgotPasswordSet', memberController.forgotPasswordSet);

    return memberRouter;
};

module.exports = memberRoutes;
