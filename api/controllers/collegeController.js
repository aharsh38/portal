var express = require('express');
var node_xj = require("xls-to-json");
var _ = require("underscore");

var collegeController = function (College) {

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

	function searchFacultyByCity(request, response) {
		College.find({
				city: request.query.city,
				faculty_assigned: true
			})
			.populate({
				path: 'facultyId',
				select: '_id name email mobileno student_coordinator'
			})
			.exec(function (error, facultyList) {
				if (error) {
					throwError(response, error, 500, 'Internal Server Error', 'College Fetch Failed');
					return;
				}
				if (!facultyList) {
					throwError(response, error, 404, 'Not Found', 'College not found');
				} else {
					response.status(200);
					response.json(facultyList);
				}
			});
	}

	function importCollege(request, response) {
		// var college = new College();
		// mongoose.connection.collections['collectionName'].drop( function(err) {
		//     console.log('collection dropped');
		// });
		node_xj({
			input: "./api/data/college.xlsx", // input xls
			output: "./api/data/college.json" // output json
		}, function (error, result) {
			if (error) {
				console.log(error);
				throwError(response, error, 500, "Internal Server Error", "failed");
				return;
			} else {
				_.each(result, function (element, index, list) {
					var college = new College(element);
					college.save(function (error) {
						if (error) {
							console.log(error);
							throwError(response, error, 500, "Internal server error", "Failed");
							return;
						} else {
							console.log("College : ", index);
							if (index == (result.length - 1)) {
								response.status(200);
								response.json({
									"message": "Done"
								});
							}
						}
					});
				});
			}
		});
	}

	function getAllCollege(request, response) {
		var q = {};
		if (request.query) {

		}
		College.find().exec(function (error, college) {
			if (error) {
				throwError(response, error, 500, 'Internal Server Error', 'College Fetch Failed');
				return;
			}
			if (!college) {
				throwError(response, error, 404, 'Not Found', 'College not found');
			} else {
				response.status(200);
				response.json(college);
			}
		});
	}

	function searchNocoordinatorCollege(request, response) {
		College.find({
			faculty_assigned: false
		}).select({
			name: 1
		}).exec(function (error, colleges) {
			response.json(colleges);
		});
	}

	var mc = {};
	mc.importCollege = importCollege;
	mc.getAllCollege = getAllCollege;
	mc.searchFacultyByCity = searchFacultyByCity;
	mc.searchNocoordinatorCollege = searchNocoordinatorCollege;
	return mc;
};

module.exports = collegeController;
