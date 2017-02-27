var mongoose = require('mongoose');
var config = require('../config/config');
var Schema = mongoose.Schema;
var eventModel = new Schema({
	name: {
		type: String,
		required: true
	},
	tagline: {
		type: String,
	},
	description: {
		type: String,
	},
	rules: {
		type: String,
	},
	specification: {
		type: String,
	},
	problem_statement: {
		type: String,
	},
	judging_criteria: {
		type: String,
	},
	managers: [{
		manager_name: String,
		contact_number: Number,
		email_id: String
	}],
	section: {
		type: String,
	},
	fees: {
		type: Number,
	},
	fees_type: {
		type: String,
	},
	do_payment: {
		type: Boolean,
	},
	shortcode: {
		type: String,
	},
	attachments: [{
		doc_name: String,
		link: String
	}]
}, {
	minimize: false,
	timestamps: true
});

module.exports = mongoose.model('Events', eventModel);
