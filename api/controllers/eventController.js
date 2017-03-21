var _ = require('underscore');
var fs = require('fs');
var express = require('express');

var eventController = function (Events) {
	function throwError(response, errorFor, error) {
		response.status(500);
		response.json({
			"error": {
				"message": "Internal Server Error",
				"for": errorFor,
				"original": error
			}
		});
	}

	function uploadDocs(request, response) {
		var temp_path = request.files.file.path;
		var target_path = './public/media/docs/' + request.files.file.originalFilename;
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

	function uploadImage(request, response) {
		var temp_path = request.files.file.path;
		var target_path = './public/media/images/' + request.files.file.originalFilename;
		fs.rename(temp_path, target_path, function (error) {
			if (error) {
				response.json(error);
			} else {
				var returnObject = {};
				returnObject.path = 'http://portal.gtu.ac.in' + target_path.toString().slice(8);
				response.status(200).json(returnObject);
			}
		});
	}

	function uploadIcons(request, response) {
		// console.log("FILE",request.file);
		// console.log("FILES", request.files);

		var temp_path = request.files.file.path;
		var target_path = './public/media/icons/' + request.files.file.originalFilename;
		fs.rename(temp_path, target_path, function (error) {
			if (error) {
				console.log("ERROR", error);
				response.json(error);
			} else {
				var returnObject = {};
				returnObject.path = 'http://portal.gtu.ac.in' + target_path.toString().slice(8);
				response.status(200).json(returnObject);
			}
		});
	}


	function getAllEvents(request, response) {
		Events.find(function (error, events) {
			if (error) {
				throwError(response, "Finding All Events", error);
			} else {
				response.status(200);
				response.json(events);
			}
		});
	}

	function createEvent(request, response) {
		var event_obj = new Events();
		event_obj.name = request.body.name;
		event_obj.tagline = request.body.tagline;
		event_obj.description = request.body.description;
		event_obj.rules = request.body.rules;
		event_obj.specification = request.body.specification;
		event_obj.problem_statement = request.body.problem_statement;
		event_obj.judging_criteria = request.body.judging_criteria;
		event_obj.managers = request.body.managers;
		event_obj.section = request.body.section;
		event_obj.main_section = request.body.main_section;
		event_obj.fixed_payment = request.body.fixed_payment;
		event_obj.keywords = request.body.keywords;
		event_obj.no_of_participants = request.body.no_of_participants;
		event_obj.fees = request.body.fees;
		event_obj.fees_type = request.body.fees_type;
		event_obj.shortcode = request.body.shortcode;
		event_obj.event_image = request.body.event_image;
		event_obj.event_icon = request.body.event_icon_image;
		event_obj.attachments = request.body.attachments;
		event_obj.save(function (error) {
			if (error) {
				throwError(response, "Creating Event", error);
			} else {
				response.status(201);
				response.json(event_obj);
			}
		});

	}

	function getSingleEvent(request, response) {
		if (request.event) {
			response.status(200);
			response.json(request.event);
		}
	}


	function deleteEvent(request, response) {
		request.event.remove(function (error) {
			if (error) {
				throwError(response, "Deleting Event", error);
			} else {
				response.status(202).send({
					"message": "Event Removed"
				});
			}
		});
	}

	function updateEvent(request, response) {
		request.event.name = request.body.name;
		request.event.tagline = request.body.tagline;
		request.event.description = request.body.description;
		request.event.rules = request.body.rules;
		request.event.specification = request.body.specification;
		request.event.problem_statement = request.body.problem_statement;
		request.event.judging_criteria = request.body.judging_criteria;
		request.event.managers = request.body.managers;
		request.event.section = request.body.section;
		request.event.main_section = request.body.main_section;
		request.event.fixed_payment = request.body.fixed_payment;
		request.event.keywords = request.body.keywords;
		request.event.no_of_participants = request.body.no_of_participants;
		request.event.fees = request.body.fees;
		request.event.fees_type = request.body.fees_type;
		request.event.event_image = request.body.event_image;
		request.event.shortcode = request.body.shortcode;
		request.event.event_icon = request.body.event_icon_image;
		request.event.attachments = request.body.attachments;
		request.event.save(function (error) {
			if (error) {
				throwError(response, "Updating Event", error);
			} else {
				response.status(200).json(request.Event);
			}
		});
	}

	function getEventsBySectionM(request, response) {
		var eventsection = request.params.eventsection;
		Events.find({
				section: request.params.eventsection
			})
			.exec(function (error, events) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Events Fetch Failed');
					return;
				}
				if (!events) {
					throwError(response, error, 404, 'Not Found', 'Events Not Found');
				} else {
					var ev = [];
					var eventsToSend = events;
					_.each(eventsToSend, function (element, index, list) {
						ev.push(_.pick(element, '_id', 'event_image', 'event_icon', 'name'));
					});

					response.status(200);
					response.json(ev);
				}
			});
	}





	return {
		getAllEvents: getAllEvents,
		// getEventsBySection: getEventsBySection,
		getEventsBySectionM: getEventsBySectionM,
		createEvent: createEvent,
		getSingleEvent: getSingleEvent,
		updateEvent: updateEvent,
		deleteEvent: deleteEvent,
		uploadDocs: uploadDocs,
		uploadImage: uploadImage,
		uploadIcons: uploadIcons
	};
};
module.exports = eventController;
