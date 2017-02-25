//var passport = require('passport');

var memberController = function (Faculty, Member) {

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

	function verifyFaculty(request, response) {
		Faculty.findOne({
				_id: request.body.facultyId
			})
			.exec(function (error, faculty) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'Faculty Find Failed');
					return;
				}
				if (!faculty) {
					throwError(response, error, 404, 'Not Found', 'Faculty not found');
				} else {

					faculty.verified = true;
					faculty.save(function (error) {
						if (error)
							throwError(response, error, 500, 'Internal Server Error', 'Faculty Verified Failed');
						else {
							response.status(200).json({
								"message": "Faculty Succesfuly Verified"
							});
						}
					});
				}
			});
	}

	function sendVerifiedMails(request, response) {
		Registration.find({
			confirmed: true
		}).exec(function (error, registrations) {

		});
	}

	function submitColleges(request, response) {

	}

	var mc = {};
	mc.verifyFaculty = verifyFaculty;
	mc.sendVerifiedMails = sendVerifiedMails;
	return mc;
};
module.exports = memberController;
