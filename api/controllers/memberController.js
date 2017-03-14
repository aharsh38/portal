// var express = require('express');
var fs = require('fs');
// var Handlebars = require('handlebars');
var json2xls = require('json2xls');
var _ = require('underscore');
//var passport = require('passport');
var mailController = require('./mailController')();


var memberController = function(Faculty, Member, College) {
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

    function verifyFaculty(request, response) {
        request.faculty.verified = true;
        request.faculty.rejected = false;
        College.findOne({
                _id: request.faculty.collegeId
            })
            .exec(function(error, college) {
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Faculty Verified Failed');
                } else {
                    // console.log("req",request.faculty._id);
                    console.log(college);
                    college.facultyId = request.faculty._id;
                    college.faculty_assigned = true;
                    college.save(function(error) {
                        if (error) {
                            throwError(response, error, 500, 'Internal Server Error', 'Faculty Verified Failed');
                        } else {
                            request.faculty.save(function(error) {
                                if (error)
                                    throwError(response, error, 500, 'Internal Server Error', 'Faculty Verified Failed');
                                else {
                                    response.status(200).json({
                                        "message": "Faculty Succesfuly Verified"
                                    });
                                }
                            });
                        }
                    });
                }
            });
    }

    function rejectFaculty(request, response) {
        request.faculty.rejected = true;
        request.faculty.verified = false;
        request.faculty.save(function(error) {
            if (error)
                throwError(response, error, 500, 'Internal Server Error', 'Faculty Rejection Failed');
            else {
                response.status(200).json({
                    "message": "Faculty Rejected"
                });
            }
        });
    }


    function sendConfirmedMails(request, response) {
        Registration.find({
                confirmation: true
            })
            .exec(function(error, registration) {
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Failed');
                    return;
                }
                console.log(registration);
                if (!registration) {
                    throwError(response, error, 404, 'Not Found', 'Registration not found.');
                } else {
                    var date = new Date();
                    if (date.getDate() >= 23 && date.getMonth() == 2) {
                        var data = [{
                            name: registration.team_leader.name,
                            email: registration.team_leader.email,
                            link: 'http://gtutechfest.ldce.ac.in/api/registration/auth/downloadSlip/' + registration.teamId + '?type=mailConfirmPayment'
                        }];
                        console.log(data);
                        mailController.sendMails(data, 'Confirmation Slip', 'mailConfirmPayment');
                    } else {
                        throwError(response, error, 403, 'Forbidden', 'Access not Allowed.');
                    }
                }
            });
    }

    function memberChangePassword(request, response) {
        Member.findById(request.body.memberId)
            .exec(function(error, member) {
                if (error) {
                    console.log(error);
                } else if (member.checkValidPassword(request.body.currentPassword)) {
                    member.setPassword(request.body.newPassword);
                    member.save(function(error) {
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
            });
    }


    function exportForCertificate(request, response) {
        Registration.find({
                confirmation: true,
                updatedAt: {
                    $gt: request.body.startDate,
                    $lt: request.body.lastDate
                }
            })
            .exec(function(error, registrations) {

                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
                    return;
                }
                if (!registrations) {
                    throwError(response, error, 404, 'Not Found', 'Registration not found');
                } else {
                    var participantsData = [];
                    _.each(registrations, function(element, index, list) {

                        var arrayOfParticipants = _.union([element.team_leader], element.other_participants);
                        arrayOfParticipants = _.map(arrayOfParticipants, function(e, i, l) {
                            var newElem = e.toJSON();
                            newElem.event_section = element.eventObject.event_section;
                            newElem.event_name = element.eventObject.event_name;
                            // console.log(newElem);
                            return newElem;
                        });

                        participantsData = _.union(participantsData, arrayOfParticipants);
                    });
                    // console.log(participantsData);
                    if (participantsData) {
                        var xls = json2xls(participantsData);
                        fs.writeFileSync('./api/documents/certificateData.xlsx', xls, 'binary');
                    }
                    if (fs.existsSync('./api/documents/certificateData.xlsx')) {
                        response.download('./api/documents/certificateData.xlsx', function(error) {
                            if (error) {
                                // console.log(error);
                            } else {
                                //fs.unlinkSync('./documents/' + en + '.xlsx');
                            }
                        });
                    } else {
                        console.log('File doesn\'t exist');
                    }
                }
            });
    }


    var mc = {};
    mc.verifyFaculty = verifyFaculty;
    mc.rejectFaculty = rejectFaculty;
    mc.memberChangePassword = memberChangePassword;
    // mc.exportForCertificate = exportForCertificate;
    mc.sendConfirmedMails = sendConfirmedMails;
    return mc;
};
module.exports = memberController;
