var express = require('express');

var authRoutes = function (Faculty, Member) {
    var authRouter = express.Router();
    var authController = require('../controllers/authController')(Faculty, Member);

    authRouter.post('/faculty/register', authController.facultyRegister);
    authRouter.post('/faculty/login', authController.facultyLogin);
    authRouter.patch('/faculty/changePassword', authController.facultyChangePassword);
    authRouter.post('/faculty/forgotPasswordApply', authController.facultyForgotPasswordApply);

    authRouter.post('/member/register', authController.memberRegister);
    authRouter.post('/member/login', authController.memberLogin);
    authRouter.patch('/member/changePassword', authController.memberChangePassword);
    authRouter.post('/member/forgotPasswordApply', authController.memberForgotPasswordApply);

    return authRouter;
};

module.exports = authRoutes;
