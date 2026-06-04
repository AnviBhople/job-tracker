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
			<div className="d-flex justify-content-between align-items-start">
				<div style={{ flex: 1 }}>
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
							<span className="overdue-badge">⚠ Follow-up overdue</span>
						)}
					</div>
					<p className="job-role">{job.role}</p>
					<div className="d-flex flex-wrap gap-3">
						{job.appliedDate && (
							<span className="job-meta">
								📅 Applied{" "}
								{new Date(job.appliedDate).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						)}
						{job.followUpDate && (
							<span className="job-meta">
								🔔 Follow-up{" "}
								{new Date(job.followUpDate).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						)}
						{job.jobLink ? (
							<a
								href={job.jobLink}
								target="_blank"
								rel="noopener noreferrer"
								className="job-card-link-title">
								{job.company} 🔗
							</a>
						) : (
							<span className="job-card-static-title">{job.company}</span>
						)}
					</div>
					{job.notes && <div className="job-notes">💬 {job.notes}</div>}
				</div>
				<div className="job-actions ms-3">
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
