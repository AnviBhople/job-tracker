const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));

const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB connected successfully");

		app.listen(PORT, () => {
			console.log(
				`System Server initialized successfully running on port ${PORT}`,
			);
		});
	})
	.catch((err) => {
		console.error("Critical Database Connection Error:", err);
	});
