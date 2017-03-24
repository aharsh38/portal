var mongoose = require('mongoose');
var config = require('../config/config');
var Schema = mongoose.Schema;

var registrationModel = new Schema({
	eventObject: {
		event_id: {
			type: String
		},
		event_shortcode: {
			type: String
		},
		event_name: {
			type: String
		},
		event_section: {
			type: String
		}
	},
	facultyId: {
		type: Schema.Types.ObjectId,
		ref: 'Faculty'
	},
	no_of_participants: {
		type: String,
		required: true
	},
	team_leader: {
		name: {
			type: String,
			required: true
		},
		mobileno: {
			type: String,
			required: true
		},
		enrollment: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		college_name: {
			type: String,
			required: true
		},
		semester: {
			type: String,
			required: true
		},
		branch: {
			type: String,
			required: true
		}
	},
	other_participants: [{
		name: {
			type: String,
			required: true
		},
		mobileno: {
			type: String,
			required: true
		},
		enrollment: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		college_name: {
			type: String,
			required: true
		},
		semester: {
			type: String,
			required: true
		},
		branch: {
			type: String,
			required: true
		}
	}],
	teamId: {
		type: String,
		unique: true,
		required: true
	},
	serialId: {
		type: String
	},
	total_amount: {
		type: Number,
	},
	confirmation: {
		type: Boolean,
		default: false
	},
	one_time_edit: {
		type: Boolean,
		default: false
	},
	do_payment: {
		type: Boolean,
		default: false
	},
	late_payment: {
		type: Boolean,
		default: false
	},
	no_payment: {
		type: Boolean,
		default: false
	},
	confirmed_mail_send: {
		type: Boolean,
		default: false
	},
	confirmation_date: {
		type: Date
	},
	project_url: {
		type: String,
		default: null
	},
	project_summary: {
		type: String,
		default: null
	}
}, {
	minimize: false,
	timestamps: true
});

registrationModel.index({
	teamId: "text"
});

module.exports = mongoose.model('Registration', registrationModel);
