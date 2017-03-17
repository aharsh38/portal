var express = require('express');
var rand = require('random-key');
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require('handlebars');
var json2xls = require('json2xls');
var _ = require('underscore');

var registrationController = function (Registration) {

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

	function generateSlip2(type, teamid, data) {
		if (type) {
			fs.readFile('./api/slips/templates/' + type + '.hbs', function (error, file) {
				if (!error) {
					var source = file.toString();
					var template = Handlebars.compile(source);
					var result = template(data);
					fs.writeFile("./api/slips/" + type + "/html/" + teamid + ".html", result, function (error) {
						if (error) {
							return {
								"message": "error",
								"error": error
							};
						} else {
							var html = fs.readFileSync('./api/slips/' + type + '/html/' + teamid + '.html', 'utf8');

							var options = {
								format: 'Letter',
								zoom: 0.5
							};

							pdf.create(html, options).toFile('./api/slips/' + type + '/' + teamid + '.pdf', function (error, res) {
								console.log("PDF GENERATE ERROR", error);
								if (error) {
									return {
										"message": "error",
										"error": error
									};
								} else {
									return {
										"message": "Done"
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


	function generateSlip(type, teamid, data, request, response, registration) {
		if (type) {console.log('donwload skip');
			fs.readFile('./api/slips/templates/' + type + '.hbs', function (error, file) {
				if (!error) {
					var source = file.toString();
					var template = Handlebars.compile(source);
					var result = template(data);
					fs.writeFile("./api/slips/" + type + "/html/" + teamid + ".html", result, function (error) {
						if (error) {
							return {
								"message": "error",
								"error": error
							};
						} else {
							var html = fs.readFileSync('./api/slips/' + type + '/html/' + teamid + '.html', 'utf8');

							var options = {
								format: 'Letter',
								zoom: 0.5
							};
							pdf.create(html, options).toFile('./api/slips/' + type + '/' + teamid + '.pdf', function (error, res) {
								console.log("PDF GENERATE ERROR", error);
								if (error) {
									return {
										"message": "error",
										"error": error
									};
								} else {
									registration.save(function (error) {
										if (error) {
											throwError(response, error, 500, 'Internal Server error', 'Event Register');
										} else {

											var dnlink = 'http://portal.gtu.ac.in/api/registration/downloadSlip/' + registration.teamId + '?type=';
											if (request.body.do_payment) {
												dnlink += 'forPayment';
											} else if (request.body.late_payment) {
												dnlink += 'latePayment';
											}
											response.status(200);
											response.json({
												downloadSlip: dnlink
											});
										}
									});
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
		var registration = new Registration();
		registration.eventObject = request.body.eventObject;
		registration.no_of_participants = request.body.no_of_participants;
		registration.team_leader = request.body.team_leader;
		registration.other_participants = request.body.other_participants;
		registration.total_amount = request.body.total_amount;
		registration.do_payment = request.body.do_payment;
		registration.late_payment = request.body.late_payment;
		registration.teamId = request.body.eventObject.event_shortcode + rand.generateDigits(6);
		// registration.teamId = "SC" + rand.generateDigits(6);
		var slip;
		var dataToGeneratePDF;

		var current_date = new Date();
		var nd = current_date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		if (registration.do_payment) {
			registration.serialId = rand.generate(12);
			dataToGeneratePDF = {
				teamId: registration.teamId,
				serialId: registration.serialId,
				team_leader: registration.team_leader,
				date: nd,
				amount: registration.total_amount,
				eventObject: registration.eventObject
			};
			slip = generateSlip('forPayment', registration.teamId, dataToGeneratePDF, request, response, registration);
		} else if (request.body.late_payment) {
			dataToGeneratePDF = {
				teamId: registration.teamId,
				team_leader: registration.team_leader,
				date: nd,
				amount: registration.total_amount,
				other_participants: registration.other_participants,
				eventObject: registration.eventObject
			};
			slip = generateSlip('latePayment', registration.teamId, dataToGeneratePDF, request, response, registration);
		}
	}


	function downloadConfirmSlip(request, response) {
		var type = 'confirmPayment';
		var teamId = request.params.teamId;

		response.download('./api/slips/' + type + '/' + teamId + '.pdf', function (error, data) {
			if (error) {
				throwError(response, error, null, 'Slip Download', 'Download Failed');
			} else {
				response.status(200);
				response.send(data);
			}
		});
	}


	function downloadSlip(request, response) {
		var type = request.query.type;
		var teamId = request.params.teamId;

		response.download('./api/slips/' + type + '/' + teamId + '.pdf', function (error, data) {
			if (error) {
				throwError(response, error, null, 'Slip Download', 'Download Failed');
			} else {
				response.status(200);
				response.send(data);
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
			.exec(function (error, registrations) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!registrations) {
					throwError(response, error, 404, 'Not Found', 'Registrations not found');
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

	function exportUnconfirmedRegistration(request, response) {
		Registration.find({
				confirmation: false
			})
			.select({
				team_leader: 1,
				eventObject: 1
			})
			.exec(function (error, registration) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!registration) {
					throwError(response, error, 404, 'Not Found', 'Registrations not found');
				} else {
					var en = "Unconfirmed Registration";
					var data = [];
					_.each(registration, function (element, index, list) {
						var arrayOfRegistration = {
							sr_no: index + 1,
							name: element.team_leader.name,
							email: element.team_leader.email,
							mobileno: element.team_leader.mobileno,
							event_section: element.eventObject.event_section,
							event_name: element.eventObject.event_name
						};
						data.push(arrayOfRegistration);
					});
					if (data) {
						var xls = json2xls(data);
						fs.writeFileSync('./documents/' + en + '.xlsx', xls, 'binary');
					}
					if (fs.existsSync('./documents/' + en + '.xlsx')) {
						response.download('./documents/' + en + '.xlsx', function (error) {
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
		Registration.find({
				"eventObject.event_name": request.body.event_name
			})
			.exec(function (error, registrations) {console.log(registrations);
				var en = request.body.event_name;
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!registrations) {
					throwError(response, error, 404, 'Not Found', 'Registration not found');
				} else {
					var participantsData = [];
					_.each(registrations, function (element, index, list) {
						// var newe = element.toJSON();
						var arrayOfParticipants = _.union([element.team_leader], element.other_participants);
						arrayOfParticipants = _.map(arrayOfParticipants, function (e, i, l) {
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
						fs.writeFileSync('./public/documents/' + en + '.xlsx', xls, 'binary');
					}
					if (fs.existsSync('./public/documents/' + en + '.xlsx')) {
						response.status(200);
						response.json({
							path:'/documents/'+en+'.xlsx'
						});
						// response.download('./documents/' + en + '.xlsx', function (error) {
						// 	if (error) {
						// 		console.log(error);
						// 		//To Add Throwerror
						// 	} else {
						// 		fs.unlinkSync('./documents/' + en + '.xlsx');
						// 	}
						// });
					} else {
						console.log('File doesn\'t exist');
						//to add throw error
					}
				}
			});
	}

	function getAllEventsRegistrationData(request, response) {
		Registration.aggregate(
				[{
					$group: {
						_id: {eventName: "$eventObject.event_name"},
						confirmed_registrations: {$sum: { $cond: [ { $eq: [ "$confirmation", true] } , 1, 0 ] }},
						unconfirmed_registrations: {$sum: { $cond: [ { $eq: [ "$confirmation", false] } , 1, 0 ] }}
					},
				},
				],
				function(error, data) {
						if (error) {
								throwError(response, "Finding all registrations according to event", error);
						} else {
							// _.each(data, function (element, index, list) {
							// 	var eventName = element._id.eventName;
							// 			var arrayOfParticipants = _.union([element.confirmed_team_leader], element.confirmed_other_participants);
							// 			console.log(arrayOfParticipants);
										// arrayOfParticipants = _.map(arrayOfParticipants, function (e, i, l) {
										// 	var newElem = e;
										// 	newElem.teamId = e.conteamId;
										// 	return newElem;
										// });
							// });
						// 	var newData = [];
						// 	var found = false;
						// 	var confirmedData = [];
						// 	var unConfirmedData = [];
						// 	var cpath = "", ucpath = "";
						// 	_.each(data, function (element, index, list) {
						// 		var eventName = element._id.eventName;
						// 		var arrayOfParticipants = _.union([element.team_leader], element.other_participants);
						// 		arrayOfParticipants = _.map(arrayOfParticipants, function (e, i, l) {
						// 			var newElem = e;
						// 			// newElem.teamId = e.teamId;
						// 			return newElem;
						// 		});
						// 		_(newData).filter(function (obj) {
						// 	    if(obj.event_name == eventName) {
						// 				found = true;
						// 				if(element._id.confirmation) {
						// 					obj.confirmed_registrations++;
						// 					confirmedData = _.union(confirmedData, arrayOfParticipants);
						// 				} else {
						// 					obj.not_confirmed_registrations++;
						// 					console.log('before');console.log(unConfirmedData);
						// 					unConfirmedData[eventName] = _.union(unConfirmedData[eventName], arrayOfParticipants);
						// 					console.log('after');console.log(unConfirmedData);
						// 				}
						// 			}
						// 		});
						// 		if(!found) {
						// 			var cindex = 0;
						// 			var ucindex = 0;
						// 			if(element._id.confirmation) {
						// 				cindex = 1;
						// 				confirmedData = _.union(confirmedData, arrayOfParticipants);
						// 			} else {
						// 				ucindex = 1;
						// 				unConfirmedData[eventName] = _.union(unConfirmedData[eventName], arrayOfParticipants);
						// 			}
						// 			var each = {event_name: eventName,
						// 				confirmed_registrations: (element._id.confirmation) ? 1 : 0,
						// 				not_confirmed_registrations: (element._id.confirmation) ? 0 : 1};
						// 			newData.push(each);
						// 		}
						// 	});
						// 	console.log(confirmedData);
						// 	console.log(unConfirmedData);
						// 	if (confirmedData) {
						// 		var cxls = json2xls(confirmedData);
						// 		fs.writeFileSync('./public/documents/confirmedData.xlsx', cxls, 'binary');
						// 	}
						// 	if (fs.existsSync('./public/documents/confirmedData.xlsx')) {
						// 		cpath = '/documents/confirmedData.xlsx';
						// 	} else {
						// 		console.log('File doesn\'t exist');
						// 	}
						// 	if (unConfirmedData) {
						// 		var ucxls = json2xls(unConfirmedData);
						// 		fs.writeFileSync('./public/documents/unConfirmedData.xlsx', ucxls, 'binary');
						// 	}
						// 	if (fs.existsSync('./public/documents/unConfirmedData.xlsx')) {
						// 		ucpath = '/documents/unConfirmedData.xlsx';
						// 	} else {
						// 		console.log('File doesn\'t exist');
						// 	}
							// newData.confirmed_xlsx = cpath;
							// newData.unconfirmed_xlsx = ucpath;
							console.log(data);
							response.status(200);
							response.json(data);
						}
				});
	}

	function oneTimeEditAllow(request, response) {
		Registration.findOne({
				teamId: request.body.teamId,
				"team_leader.email": request.body.email,
				"team_leader.mobileno": request.body.mobileno
			})
			.exec(function (error, registration) {
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
		request.registration.save(function (error) {
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
	ac.downloadConfirmSlip = downloadConfirmSlip;
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
