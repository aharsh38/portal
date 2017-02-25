var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Faculty = require('../models/facultyModel');

passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function (username, password, done) {
		Faculty.findOne({
			email: username
		}, function (error, faculty) {
			if (error) {
				return done(error);
			}

			if (!faculty) {
				return done(null, false, {
					errorState: {
						faculty: true,
						password: false
					},
					message: 'Email id is not registered'
				});
			}

			if (!faculty.checkValidPassword(password)) {
				return done(null, false, {
					errorState: {
						faculty: false,
						password: true
					},
					message: 'Password is incorrect'
				});
			}

			return done(null, faculty);
		});
	}
));
