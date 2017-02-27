var jwt = require('express-jwt');

var authenticate = function (config) {
	var facultyAuth = jwt({
		secret: config.secrets.faculty,
		userProperty: 'payload'
	});

	var memberAuth = jwt({
		secret: config.secrets.member,
		userProperty: 'payload'
	});

	function generalFaculty(request, response, next) {
		if (!request.payload.verified) {
			response.status(401);
			response.json({
				"message": "Unauthorized",
				"for": "Faculty is not verified"
			});
		} else if (request.payload.rejected) {
			response.status(403);
			response.json({
				"message": "Forbidden",
				"for": "Faculty has been rejected"
			});
		} else if (request.payload.forgot_password) {
			response.status(409);
			response.json({
				"message": "Conflict",
				"for": "Faculty has requested for forgot password"
			});
		} else {
			next();
		}
	}

	function generalMember(request, response, next) {
		if (request.payload.forgot_password) {
			response.status(409);
			response.json({
				"message": "Conflict",
				"for": "Member has requested for forgot password"
			});
		} else {
			next();
		}
	}

	return {
		facultyAuth: facultyAuth,
		memberAuth: memberAuth,
		generalFaculty: generalFaculty,
		generalMember: generalMember
	};
};

module.exports = authenticate;
