var passport = require('passport');
var rand = require('random-key');
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require('handlebars');
var json2xls = require('json2xls');
var _ = require('underscore');


var registrationController = require('./registrationController')();
var mailController = require('./mailController')();


var facultyController = function (Faculty, Registration) {
	function throwError(response, error, status, message, errorFor) {
		console.log("ERROR",
			error);
		console.log("ERROR_FOR", errorFor);
		response.status(status);
		response.json({
			"error": {
				"message": message,
				"for": errorFor,
				"original": error
			}
		});
	}

	function addStudentCoordinator(request, response) {
		request.faculty.student_coordinator = request.body.student_coordinator;
		request.faculty.save(function (error) {
			if (error) {
				throwError(response, error, 500, 'Internal Server error', 'Faculty Register');
			} else {
				response.status(200);
				response.json({
					"message": "success"
				});
			}
		});
	}

	function getStudentCoordinator(request, response) {
		if (request.faculty.student_coordinator.name !== undefined) {
			response.status(200);
			response.json({
				"message": "Student Coordinator found",
				"student_coordinator": request.faculty.student_coordinator
			});
		} else {
			response.status(404);
			response.json({
				"message": "Student Coordinator not found"
			});
		}
	}

	function confirmRegistration(request, response) {
		Registration.findOne({
				serialId: request.body.serialId
			})
			.exec(function (error, registration) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					console.log("1");
					return;
				}
				if (!registration) {
					throwError(response, error, 404, 'Not Found', 'Registration not found');
					console.log("2");
					return;

				} else {
					if (registration.confirmation === false) {

						var confirmedTime = new Date();
						var nd = confirmedTime.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						});
						var data = {
							teamId: registration.teamId,
							team_leader: registration.team_leader,
							other_participants: registration.other_participants,
							event_section: registration.eventObject.event_section,
							event_name: registration.eventObject.event_name,
							faculty_name: request.faculty.name,
							time: confirmedTime,
							downloadLink: 'http://portal.gtu.ac.in/api/registration/confirm/downloadSlip/' + registration.teamId
						};

						var mailData = [{
							email: registration.team_leader.email,
							data: data
						}];

						registration.confirmation = true;
						registration.confirmation_date = new Date();
						registration.facultyId = request.faculty._id;
						request.faculty.registrations_count = parseInt(request.faculty.registrations_count) + 1;
						request.faculty.collected_amount = parseInt(registration.total_amount) + parseInt(request.faculty.collected_amount);

						request.faculty.registrations_count = parseInt(request.faculty.registrations_count);

						request.faculty.collected_amount = parseInt(request.faculty.collected_amount);

						mailController.sendMails(mailData, 'Confirmation of your registration', 'mailpreconfirmation');

						registration.save(function (error) {
							if (error) {
								throwError(response, error, 500, "Confirming Registration", "Failed");
							} else {
								// console.log("8");
								request.faculty.save(function (error) {
									if (error) {
										throwError(response, error, 500, "Confirming Registration", "Failed");
									} else {
										response.status(200).json({
											"message": "Registration has been Confirmed!"
										});
									}
								});
							}
						});
					} else {
						throwError(response, error, 405, 'Forbidden', 'Registration confirmed already!');
					}
				}
			});
	}


	function getAllFacultyCoordinators(request, response) {
		Faculty.find({
				rejected: false
			})
			.select({
				name: 1,
				email: 1,
				mobileno: 1,
				verified: 1,
				collegeId: 1,
				registrations_count: 1,
				collected_amount: 1,
				updatedAt: 1,
			})
			.sort({
				verified: 1,
				createdAt: -1,
			})
			.populate({
				path: 'collegeId',
				select: '_id name code city state pincode'
			})
			.exec(function (error, faculties) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Finding Faculties');
				} else {
					response.status(200).json(faculties);
				}
			});
	}


	function facultyChangePassword(request, response) {
		Faculty.findById(request.body.facultyId)
			.exec(function (error, faculty) {
				if (error) {
					console.log(error);
				} else if (faculty.checkValidPassword(request.body.currentPassword)) {
					faculty.setPassword(request.body.newPassword);
					faculty.save(function (error) {
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
			});
	}


	function seeRegistration(request, response) {
		Registration.findOne({
				facultyId: request.faculty._id
			})
			.exec(function (error, registrations) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!registrations) {
					throwError(response, error, 404, 'Not Found', 'Registration not found');
				} else {
					response.status(200);
					response.json({
						"totalRegistrations": request.faculty.registrations_count,
						"totalCollectedAmount": request.faculty.collected_amount,
						"registrations": registrations
					});
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

	function exportVFSList(request, response) {
		Faculty.find({
				verified: true,
				rejected: false
			})
			.select({
				name: 1,
				email: 1,
				mobileno: 1,
				verified: 1,
				student_coordinator: 1,
				collegeId: 1,
				updatedAt: 1
			})
			.populate({
				path: 'collegeId',
				select: '_id name code city state pincode'
			})
			.exec(function (error, facultystudent) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Faculty Fetch Failed');
					return;
				}
				if (!facultystudent) {
					throwError(response, error, 404, 'Not Found', 'Faculty not found');
				} else {
					var en = "ConfirmedFacultyList";
					if (fs.existsSync('./public/documents/' + en + '.xlsx')) {
						fs.unlinkSync('./public/documents/' + en + '.xlsx');
					}
					var data = [];
					_.each(facultystudent, function (element, index, list) {
						//console.log(element.student_coordinator.name);
						var arrayOfFaculty = {
							sr_no: index + 1,
							name: element.name,
							email: element.email,
							mobileno: element.mobileno,
							student_name: element.student_coordinator.name,
							student_email: element.student_coordinator.email,
							student_mobile: element.student_coordinator.mobileno,
							student_enrollment: element.student_coordinator.enrollment,
							student_branch: element.student_coordinator.branch,
							college_name: element.collegeId.name,
							college_city: element.collegeId.city,
							college_code: element.collegeId.code,
							State: element.collegeId.state,
							updated_at: element.updatedAt,
						};
						data.push(arrayOfFaculty);
					});
					var xls = json2xls(data);
					fs.writeFileSync('./public/documents/' + en + '.xlsx', xls, 'binary');
					if (fs.existsSync('./public/documents/' + en + '.xlsx')) {
						response.status(200);
						response.json({
							path: '/documents/' + en + '.xlsx'
						});
					} else {
						console.log('File doesn\'t exist');
						//to add throw error
					}
				}
			});
	}

	function exportUVFList(request, response) {
		Faculty.find({
				verified: false,
				rejected: false
			})
			.select({
				name: 1,
				email: 1,
				mobileno: 1,
				verified: 1,
				collegeId: 1,
				updatedAt: 1
			})
			.populate({
				path: 'collegeId',
				select: '_id name code city state pincode'
			})
			.exec(function (error, faculty) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Faculty Fetch Failed');
					return;
				}
				if (!faculty) {
					throwError(response, error, 404, 'Not Found', 'Faculty not found');
				} else {
					var en = "UnconfirmedFacultyList";
					if (fs.existsSync('./public/documents/' + en + '.xlsx')) {
						fs.unlinkSync('./public/documents/' + en + '.xlsx');
					}
					var data = [];
					_.each(faculty, function (element, index, list) {
						//console.log(element.collegeId.name);
						var arrayOfFaculty = {
							sr_no: index + 1,
							name: element.name,
							email: element.email,
							mobileno: element.mobileno,
							college_name: element.collegeId.name,
							college_city: element.collegeId.city,
							college_code: element.collegeId.code,
							State: element.collegeId.state,
							updated_at: element.updatedAt,
						};
						// console.log(arrayOfFaculty);
						data.push(arrayOfFaculty);
					});
					var xls = json2xls(data);
					fs.writeFileSync('./public/documents/' + en + '.xlsx', xls, 'binary');
					if (fs.existsSync('./public/documents/' + en + '.xlsx')) {
						response.status(200);
						response.json({
							path: '/documents/' + en + '.xlsx'
						});
						// response.download('./documents/' + en + '.xlsx', function(error) {
						//     if (error) {
						//         console.log(error);
						//         //To Add Throwerror
						//     } else {
						//
						//         response.send(faculty);
						//         //fs.unlinkSync('./documents/' + en + '.xlsx');
						//
						//     }


						// });
					} else {
						console.log('File doesn\'t exist');
						//to add throw error
					}
				}
			});
	}

	function checkFacultyVerified(request, response) {
		Faculty.findById(request.payload._id).exec(function (error, faculty) {
			if (error) {
				throwError(response, error, 500, 'Internal Server Error', 'Faculty Check Logged in Failed');
				return;
			}
			if (!faculty) {
				throwError(response, error, 404, 'Not Found', 'Faculty not found');
			} else {
				if (faculty.verified) {
					var token = faculty.generateJwt();
					console.log(token);
					response.status(200);
					response.json({
						"token": token
					});
				} else {
					throwError(response, null, 401, 'Not Verified', 'Faculty Not Verified');
				}
			}
		});
	}

	function updateFaculty(request, response) {
		request.faculty.name = request.body.name;
		request.faculty.email = request.body.email;
		request.faculty.mobileno = request.body.mobileno;
		request.faculty.save(function (error) {
			if (error) {
				throwError(response, error, 500, 'Internal Server error', 'Faculty Register');
			} else {
				response.status(200).json(request.faculty);
			}
		});
	}

	function getEachFaculty(request, response) {
		if (!request.faculty) {
			throwError(response, request, 404, 'Faculty Not Found', 'Faculty');
		} else {
			response.status(200).json(request.faculty);
		}
	}

	var ac = {};
	ac.seeRegistration = seeRegistration;
	ac.confirmRegistration = confirmRegistration;
	ac.facultyChangePassword = facultyChangePassword;
	ac.getAllFacultyCoordinators = getAllFacultyCoordinators;
	ac.addStudentCoordinator = addStudentCoordinator;
	ac.getStudentCoordinator = getStudentCoordinator;
	ac.getFaculty = getFaculty;
	ac.exportVFSList = exportVFSList;
	ac.exportUVFList = exportUVFList;
	ac.checkFacultyVerified = checkFacultyVerified;
	ac.updateFaculty = updateFaculty;
	ac.getEachFaculty = getEachFaculty;
	return ac;
};

module.exports = facultyController;
