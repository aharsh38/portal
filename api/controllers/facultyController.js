var passport = require('passport');

var registrationController = require('./registrationController')();
var mailController = require('./mailController')();

var facultyController = function(Faculty, Registration) {
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

    function addStudentCoordinator(request, response){
      request.faculty.student_coordinator = request.body.student_coordinator;
      request.faculty.save(function(error) {
          if (error) {
              throwError(response, error, 500, 'Internal Server error', 'Faculty Register');
          } else {
              // var token;
              // token = faculty.generateJwt();
              response.status(200);
              response.json({
                  //"token": token,
                  "message": "success"
              });
          }
      });
    }

    function confirmRegistration(request, response) {
        Registration.findOne({
                teamId: request.body.teamId
            })
            .exec(function(error, registration) {
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
                    return;
                }
                if (!registration) {
                    throwError(response, error, 404, 'Not Found', 'Registration not found');
                    return;
                } else {
                    if (registration.team_leader.email !== request.body.email) {
                        throwError(response, error, 400, 'Bad Request', 'Team leader email address incorrect');
                        return;
                    }

                    if (registration.team_leader.mobileno !== request.body.mobileno) {
                        throwError(response, error, 400, 'Bad Request', 'Team leader mobile number incorrect');
                        return;
                    }

                    if (registration.team_leader.serialId !== request.body.serialId) {
                        throwError(response, error, 400, 'Bad Request', 'Serial id is incorrect');
                        return;
                    }

                    if (registration.confirmation === false) {
                        registration.confirmation = true;
                        registration.confirmation_date = new Date();
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
                            mailController.sendMails(data, 'Confirmation of your registration', 'mailpreconfirmation');
                        } else {
                            throwError(response, error, 404, 'Not Found', 'Generated data not found.');
                        }

                        request.faculty.registrations = request.faculty.registrations + (1 + registration.other_participants.length);
                        request.faculty.collected_amount = registration.total_amount + request.faculty.collected_amount;

                        registration.save(function(error) {
                            if (error) {
                                throwError(response, error, 520, "Confirming Registration", "Failed");
                            } else {
                                response.status(200).json({
                                    "message": "Registration has been Confirmed!"
                                });
                            }
                        });
                    } else {
                        throwError(response, error, 403, 'Forbidden', 'Registration confirmed already!');
                    }
                }
            });
    }


    function getAllFacultyCoordinators(request, response) {
        Faculty.find()
            .select({
                name: 1,
                email: 1,
                mobileno: 1,
                verified: 1,
                collegeId: 1,
                registrations_count: 1,
                collected_amount: 1
            })
            .sort({
                createdAt: -1
            })
            .populate({
                path: 'collegeId',
                select: '_id name code city state pincode'
            })
            .exec(function(error, faculties) {
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Finding Faculties');
                } else {
                    response.status(200).json(faculties);
                }
            });
    }


    function facultyChangePassword(request, response) {
        Faculty.findById(request.body.facultyId)
            .exec(function(error, faculty) {
                if (error) {
                    console.log(error);
                } else if (faculty.checkValidPassword(request.body.currentPassword)) {
                    faculty.setPassword(request.body.newPassword);
                    faculty.save(function(error) {
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
                facultyId: request.body.facultyId
            })
            .exec(function(error, registration) {
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
    function getFaculty(req, res) {
        Faculty.find()
            .exec(function(err, faculty) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(faculty);
                }
            });
    }


    // function exportFacultyStudentList(request, response) {
    // }


    var ac = {};
    ac.seeRegistration = seeRegistration;
    ac.confirmRegistration = confirmRegistration;
    ac.facultyChangePassword = facultyChangePassword;
    ac.getAllFacultyCoordinators = getAllFacultyCoordinators;
    ac.addStudentCoordinator = addStudentCoordinator;
    ac.getFaculty = getFaculty;
    return ac;

};

module.exports = facultyController;
