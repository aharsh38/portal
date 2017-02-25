var express = require('express');

var collegeController = function(College) {

    function importCollege() {

    }

    function getAllCollege() {
      College.find().exec(function(error, college){
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

    var mc = {};
    mc.importCollege = importCollege;
    mc.getAllCollege = getAllCollege;
    return mc;
};

module.exports = collegeController;
