var getParamFaculty = function (Faculty) {
	return function (request, response, next) {
		Faculty.findById(request.params.facultyId)
			.select('_id name email mobileno collegeId student_coordinator registrations_count collected_amount forgot_password forgot_password_token verified rejected')
			.populate({
				path: 'collegeId'
			})
			.exec(function (err, faculty) {
				console.log(faculty);
				if (err) {
					response.status(500).send('Error in Server');
				} else if (!faculty) {
					response.status(404).send('No Faculty found');
				} else {
					request.faculty = faculty;
					next();
				}
			});
	};
};

module.exports = getParamFaculty;
