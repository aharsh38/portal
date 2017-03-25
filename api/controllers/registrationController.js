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

	function uploadPitch(request, response) {
		var temp_path = request.files.file.path;
		var target_path = './public/media/pitches/' + request.files.file.originalFilename;
		fs.rename(temp_path, target_path, function (error) {
			if (error) {
				response.json(error);
			} else {
				var returnObject = {};
				returnObject.path = target_path.toString().slice(8);

				response.status(200).json(returnObject);
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

	function getRegistrationData(request, response) {
		if (!request.body.serialId) {
			throwError(response, request, 404, 'requesting serail id not found', 'no serial id found');
		} else {
			Registration.findOne({
					serialId: request.body.serialId,
					// teamId: request.body.teamId,
				})
				.select({
					"serialId": 1,
					"teamId": 1,
					"team_leader.email": 1,
					"team_leader.mobileno": 1,
				})
				.exec(function (error, data) {
					if (error) {
						throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
						return;
					}
					if (!data) {
						throwError(response, error, 404, 'Not Found', 'Registration not found');
					} else {
						var newData = {
							serialId: data.serialId,
							teamId: data.teamId,
							email: data.team_leader.email,
							mobileno: data.team_leader.mobileno,
						};
						response.status(200);
						response.json(newData);
					}
				});
		}
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
		if (type) {
			console.log('donwload skip');
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
											} else if (request.body.no_payment) {
												dnlink += request.body.receipt_to_generate;
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
			teamId: 'HI123456',
			date: nd,
			team_leader: {
				name: 'Raj Kotari',
				enrollment: '9876543210',
				college_name: 'L.D. College of Engineering'
			},
			eventObject: {
				event_name: 'UI/UX Development',
				event_section: 'HackIt'
			},
			other_participants: [{
				name: 'Raj Kotari',
				enrollment: '9876543210',
				college_name: 'L. D. College'
			}, {
				name: 'Raj Kotari',
				enrollment: '9876543210',
				college_name: 'L. D. College'
			}]
		};
		slip = generateSlip('noPayment', 'example', dataToGeneratePDF);
		console.log("Done");
	}


	function register(request, response) {
		var registration = new Registration();
		// console.log("reqqqqqqqqqqqqq", request.body.eventObject);
		registration.eventObject = request.body.eventObject;
		registration.no_of_participants = request.body.no_of_participants;
		registration.team_leader = request.body.team_leader;
		registration.other_participants = request.body.other_participants;
		registration.total_amount = request.body.total_amount;
		registration.do_payment = request.body.do_payment;
		registration.late_payment = request.body.late_payment;
		registration.teamId = request.body.eventObject.event_shortcode + rand.generateDigits(6);
		// registration.teamId = "SC" + rand.generateDigits(6);
		console.log("request", request.body);
		var slip;
		var dataToGeneratePDF;

		var current_date = new Date();
		var nd = current_date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		console.log("1");
		console.log(registration.do_payment);
		if (request.body.do_payment) {
			console.log("2");
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
			console.log("3");
			dataToGeneratePDF = {
				teamId: registration.teamId,
				team_leader: registration.team_leader,
				date: nd,
				amount: registration.total_amount,
				other_participants: registration.other_participants,
				eventObject: registration.eventObject
			};
			slip = generateSlip('latePayment', registration.teamId, dataToGeneratePDF, request, response, registration);
		} else if (request.body.no_payment) {
			console.log("4");
			console.log("In Startup");
			// if (request.body.receipt_to_generate == 'startup') {
			if (request.body.project_url) {
				registration.project_url = request.body.project_url;
				registration.project_summary = request.body.project_summary;
			}

			dataToGeneratePDF = {
				teamId: registration.teamId,
				team_leader: registration.team_leader,
				date: nd,
				other_participants: registration.other_participants,
				eventObject: registration.eventObject
			};
			console.log("2");
			slip = generateSlip(request.body.receipt_to_generate, registration.teamId, dataToGeneratePDF, request, response, registration);
		} else {
			throwError(response, error, 500, 'Internal Server error', 'Event Register');
		}
	}




	function downloadConfirmSlip(request, response) {
		var type = 'confirmPayment';
		var teamId = request.params.teamId;

		Registration.findOne({
			teamId: teamId
		}).populate({
			path: 'facultyId',
			select: '_id name'
		}).exec(function (error, registration) {
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
				var time = registration.updatedAt;
				var teamid = registration.teamId;
				var type = 'confirmPayment';
				var nd = time.toLocaleDateString('en-US', {
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
					faculty_name: registration.facultyId.name,
					time: nd
				};

				fs.readFile('./api/slips/templates/' + type + '.hbs', function (error, file) {
					if (!error) {
						var source = file.toString();
						var template = Handlebars.compile(source);
						var result = template(data);
						fs.writeFile("./api/slips/" + type + "/html/" + teamid + ".html", result, function (error) {
							if (error) {
								throwError(response, error, 400, 'Bad Request', 'PDF Conversion Failed');
							} else {
								var html = fs.readFileSync('./api/slips/' + type + '/html/' + teamid + '.html', 'utf8');

								var options = {
									format: 'Letter',
									zoom: 0.5
								};

								pdf.create(html, options).toFile('./api/slips/' + type + '/' + teamid + '.pdf', function (error, res) {
									if (error) {
										throwError(response, error, 400, 'Bad Request', 'PDF Creation Failed');
									} else {

										response.download('./api/slips/' + type + '/' + teamid + '.pdf', function (error, data) {
											if (error) {
												throwError(response, error, null, 'Slip Download', 'Download Failed');
											} else {
												response.status(200);
												response.send(data);
											}
										});
									}
								});
							}
						});
					} else {
						throwError(response, error, 404, 'Not Found', 'Generated data not found.');
					}
				});

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

		Registration.aggregate(
			[{
					$match: {
						"eventObject.event_name": request.body.event_name,
						"confirmation": request.body.confirmation,
					}
				},
				{
					$group: {
						_id: {
							condition: (request.body.confirmation) ? "$teamId" : "$team_leader.email"
						},
						team_leader: {
							$first: "$team_leader"
						},
						other_participants: {
							$first: "$other_participants"
						},
						teamId: {
							$first: "$teamId"
						}
					}
				}
			],
			function (error, registrations) {
				var excelPrefix = (request.body.confirmation) ? "Confirmed-" : "Unconfirmed-";

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
							var newElem = e;
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
						fs.writeFileSync('./public/documents/' + excelPrefix + en + '.xlsx', xls, 'binary');
					}
					if (fs.existsSync('./public/documents/' + excelPrefix + en + '.xlsx')) {
						response.status(200);
						response.json({
							// <<<<<<< HEAD
							// 							path: '/documents/' + en + '.xlsx'
							// =======
							path: '/documents/' + excelPrefix + en + '.xlsx'
							// >>>>>>> master
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
						_id: {
							eventName: "$eventObject.event_name"
						},
						confirmed_registrations: {
							$sum: {
								$cond: [{
									$eq: ["$confirmation", true]
								}, 1, 0]
							}
						},
						unconfirmed_registrations: {
							$addToSet: {
								$cond: [{
									$eq: ["$confirmation", false]
								}, "$team_leader.email", false]
							}
						},
						event_section: {
							$first: "$eventObject.event_section"
						},
					},
				},
				{
					$unwind: "$unconfirmed_registrations",
				},
				{
					$group: {
						_id: {
							eventName: "$_id"
						},
						event_section: {
							$first: "$event_section"
						},
						confirmed_registrations: {
							$first: "$confirmed_registrations"
						},
						unconfirmed_registrations: {
							$sum: {
								$cond: [{
									$eq: ["$unconfirmed_registrations", false]
								}, 0, 1]
							}
						},
						unc: {
							$first: "$unconfirmed_registrations"
						}
					}
				},
				{
					$sort: {
						"event_section": 1,
					}
				}
			],
			function (error, data) {
				console.log(data);
				if (error) {
					throwError(response, "Finding all registrations according to event", error);
				} else {

					response.status(200);
					response.json(data);
				}
			}
		);




	}

	function getConfirmRegistrationCount(request, response) {
		Registration.aggregate(
			[{
				$group: {
					_id: {
						confirmation: "$confirmation"
					},
					count: {
						$sum: 1
					},
					teamId: {
						$push: "$teamId"

					},
					paymentMethod: {
						$push: {
							$cond: [{
								$eq: ["$do_payment", true]
							}, "forPayment", "latePayment"]
						}
					},
					numberOfParticipant: {
						$push: "$no_of_participants"
					},

					total_amount: {
						$push: "$total_amount"
					}
				}
			}],
			function (error, data) {
				if (error) {
					throwError(response, "Finding all registrations according to event", error);
				} else {
					var newData = {
						confirmedCount: data[0].count,
						confirmedParticipants: data[0].numberOfParticipant,
						unConfirmedCount: data[1].count,
						unConfirmedParticipants: data[1].numberOfParticipant,
						totalConfirmedParticipants: 0,
						totalUnconfirmedParticipants: 0,
						totalAmountCollected: 0,
						totalAmountToBeCollected: 0,
					};
					console.log(data);
					_.each(data[0].numberOfParticipant, function (element, index, list) {
						newData.totalConfirmedParticipants += (element === null) ? 0 : parseInt(element);
					});
					_.each(data[0].total_amount, function (element, index, list) {
						newData.totalAmountCollected += (element === null) ? 0 : parseInt(element);
					});
					_.each(data[1].numberOfParticipant, function (element, index, list) {
						if (fs.existsSync('./api/slips/' + data[1].paymentMethod[index] + '/' + data[1].teamId[index] + '.pdf')) {
							newData.totalUnconfirmedParticipants += (element === null) ? 0 : parseInt(element);
						}
					});
					_.each(data[1].numberOfParticipant, function (element, index, list) {
						if (!fs.existsSync('./api/slips/' + data[1].paymentMethod[index] + '/' + data[1].teamId[index] + '.pdf')) {
							newData.unConfirmedCount--;
						}
					});
					_.each(data[1].total_amount, function (element, index, list) {
						newData.totalAmountToBeCollected += (element === null) ? 0 : parseInt(element);
					});
					response.status(200).json(newData);
				}
			});
	}




	function exportParticipantList(request, response) {
		Registration.find()
			.select('teamId facultyId no_of_participants team_leader eventObject.event_name total_amount confirmation other_participants')
			.exec(function (error, data) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Registration Fetch Failed');
					return;
				}
				if (!data) {
					throwError(response, error, 404, 'Not Found', 'Registration not found');
				} else {
					var participantsData = [];
					_.each(data, function (element, index, list) {
						var arrayOfParticipants = _.union([element.team_leader], element.other_participants);
						arrayOfParticipants = _.map(arrayOfParticipants, function (e, i, l) {
							var newElem = e.toJSON();
							newElem.event_name = element.eventObject.event_name;
							newElem.teamId = element.teamId;
							newElem.confirmation = element.confirmation;
							return newElem;
						});
						participantsData = _.union(participantsData, arrayOfParticipants);
					});
					if (participantsData) {
						var xls = json2xls(participantsData);
						fs.writeFileSync('./public/documents/badme.xlsx', xls, 'binary');
					}
					if (fs.existsSync('./public/documents/badme.xlsx')) {
						response.status(200);
						response.json({
							path: '/documents/bame.xlsx'
						});
					} else {
						console.log('File doesn\'t exist');
						throwError(response, "file does not exist", 404, 'File Not Found', 'file not found');
					}
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
	ac.generateSlip = generateSlip;
	ac.generatePDFTest = generatePDFTest;
	ac.uploadPitch = uploadPitch;
	ac.exportUnconfirmedRegistration = exportUnconfirmedRegistration;
	ac.getConfirmRegistrationCount = getConfirmRegistrationCount;
	ac.exportParticipantList = exportParticipantList;
	ac.getRegistrationData = getRegistrationData;
	return ac;
};

module.exports = registrationController;
