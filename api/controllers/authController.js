var passport = require('passport');
var random = require('random-key');
var config = require('../config/config');
var mailController = require('./mailController')();

var authController = function (Faculty, Member) {

	function throwError(response, error, status, message, errorFor) {
		response.status(status);
		response.json({
			"error": {
				"message": message,
				"for": errorFor,
				"original": error
			}
		});
	}

	function facultyLogin(request, response) {
		passport.authenticate('faculty-local', function (error, faculty, info) {
			var token;
			if (error) {
				throwError(response, error, 500, 'Internal Server Error', 'Faculty login');
				return;
			}

			if (faculty) {
				token = faculty.generateJwt();
				response.status(200);
				response.json({
					"token": token
				});
			} else {
				throwError(response, error, 401, info, 'Not Found');
			}
		})(request, response);
	}

	function facultyRegister(request, response) {
		var faculty = new Faculty();
		faculty.name = request.body.name;
		faculty.email = request.body.email;
		faculty.mobileno = request.body.mobileno;
		// faculty.city = request.body.city;
		faculty.collegeId = request.body.college._id;
		console.log("College", request.body.college);
		faculty.setPassword(request.body.password);
		faculty.save(function (error) {
			if (error) {
				throwError(response, error, 500, 'Internal Server error', 'Faculty Register');
			} else {
				var token;
				token = faculty.generateJwt();
				response.status(200);
				response.json({
					"token": token,

				});
			}
		});
	}



	function facultyForgotPasswordApply(request, response) {
		Faculty.findOne({
				email: request.body.email
			})
			.exec(function (error, faculty) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Faculty change password');
					return;
				}

				if (!faculty) {
					throwError(response, error, 404, 'Not Found', 'Email not found');
				} else {
					faculty.forgot_password = true;
					faculty.forgot_password_token = random.generate(32);

					var data = [{
						email: faculty.email,
						data: {
							name: faculty.name,
							link: 'http://portal.gtu.ac.in/forgotPasswordSet?token=' + faculty.forgot_password_token + '&id=' + faculty._id
						}
					}];

					faculty.save(function (error) {
						if (error) {
							throwError(response, error, 500, 'Internal Server Error', 'Faculty Change Password');
						} else {
							mailController.sendMails(data, 'Reset Password', 'mailForgotPassword');
							response.status(202).json({
								"message": "Mail Send Successfully"
							});
						}
					});
				}
			});
	}

	function facultyForgotPasswordSet(request, response) {
		if ((request.faculty.forgot_password_token == request.body.token) && request.faculty.forgot_password) {
			request.faculty.setPassword(request.body.password);
			request.faculty.forgot_password = false;
			request.faculty.forgot_password_token = null;
			request.faculty.save(function (error) {
				if (error) {
					throwError(response, error, 500, 'Internal Server error', 'Faculty Change password');
				} else {
					response.status(200);
					response.json({
						"message": "Password Successfully Changed"
					});
				}
			});
		} else {
			if (request.faculty.forgot_password) {
				throwError(response, null, 406, 'Not Acceptable', 'Forgot password not requested');
			} else {
				throwError(response, null, 406, 'Not Acceptable', 'Forgot password bad request');
			}
		}
	}

	function facultyUpdateCoordinator(request, response) {
		request.faculty.studentCoordinator = request.body.coordinator;
		request.faculty.save(function (error) {
			if (error) {
				throwError(response, error, 500, 'Internal Server Error', 'Student Coordinator Update Failed');
			}
		});
	}

	function memberLogin(request, response) {
		passport.authenticate('member-local', function (error, member, info) {
			var token;
			if (error) {
				throwError(response, error, 500, 'Internal Server Error', 'Member login');
				return;
			}

			if (member) {
				token = member.generateJwt();
				response.status(200);
				response.json({
					"token": token
				});
			} else {
				throwError(response, error, 401, info, 'Not Found');
			}
		})(request, response);
	}

	function memberRegister(request, response) {
		if (request.body.secret == config.member_register_secret) {
			var member = new Member();
			member.name = request.body.name;
			member.email = request.body.email;
			member.mobileno = request.body.mobileno;
			member.setPassword(request.body.password);
			member.save(function (error) {
				if (error) {
					throwError(response, error, 500, 'Internal Server error', 'Member Register');
				} else {
					var token;
					token = member.generateJwt();
					response.status(200);
					response.json({
						"token": token
					});
				}
			});
		} else {
			throwError(response, error, 498, 'Invalid Token', 'Member Registeration invalid secret provided');
		}
	}

	function memberForgotPasswordApply(request, response) {
		Member.findOne({
				email: request.body.email
			})
			.exec(function (error, member) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Member change password');
					return;
				}
				console.log(member);
				if (!member) {
					throwError(response, error, 404, 'Not Found', 'Member not found for changing password');
				} else {
					member.forgot_password = true;
					member.forgot_password_token = random.generate(32);

					var dataToSend = [{

						email: member.email,
						data: {
							name: member.name,
							link: 'http://portal.gtu.ac.in/member/forgotPasswordSet?token=' + member.forgot_password_token + '&id=' + member._id
						}

					}];

					member.save(function (error) {
						if (error) {
							throwError(response, error, 500, 'Internal Server Error', 'Member Change Password');
						} else {
							mailController.sendMails(dataToSend, 'Reset Password', 'mailForgotPassword');
							response.status(202).json({
								"message": "Mail Send Successfully"
							});
						}
					});
				}
			});
	}

	function memberForgotPasswordSet(request, response) {
		if ((request.member.forgot_password_token == request.body.token) && request.member.forgot_password) {
			request.member.setPassword(request.body.password);
			request.member.forgot_password = false;
			request.member.forgot_password_token = null;
			request.member.save(function (error) {
				if (error) {
					throwError(response, error, 500, 'Internal Server error', 'Faculty Change password');
				} else {
					response.status(200);
					response.json({
						"message": "Password Succesfully Changed"
					});
				}
			});
		} else {
			if (request.member.forgot_password) {
				throwError(response, null, 406, 'Not Acceptable', 'Forgot password not requested');
			} else {
				throwError(response, null, 406, 'Not Acceptable', 'Forgot password bad request');
			}
		}
	}

	var ac = {};
	ac.facultyLogin = facultyLogin;
	ac.facultyRegister = facultyRegister;
	ac.facultyForgotPasswordApply = facultyForgotPasswordApply;
	ac.facultyForgotPasswordSet = facultyForgotPasswordSet;

	ac.memberLogin = memberLogin;
	ac.memberRegister = memberRegister;
	ac.memberForgotPasswordApply = memberForgotPasswordApply;
	ac.memberForgotPasswordSet = memberForgotPasswordSet;
	return ac;
};

module.exports = authController;
