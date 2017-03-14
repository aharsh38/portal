var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var Schema = mongoose.Schema;

var facultyModel = new Schema({
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
    verified: {
        type: Boolean,
        default: false
    },
    collegeId: {
        type: Schema.Types.ObjectId,
        ref: 'College',
    },
    student_coordinator: {
        name: String,
        email: String,
        mobileno: String,
        enrollment: String,
        semester: String,
        branch: String
    },
    rejected: {
        type: Boolean,
        default: false
    },
    forgot_password: {
        type: Boolean,
        default: false
    },
    forgot_password_token: {
        type: String
    },
    registrations_count: {
        type: Number,
        default: 0
    },
    collected_amount: {
        type: Number,
        default: 0
    },
    password: String,
    salt: String
}, {
    minimize: false,
    timestamps: true
});

facultyModel.methods.setPassword = function(pwd) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(pwd, this.salt, 1000, 64).toString('hex');
};

facultyModel.methods.checkValidPassword = function(pwd) {
    var password = crypto.pbkdf2Sync(pwd, this.salt, 1000, 64).toString('hex');
    return this.password === password;
};

facultyModel.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 2);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        mobileno: this.mobileno,
        verified: this.verified,
        rejected: this.rejected,
        registrations_count: this.registrations_count,
        collected_amount: this.collected_amount,
        forgot_password: this.forgot_password,
        exp: parseInt(expiry.getTime() / 1000),
    }, config.secrets.faculty);
};

facultyModel.index({
    name: "text"
});

module.exports = mongoose.model('Faculty', facultyModel);
