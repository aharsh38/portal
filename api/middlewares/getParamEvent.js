var getParamEvent = function (Event) {
	return function (request, response, next) {
		Event.findById(request.params.eventId, function (err, event) {
			if (err) {
				console.log(err);
			} else if (event) {
				request.event = event;
				next();
			} else {
				response.status(404).send('No Event found');
			}
		});
	};
};

module.exports = getParamEvent;
