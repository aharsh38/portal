var mongoose = require('mongoose');
var config = require('../config/config');

var Schema = mongoose.Schema;

var collegeModel = new Schema({
	college_name: {
		type: String,
		required: true
	},
	college_code: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	pincode: {
		type: String,
		required: true
	},
	gtu_affiliate: {
		type: String,
		required: true
	},
	faculty_assigned: {
		type: Boolean,
		default: false
	},
	facultyId: {
		type: Schema.Types.ObjectId,
		ref: 'Faculty'
	}
}, {
	timestamps: true,
	minimize: false
});

module.exports = mongoose.model('College', collegeModel);
