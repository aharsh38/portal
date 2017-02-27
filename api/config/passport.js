var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Faculty = require('../models/facultyModel');
var Member = require('../models/memberModel');

passport.use('faculty-local', new LocalStrategy({
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

			if (faculty.forgot_password) {
				return done(null, false, {
					errorState: {
						faculty: false,
						password: true
					},
					message: 'Applied for Forgot Password'
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

passport.use('member-local', new LocalStrategy({
		usernameField: 'email'
	},
	function (username, password, done) {
		Member.findOne({
			email: username
		}, function (error, member) {
			if (error) {
				return done(error);
			}

			if (!member) {
				return done(null, false, {
					errorState: {
						member: true,
						password: false
					},
					message: 'Email id is not registered'
				});
			}

			if (member.forgot_password) {
				return done(null, false, {
					errorState: {
						member: false,
						password: true
					},
					message: 'Applied for Forgot Password'
				});
			}

			if (!member.checkValidPassword(password)) {
				return done(null, false, {
					errorState: {
						member: false,
						password: true
					},
					message: 'Password is incorrect'
				});
			}

			return done(null, member);
		});
	}
));
