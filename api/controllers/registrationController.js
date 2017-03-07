var express = require('express');
var rand = require('random-key');
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require('handlebars');
var json2xls = require('json2xls');
var _ = require('underscore');

var registrationController = function(Registration) {

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

    function getRegistration(request, response) {
        Registration.find()
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

    function generateSlip(type, teamid, data) {
        if (type) {
            fs.readFile('./api/slips/templates/' + type + '.hbs', function(error, file) {
                if (!error) {
                    var source = file.toString();
                    var template = Handlebars.compile(source);
                    var result = template(data);
                    fs.writeFile("./api/slips/" + type + "/html/" + teamid + ".html", result, function(error) {
                        if (error) {
                            return {
                                "message": "error",
                                "error": error
                            };
                        } else {
                            var html = fs.readFileSync('./api/slips/' + type + '/html/' + teamid + '.html', 'utf8');

                            var options = {
                                format: 'Letter'
                            };

                            pdf.create(html, options).toFile('./api/slips/' + type + '/' + teamid + '.pdf', function(error, res) {

                                if (error) {
                                    return {
                                        "message": "error",
                                        "error": error
                                    };
                                } else {
                                    return {
                                        "message": "Slip Succesfuly created"
                                    };
                                }
                            });
                        }
                    });
                } else {
                    return {
                        "message": "error",
                        "error": error
                    };
                }
            });
        }
    }

    function generatePDFTest() {
        console.log("IN FUNC");
        var current_date = new Date();
        var nd = current_date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        var dataToGeneratePDF = {
            teamId: 'MK123456',
            serialId: 'aswd12345900',
            date: nd,
            team_leader: {
                name: 'Raj Kotari',
                mobileno: '9876543210',
                email: 'rajkotari@gmail.com'
            },
            amount: 200,
            eventObject: {
                event_name: 'Junkyard Wars',
                event_section: 'Mekkato'
            }
        };
        slip = generateSlip('confirmPayment', 'example', dataToGeneratePDF);
        console.log("Done");
    }

    function register(request, response) {
        var registration = new Registration(request.body);
        registration.teamId = request.body.eventObject.event_shortcode + rand.generateDigits(6);
        var slip;
        var dataToGeneratePDF;

        if (registration.do_payment) {
            registration.serialId = rand.generate(12);
            var current_date = new Date();
            dataToGeneratePDF = {
                teamId: registration.teamId,
                serialId: registration.serialId,
                team_leader: registration.team_leader,
                date: current_date,
                amount: registration.total_amount,
                eventObject: registration.eventObject
            };
            slip = generateSlip('forPayment', registration.teamId, dataToGeneratePDF);
        } else {
            dataToGeneratePDF = {
                teamId: registration.teamId,
                team_leader: registration.team_leader,
                other_participants: registration.other_participants
            };
            slip = generateSlip('latePayment', registration.teamId, dataToGeneratePDF);
        }

        registration.save(function(error) {
            if (error) {
                throwError(response, error, null, 'Slip Download', 'Download Failed');
            } else {
                response.status(200);
                response.json(registration);
            }
        });
    }



    function downloadSlip(request, response) {
        var type = request.query.type;
        var teamId = request.params.teamId;
        response.download('./api/slips/' + type + '/' + teamId + '.pdf', function(error, data) {
            if (error) {
                throwError(response, error, null, 'Slip Download', 'Download Failed');
            } else {
                response.status(404).send(data);
            }
        });
    }

    function getFacultyRegistrations(request, response) {
        Registration
            .find({
                facultyId: request.params.facultyId,
                confirmation: true
            })
            .select('_id teamId facultyId no_of_participants team_leader eventObject total_amount')
            .exec(function(error, registrations) {
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
                    return;
                }
                if (!registrations) {
                    throwError(response, error, 404, 'Not Found', 'Registrations not found');
                } else {
                    response.status(200);
                    response.json(registrations);
                }
            });
    }

    function exportUnconfirmedRegistration(request, response) {
        Registration.find({
                confirmation: false
            })
            .select({
                team_leader: 1,
                eventObject: 1
            })
            .exec(function(error, registration) {
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
                    return;
                }
                if (!registration) {
                    throwError(response, error, 404, 'Not Found', 'Registrations not found');
                } else {
                    var en = "Unconfirmed Registration";
                    var data = [];
                    _.each(registration, function(element, index, list) {
                        var arrayOfRegistration = {
                          sr_no: index+1,
                          name: element.team_leader.name,
                          email: element.team_leader.email,
                          monbileno: element.team_leader.mobileno,
                          event_section: element.eventObject.event_section,
                          event_name: element.eventObject.event_name
                        };
                        console.log(arrayOfRegistration);
                        data.push(arrayOfRegistration);
                    });
                    console.log(data);

                    if (data) {
                        var xls = json2xls(data);
                        fs.writeFileSync('./documents/' + en + '.xlsx', xls, 'binary');
                    }
                    if (fs.existsSync('./documents/' + en + '.xlsx')) {
                        response.download('./documents/' + en + '.xlsx', function(error) {
                            if (error) {
                                console.log(error);
                                //To Add Throwerror
                            } else {
                              response.status(200);
                              response.json("Success");
                                //fs.unlinkSync('./documents/' + en + '.xlsx');
                            }
                        });
                    } else {
                        console.log('File doesn\'t exist');
                        //to add throw error
                    }
                }
            });
    }

    function exportRegistration(request, response) {
        var x = request.body.do_payment;
        Registration.find({
                "eventObject.event_name": request.body.event_name,
                confirmation: x
            })
            .exec(function(error, registrations) {
                var en = request.body.event_name;
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
                    return;
                }
                if (!registrations) {
                    throwError(response, error, 404, 'Not Found', 'Registration not found');
                } else {
                    var participantsData = [];
                    _.each(registrations, function(element, index, list) {
                        // var newe = element.toJSON();
                        var arrayOfParticipants = _.union([element.team_leader], element.other_participants);
                        arrayOfParticipants = _.map(arrayOfParticipants, function(e, i, l) {
                            var newElem = e.toJSON();
                            newElem.teamId = element.teamId;
                            // console.log(newElem);
                            return newElem;
                        });
                        // console.log(arrayOfParticipants);
                        participantsData = _.union(participantsData, arrayOfParticipants);
                    });
                    // console.log(participantsData);
                    if (participantsData) {
                        var xls = json2xls(participantsData);
                        fs.writeFileSync('./documents/' + en + '.xlsx', xls, 'binary');
                    }
                    if (fs.existsSync('./documents/' + en + '.xlsx')) {
                        response.download('./documents/' + en + '.xlsx', function(error) {
                            if (error) {
                                console.log(error);
                                //To Add Throwerror
                            } else {
                                fs.unlinkSync('./documents/' + en + '.xlsx');
                            }
                        });
                    } else {
                        console.log('File doesn\'t exist');
                        //to add throw error
                    }
                }
            });
    }

    function getAllEventsRegistrationData(request, response) {
        var data = [];
        Registration.find().exec(function(error, registrations) {
            var totalConfirmed = _.countBy(registrations, function(element, index, list) {
                if (element.confirmation) {
                    return element.eventObject.event_name;
                }
            });

            var totalNotConfirmed = _.countBy(registrations, function(element, index, list) {
                if (!element.confirmation) {
                    return element.eventObject.event_name;
                }
            });

            var arrayToSend = [];
            var allEvents = _.keys(totalConfirmed);
            _.each(allEvents, function(element, index, list) {
                var obj = {
                    event_name: element,
                    confirmed_registrations: totalConfirmed[element],
                    not_confirmed_registrations: totalNotConfirmed[element]
                };
                arrayToSend.push(obj);
            });

            response.json(_.rest(arrayToSend));
        });
    }

    function oneTimeEditAllow(request, response) {
        Registration.findOne({
                teamId: request.body.teamId,
                "team_leader.email": request.body.email,
                "team_leader.mobileno": request.body.mobileno
            })
            .exec(function(error, registration) {
                console.log(registration);
                if (error) {
                    throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
                    return;
                }
                if (!registration) {
                    throwError(response, error, 404, 'Not Found', 'Registration not found');
                } else {
                    var date = new Date();
                    if (registration.one_time_edit === false) {
                        if (date.getDate() <= 23 && date.getMonth() == 2) {
                            var data = {
                                teamId: registration.teamId,
                                other_participants: registration.other_participants
                            };
                            console.log(data);
                            response.status(201);
                            response.json(data);
                        } else {
                            throwError(response, error, 403, "Forbidden", "Edit is not availabe now!");
                        }
                    } else {
                        throwError(response, error, 403, "Forbidden", "You have already edit.");
                    }
                }
            });
    }

    function oneTimeEditSet(request, response) {

        request.registration.one_time_edit = true;
        request.registration.other_participants = request.body.other_participants;

        console.log('in oneTimeEditSet ', request.registration);
        request.registration.save(function(error) {
            if (error) {
                throwError(response, error, 520, "Updating Registration", "Failed");
            } else {
                response.status(200).json(request.registration);
            }
        });
    }

    var ac = {};
    ac.register = register;
    ac.getRegistration = getRegistration;
    ac.downloadSlip = downloadSlip;
    ac.getFacultyRegistrations = getFacultyRegistrations;
    ac.exportRegistration = exportRegistration;
    ac.getAllEventsRegistrationData = getAllEventsRegistrationData;
    ac.oneTimeEditSet = oneTimeEditSet;
    ac.oneTimeEditAllow = oneTimeEditAllow;
    ac.generateSlip = generateSlip;
    ac.generatePDFTest = generatePDFTest;
    ac.exportUnconfirmedRegistration = exportUnconfirmedRegistration;
    return ac;
};

module.exports = registrationController;
