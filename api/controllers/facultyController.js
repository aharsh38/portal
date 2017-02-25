var passport = require('passport');

var facultyController = function (Faculty, Registration) {

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

	function getFaculty(req, res) {
		Faculty.find()
			.exec(function (err, faculty) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.json(faculty);
				}
			});
	}

	function forgotPasswordSet(request, response) {
		Faculty.findOne({
				forgot_password_token: request.body.forgot_password_token,
				forgot_password: true
			})
			.exec(function (error, faculty) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Faculty Fetch Failed');
					return;
				}
				if (!faculty) {
					throwError(response, error, 404, 'Not Found', 'Faculty not found');
				} else {
					faculty.setPassword(request.body.password);
					faculty.save(function (error) {
						if (error) {
							throwError(response, error, 500, 'Internal Server error', 'Faculty Change password');
						} else {
							var token;
							token = faculty.generateJwt();
							response.status(200);
							response.json({
								"token": token
							});
						}
					});
				}
			});
	}

	function seeRegistration(request, response) {
		Registration.findOne({
				facultyId: request.body.facultyId
			})
			.exec(function (error, registration) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!registration) {
					throwError(response, error, 404, 'Not Found', 'Registration not found');
				} else {
					response.status(200);
					response.json(registration);
				}
			});
	}

	var ac = {};
	ac.getFaculty = getFaculty;
	ac.seeRegistration = seeRegistration;
	ac.forgotPasswordSet = forgotPasswordSet;
	return ac;

};
module.exports = facultyController;
