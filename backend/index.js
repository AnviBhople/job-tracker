// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const initReminderCronJob = require("./utils/reminderWorker");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// initReminderCronJob();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
// 	console.log(
// 		`🚀 System Server initialized successfully running on port ${PORT}`,
// 	),
// );

// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/jobs", require("./routes/jobs"));

// mongoose
// 	.connect(process.env.MONGO_URI)
// 	.then(() => {
// 		console.log("MongoDB connected");
// 		app.listen(process.env.PORT || 5000, () => {
// 			console.log("Server running on port 5000");
// 		});
// 	})
// 	.catch((err) => console.log(err));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Global Middleware configurations
app.use(cors());
app.use(express.json());

// Mount Application API Routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));

// Connect to MongoDB, then boot up a SINGLE instance of the HTTP server listener
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
