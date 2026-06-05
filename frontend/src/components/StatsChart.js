import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChart = ({ jobs }) => {
	const totalJobs = jobs.length;
	const appliedCount = jobs.filter((j) => j.status === "Applied").length;
	const interviewCount = jobs.filter((j) => j.status === "Interview").length;
	const offerCount = jobs.filter((j) => j.status === "Offer").length;
	const rejectedCount = jobs.filter((j) => j.status === "Rejected").length;

	const interviewConversionRate =
		totalJobs > 0
			? Math.round(
					((interviewCount + offerCount + rejectedCount) / totalJobs) * 100,
				)
			: 0;

	const offerSuccessRate =
		interviewCount + offerCount > 0
			? Math.round((offerCount / (interviewCount + offerCount)) * 100)
			: 0;

	const data = {
		labels: ["Applied", "Interview", "Offer", "Rejected"],
		datasets: [
			{
				data: [appliedCount, interviewCount, offerCount, rejectedCount],
				backgroundColor: ["#0d6efd", "#ffc107", "#198754", "#dc3545"],
				borderWidth: 1,
				borderRadius: "100%",
			},
		],
	};

	return (
		<div style={{ maxWidth: "260px", margin: "0 auto" }}>
			<Doughnut data={data} />

			<div className="analytics-metrics-panel mt-4 pt-3 border-top">
				<div
					className="d-flex justify-content-between align-items-center mb-2"
					style={{ fontSize: "0.85rem" }}>
					<span className="text-muted"> Interview Rate:</span>
					<span
						className="fw-bold text-dark"
						style={{
							background: "#f0f7ff",
							color: "#0066cc",
							padding: "2px 8px",
							borderRadius: "12px",
						}}>
						{interviewConversionRate}%
					</span>
				</div>
				<div
					className="d-flex justify-content-between align-items-center"
					style={{ fontSize: "0.85rem" }}>
					<span className="text-muted"> Offer Win Rate:</span>
					<span
						className="fw-bold"
						style={{
							background: "#e6f4ea",
							color: "#137333",
							padding: "2px 8px",
							borderRadius: "12px",
						}}>
						{offerSuccessRate}%
					</span>
				</div>
			</div>
		</div>
	);
};

export default StatsChart;
