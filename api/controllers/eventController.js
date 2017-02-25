var eventController = function (Event) {

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


	function getAllEvents(request, response) {
		Event.find(function (error, events) {
			if (error) {
				throwError(response, "Finding All Events", error);
			} else {
				response.status(200);
				response.json(events);
			}
		});
	}

	function getEventsBySection(req, res) {
		var i = 0;
		var event_classification = [];

		Event.aggregate(
			[{
				$group: {
					_id: "$section",
					events: {
						$push: "$name"
					}
				}
			}],
			function (error, data) {
				if (error) {
					throwError(response, "Finding all events according to section", error);
				}

				for (var j = 0; j < data.length; j++) {
					for (var k = 0; k < data[j]['events'].length; k++) {
						classification.push({
							section_name: data[j]['_id'],
							event_name: data[j]['events'][k]
						});

						i = parseInt(i + 1);
					}
				}
				response.json(data);
			}
		);
	}


	function createEvent(request, response) {
		var event_obj = new Event(request.body);
		event_obj.save(function (error) {
			if (error) {
				throwError(response, "Creating Event", error);
			} else {
				response.status(201);
				response.send(event_obj);
			}
		});

	}

	function getSingleEvent(request, response) {
		if (request.event) {
			response.status(200);
			response.json(request.event);
		}
	}

	function updateEvent(request, response) {
		request.event = request.body.event;
		request.event.save(function (error) {
			if (error) {
				throwError(response, "Updating Event", error);
			} else {
				response.status(200).json(request.Event);
			}
		});
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

	return {
		getAllEvents: getAllEvents,
		getEventsBySection: getEventsBySection,
		createEvent: createEvent,
		getSingleEvent: getSingleEvent,
		updateEvent: updateEvent,
		deleteEvent: deleteEvent
	};
};


module.exports = eventController;
