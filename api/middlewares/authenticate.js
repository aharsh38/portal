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

	function facultyAuthReset(request, response, next) {
		if (!request.payload.admin) {
			response.status(401).send({
				"message": "User not an admin"
			});
		} else {
			next();
		}
	}

	function resellerAuth(request, response, next) {
		if (!request.payload.reseller) {
			response.status(401).send({
				"message": "User not a reseller"
			});
		} else {
			next();
		}
	}

	return {
		generalAuth: generalAuth,
		adminAuth: adminAuth,
		resellerAuth: resellerAuth
	};
};

module.exports = authenticate;
