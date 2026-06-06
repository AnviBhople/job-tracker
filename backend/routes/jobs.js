const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Job = require("../models/Job");

router.get("/", auth, async (req, res) => {
	try {
		const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
		res.json(jobs);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

router.post("/", auth, async (req, res) => {
	try {
		const job = new Job({ ...req.body, user: req.user.id });
		await job.save();
		res.json(job);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

router.put("/:id", auth, async (req, res) => {
	try {
		let job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ msg: "Job not found" });
		if (job.user.toString() !== req.user.id)
			return res.status(401).json({ msg: "Not authorized" });

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
