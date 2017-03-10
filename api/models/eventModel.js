var mongoose = require('mongoose');
var config = require('../config/config');
var Schema = mongoose.Schema;
var eventModel = new Schema({
	name: {
		type: String,
		required: true
	},
	main_section: {
		type: String
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
		type: String
	},
	fees: {
		type: Number
	},
	fees_type: {
		type: String
	},
	fixed_payment: {
		type: Boolean
	},
	no_of_participants: {
		type: Number,
		default: 1
	},
	keywords: {
		type: String
	},
	shortcode: {
		type: String
	},
	event_image: {
		type: String
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
