var express = require('express');
var rand = require('random-key');
var fs = require('fs');
var pdf = require('html-pdf');
var Handlebars = require('handlebars');

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

	function generateSlip(type, teamid, data, next) {
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
								format: 'Letter'
							};

							pdf.create(html, options).toFile('./api/slips/' + type + '/' + teamid + '.pdf', function (error, res) {

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

	function register(request, response) {
		var registration = new Registration(request.body);
		registration.teamId = request.body.eventObject.event_shortcode + rand.generateDigits(4);
		var slip;
		var dataToGeneratePDF;

		if (registration.do_payment) {
			registration.serialId = rand.generate(8);
			dataToGeneratePDF = {
				teamId: registration.teamId,
				serialId: registration.serialId,
				team_leader: registration.team_leader
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

		if (slip.message != 'error') {
			registration.save(function (error) {
				throwError(response, error, null, 'Slip Download', 'Download Failed');
				if (!error) {
					response.status(200);
					response.json();
				}
			});
		} else {
			throwError(response, slip.error, 500, 'Internal Server Error', 'Generating Slip Failed');
		}
	}

	function downloadSlip(request, response) {
		var teamId = request.params.teamId;
		var type = request.query.type;
		response.download('./api/slips/' + type + '/' + teamId + '.pdf', function (error, data) {
			if (error) {
				throwError(response, error, null, 'Slip Download', 'Download Failed');
			} else {
				response.status(404).send(data);
			}
		});
	}

	function getRegistration(request, response) {
		Registration.find()
			.exec(function (error, registrations) {
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

	function exportRegistration(request, response) {
		Registration.find({
				eventObject: {
					event_name: request.params.eventName
				},
				confirmation: true
			})
			.exec(function (error, registrations) {
				var participantsData = [];
				_.each(registrations, function (element, index, list) {
					var arrayOfParticipants = _.union([element.team_leader], element.other_participants);
					arrayOfParticipants = _.map(arrayOfParticipants, function (e, i, l) {
						e.teamId = element.teamId;
						return e;
					});

					participantsData = _.union(participantsData, arrayOfParticipants);
				});

				if (participantsData) {
					var xls = json2xls(participantsData);
					fs.writeFileSync('data.xlsx', xls, 'binary');
				}
			});
	}

	function getAllRegistrationData(request, response) {
		var data = [];
		Registration.find().exec(function (error, registrations) {
			var totalConfirmed = _.countBy(registrations, function (element, index, list) {
				if (element.confirmed) {
					return element.eventObject.event_name;
				}
			});

			var totalNotConfirmed = _.countBy(registrations, function (element, index, list) {
				if (!element.confirmed) {
					return element.eventObject.event_name;
				}
			});

			var arrayToSend = [];
			var allEvents = _.keys(totalConfirmed);
			_.each(allEvents, function (element, index, list) {
				var obj = {
					event_name: element,
					confirmed_registrations: totalConfirmed[element],
					not_confirmed_registrations: totalNotConfirmed[element]
				};
				arrayToSend.push(obj);
			});

			response.json(arrayToSend);
		});
	}

	function oneTimeEdit(request, response) {
		if (request.registration.confirmation) {

		} else {
			throwError(response, null, 405, 'Method Not Allowed', 'One time edit not possible');
		}
	}

	var ac = {};
	ac.register = register;
	ac.downloadSlip = downloadSlip;
	ac.getRegistration = getRegistration;
	ac.exportRegistration = exportRegistration;
	ac.getAllRegistrationData = getAllRegistrationData;
	ac.oneTimeEdit = oneTimeEdit;
	return ac;
};

module.exports = registrationController;
