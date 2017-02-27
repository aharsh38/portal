var passport = require('passport');

var registrationController = require('./registrationController')();

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

	function confirmRegistration(request, response) {
		Registration.findOne({
				teamId: request.body.teamId,
				"team_leader.email": request.body.email,
				"team_leader.mobileno": request.body.mobileno,
				serialId: request.body.serialId
			})
			.exec(function (error, registration) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!registration) {
					throwError(response, error, 404, 'Not Found', 'Registration not found');
				} else {
					if (registration.confirmation === false) {
						registration.confirmation = true;
						registration.facultyId = request.faculty._id;
						var confirmedTime = new Date();
						var data = {
							teamId: registration.teamId,
							team_leader: registration.team_leader,
							other_participants: registration.other_participants,
							event_section: registration.eventObject.event_section,
							event_name: registration.eventObject.event_name,
							faculty_name: request.faculty.name,
							time: confirmedTime
						};
						if (data) {
							registrationController.generateSlip('confirmPayment', registration.teamId, data);
						} else {
							throwError(response, error, 404, 'Not Found', 'Generated data not found.');
						}
						registration.save(function (error) {
							if (error) {
								throwError(response, error, 520, "Confirming Registration", "Failed");
							} else {
								response.status(200).json({
									"message": "Registration has been Confirmed!"
								});
							}
						});
					} else {
						throwError(response, error, 403, 'Forbidden', 'You are Confirmed already!');
					}
				}
			});
	}

	function getFaculty(request, response) {
		Faculty.find()
			.exec(function (err, faculty) {
				if (err) {
					res.status(500).send(err);
				} else {
					res.json(faculty);
				}
			});
	}

	function facultyChangePassword(request, response) {
		if (request.faculty.checkValidPassword(request.body.currentPassword)) {
			request.faculty.setPassword(request.body.newPassword);

			request.faculty.save(function (error) {
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
	ac.confirmRegistration = confirmRegistration;
	ac.facultyChangePassword = facultyChangePassword;
	return ac;


};
module.exports = facultyController;
