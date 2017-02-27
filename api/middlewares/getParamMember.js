var getParamMember = function (Member) {
	return function (request, response, next) {
		Member.findById(request.params.memberId, function (err, member) {
			if (err) {
				response.status(500).send('Error in Server');
			} else if (member) {
				request.member = member;
				next();
			} else {
				response.status(404).send('No Member found');
			}
		});
	};
};

module.exports = getParamMember;
