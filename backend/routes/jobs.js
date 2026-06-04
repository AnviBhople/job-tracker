// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Job = require("../models/Job");

// router.get("/", auth, async (req, res) => {
// 	try {
// 		const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
// 		res.json(jobs);
// 	} catch (err) {
// 		res.status(500).send("Server error");
// 	}
// });

// router.post("/", auth, async (req, res) => {
// 	try {
// 		const job = new Job({ ...req.body, user: req.user.id });
// 		await job.save();
// 		res.json(job);
// 	} catch (err) {
// 		res.status(500).send("Server error");
// 	}
// });

// router.put("/:id", auth, async (req, res) => {
// 	try {
// 		let job = await Job.findById(req.params.id);
// 		if (!job) return res.status(404).json({ msg: "Job not found" });
// 		if (job.user.toString() !== req.user.id)
// 			return res.status(401).json({ msg: "Not authorized" });

// 		job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
// 		res.json(job);
// 	} catch (err) {
// 		res.status(500).send("Server error");
// 	}
// });

// router.delete("/:id", auth, async (req, res) => {
// 	try {
// 		let job = await Job.findById(req.params.id);
// 		if (!job) return res.status(404).json({ msg: "Job not found" });
// 		if (job.user.toString() !== req.user.id)
// 			return res.status(401).json({ msg: "Not authorized" });

// 		await Job.findByIdAndDelete(req.params.id);
// 		res.json({ msg: "Job removed" });
// 	} catch (err) {
// 		res.status(500).send("Server error");
// 	}
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Job = require("../models/Job");

// @route   GET /api/jobs
// @desc    Get all job applications for logged-in user
router.get("/", auth, async (req, res) => {
	try {
		const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
		res.json(jobs);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

// @route   POST /api/jobs
// @desc    Create a new job application
router.post("/", auth, async (req, res) => {
	try {
		const job = new Job({ ...req.body, user: req.user.id });
		await job.save();
		res.json(job);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

// @route   PUT /api/jobs/:id
// @desc    Update an existing job application (Fixes Mongoose deprecation warning)
router.put("/:id", auth, async (req, res) => {
	try {
		let job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ msg: "Job not found" });
		if (job.user.toString() !== req.user.id)
			return res.status(401).json({ msg: "Not authorized" });

		// Fixed the deprecation warning by replacing { new: true } with { returnDocument: "after" }
		// Using $set guarantees deep property updates like toggles and notes save cleanly
		job = await Job.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ returnDocument: "after" },
		);
		res.json(job);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job application
router.delete("/:id", auth, async (req, res) => {
	try {
		let job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ msg: "Job not found" });
		if (job.user.toString() !== req.user.id)
			return res.status(401).json({ msg: "Not authorized" });

		await Job.findByIdAndDelete(req.params.id);
		res.json({ msg: "Job removed" });
	} catch (err) {
		res.status(500).send("Server error");
	}
});

module.exports = router;
