import React from "react";

const JobCard = ({ job, onEdit, onDelete }) => {
	const isOverdue =
		job.followUpDate &&
		new Date(job.followUpDate) < new Date() &&
		job.status !== "Offer" &&
		job.status !== "Rejected";

	return (
		<div
			className={`job-card ${isOverdue ? "overdue" : ""} ${job.priority === "High" ? "priority-high" : ""}`}>
			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2">
				<div style={{ flex: 1, minWidth: 0 }}>
					<div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
						<span className="job-company">{job.company}</span>
						<span className={`status-badge status-${job.status}`}>
							{job.status}
						</span>
						{job.priority && job.priority !== "Medium" && (
							<span className={`priority-badge priority-${job.priority}`}>
								{job.priority} priority
							</span>
						)}
						{isOverdue && (
							<span
								className="overdue-badge"
								style={{ textTransform: "capitalize" }}>
								Follow-up overdue
							</span>
						)}
					</div>
					<p className="job-role">{job.role}</p>
					<div className="d-flex flex-wrap gap-2">
						{job.appliedDate && (
							<span className="job-meta">
								Applied{" "}
								{new Date(job.appliedDate).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						)}
						{job.followUpDate && (
							<span className="job-meta">
								Follow-up{" "}
								{new Date(job.followUpDate).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						)}
						{job.jobLink && (
							<a
								href={job.jobLink}
								target="_blank"
								rel="noopener noreferrer"
								className="job-link">
								View posting
							</a>
						)}
					</div>
					{job.notes && <div className="job-notes">{job.notes}</div>}
				</div>
				<div className="d-flex flex-row flex-sm-column gap-2 mt-1 mt-sm-0">
					<button className="btn btn-edit" onClick={() => onEdit(job)}>
						Edit
					</button>
					<button className="btn btn-delete" onClick={() => onDelete(job._id)}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default JobCard;
