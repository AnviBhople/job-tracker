const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		company: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["Applied", "Interview", "Offer", "Rejected"],
			default: "Applied",
		},
		priority: {
			type: String,
			enum: ["High", "Medium", "Low"],
			default: "Medium",
		},
		appliedDate: {
			type: Date,
			default: Date.now,
		},
		followUpDate: {
			type: Date,
		},
		notes: {
			type: String,
			default: "",
		},
		jobLink: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Job", JobSchema);
