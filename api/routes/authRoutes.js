var express = require('express');

var authRoutes = function (Faculty, Member) {
	var authRouter = express.Router();

	var authController = require('../controllers/authController')(Faculty, Member);

	var memberMiddleware = require('../middlewares/getParamMember')(Member);
	var facultyMiddleware = require('../middlewares/getParamFaculty')(Faculty);

	authRouter.param('memberId', memberMiddleware);
	authRouter.param('facultyId', facultyMiddleware);

	// authRouter.post('/faculty/register', authController.facultyRegister);
	authRouter.post('/faculty/login', authController.facultyLogin);
	// authRouter.post('/faculty/forgotPasswordApply', authController.facultyForgotPasswordApply);
	// authRouter.post('/faculty/:facultyId/forgotPasswordSet', authController.facultyForgotPasswordSet);

	// authRouter.post('/member/register', authController.memberRegister);
	authRouter.post('/member/login', authController.memberLogin);
	// authRouter.post('/member/forgotPasswordApply', authController.memberForgotPasswordApply);
	// authRouter.post('/member/:memberId/forgotPasswordSet', authController.memberForgotPasswordSet);


	return authRouter;
};

module.exports = authRoutes;
