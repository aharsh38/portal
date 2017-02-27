var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var Schema = mongoose.Schema;

var memberModel = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},

	name: {
		type: String,
		required: true
	},

	mobileno: {
		type: String,
		required: true
	},
	forgot_password: {
		type: Boolean,
		default: false
	},

	forgot_password_token: {
		type: String
	},

	password: String,
	salt: String
}, {
	minimize: false,
	timestamps: true
});

memberModel.methods.setPassword = function (pwd) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.password = crypto.pbkdf2Sync(pwd, this.salt, 1000, 64).toString('hex');
};

memberModel.methods.checkValidPassword = function (pwd) {
	var password = crypto.pbkdf2Sync(pwd, this.salt, 1000, 64).toString('hex');
	return this.password === password;
};

memberModel.methods.generateJwt = function () {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 2);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		mobileno: this.mobileno,
		forgot_password: this.forgot_password,
		exp: parseInt(expiry.getTime() / 1000),
	}, config.secrets.member);
};

memberModel.index({
	name: "text"
});

module.exports = mongoose.model('Member', memberModel);
