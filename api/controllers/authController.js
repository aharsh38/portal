var passport = require('passport');
var random = require('random-key');
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
		passport.authenticate('local', function (error, faculty, info) {
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
		faculty.setPassword(request.body.password);
		console.log("IN FACULTY CONTROLLER");
		faculty.save(function (error) {
			console.log("IN FACULTY CONTROLLER 2");
			console.log(error);
			if (error) {
				throwError(response, error, 500, 'Internal Server error', 'Faculty Register');
			} else {
				var token;
				token = faculty.generateJwt();
				response.status(200);
				response.json({
					"token": token,
					"faculty": faculty
				});
			}
		});
	}

	function facultyChangePassword(request, response) {
		Faculty.findById(request.params.facultyId)
			.exec(function (error, member) {
				if (error) {
					throwError(response, error, 404, 'Not Found', 'Faculty change password');
				} else {
					if (member.checkValidPassword(request.body.currentPassword)) {
						member.setPassword(request.body.newPassword);

						member.save(function (error) {
							if (error)
								throwError(response, error, 500, 'Internal Server Error', 'Faculty Change Password');
							else {
								response.status(200).json({
									"message": "Password Succesfuly Changed"
								});
							}
						});
					} else {
						throwError(response, null, 403, 'Forbidden', 'Password Incorrect');
					}
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
				console.log(faculty);
				if (!faculty) {
					throwError(response, error, 404, 'Not Found', 'Faculty not found for changing password');
				} else {
					faculty.forgot_password = true;
					faculty.forgot_password_token = random.generate(16);
					//console.log("TOKEN", faculty.forgot_password_token);
					var data = [{
						name: faculty.name,
						email: faculty.email,
						link: 'http://gtutechfest.ldce.ac.in/api/faculty/auth/forgotPasswordSet?token=' + faculty.forgot_password_token
					}];

					console.log(data);
					console.log(mailController);

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

	function memberLogin(request, response) {
		passport.authenticate('local', function (error, member, info) {
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
		var member = new Member(request.body);
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
	}

	function memberChangePassword(request, response) {
		Member.findById(request.params.facultyId)
			.exec(function (error, member) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Member change password');
					return;
				}

				if (member) {
					throwError(response, error, 404, 'Not Found', 'Member not found for changing password');
				} else {
					if (member.checkValidPassword(request.body.currentPassword)) {
						member.setPassword(request.body.newPassword);

						member.save(function (error) {
							if (error)
								throwError(response, error, 500, 'Internal Server Error', 'Member Change Password');
							else {
								response.status(200).json({
									"message": "Password Succesfuly Changed"
								});
							}
						});
					} else {
						throwError(response, null, 403, 'Forbidden', 'Password Incorrect');
					}
				}
			});
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
					member.forgot_password_token = random.generate(16);
					//console.log("TOKEN", faculty.forgot_password_token);
					var data = [{
						name: member.name,
						email: member.email,
						link: 'http://gtutechfest.ldce.ac.in/api/member/auth/forgotPasswordSet?token=' + member.forgot_password_token
					}];

					console.log(data);
					console.log(mailController);

					member.save(function (error) {
						if (error) {
							throwError(response, error, 500, 'Internal Server Error', 'Member Change Password');
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

	var ac = {};
	ac.facultyLogin = facultyLogin;
	ac.facultyRegister = facultyRegister;
	ac.facultyChangePassword = facultyChangePassword;
	ac.facultyForgotPasswordApply = facultyForgotPasswordApply;
	ac.memberLogin = memberLogin;
	ac.memberRegister = memberRegister;
	ac.memberChangePassword = memberChangePassword;
	ac.memberForgotPasswordApply = memberForgotPasswordApply;
	return ac;
};

module.exports = authController;
