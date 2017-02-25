var getParamFaculty = function (Faculty) {
	return function (request, response, next) {
		Faculty.findById(request.params.facultyId, function (err, faculty) {
			if (err) {
				response.status(500).send('Error in Server');
			} else if (faculty) {
				request.faculty = faculty;
				next();
			} else {
				response.status(404).send('No Faculty found');
			}
		});
	};
};

module.exports = getParamFaculty;