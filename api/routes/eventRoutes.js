var express = require('express');
var eventRoutes = function (Event) {
	var eventRouter = express.Router();
	var eventController = require('../controllers/eventController')(Event);

	eventRouter.route('/events_in_section').get(eventController.getEventsBySection);
	eventRouter.route('/events')
		.post(eventController.createEvent)
		.get(eventController.getAllEvents);

	eventRouter.route('/events/:eventId')
		.get(eventController.getSingleEvent)
		.put(eventController.updateEvent)
		.delete(eventController.deleteEvent);

	return eventRouter;
};

module.exports = eventRoutes;
