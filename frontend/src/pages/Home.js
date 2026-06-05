import React, { useState, useEffect, useContext, useCallback } from "react";
import { Row, Col, Form, Dropdown } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import StatsChart from "../components/StatsChart";

const Home = ({ setJobCount }) => {
	const { user } = useContext(AuthContext);
	const [jobs, setJobs] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editData, setEditData] = useState(null);
	const [filter, setFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [viewMode, setViewMode] = useState("list");

	const getJobsDueToday = () => {
		const today = new Date();
		return jobs.filter((job) => {
			if (!job.followUpDate) return false;
			const followUp = new Date(job.followUpDate);
			const isToday =
				followUp.getFullYear() === today.getFullYear() &&
				followUp.getMonth() === today.getMonth() &&
				followUp.getDate() === today.getDate();

			return isToday && job.status !== "Rejected";
		});
	};

	const jobsDueToday = getJobsDueToday();

	const fetchJobs = useCallback(async () => {
		try {
			const res = await axios.get("/jobs");
			setJobs(res.data);
			if (setJobCount) setJobCount(res.data.length);
		} catch (err) {
			console.error(err);
		}
	}, [setJobCount]);

	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	const exportToCSV = () => {
		if (jobs.length === 0)
			return alert("No applications data available to export.");
		try {
			const headers = [
				"Company",
				"Role",
				"Status",
				"Priority",
				"Applied Date",
				"Follow-Up Date",
				"Notes",
				"Job Link",
			];
			const rows = jobs.map((job) => [
				`"${(job.company || "").replace(/"/g, '""')}"`,
				`"${(job.role || "").replace(/"/g, '""')}"`,
				`"${(job.status || "").replace(/"/g, '""')}"`,
				`"${(job.priority || "Medium").replace(/"/g, '""')}"`,
				`"${job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : "N/A"}"`,
				`"${job.followUpDate ? new Date(job.followUpDate).toLocaleDateString() : "N/A"}"`,
				`"${(job.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
				`"${(job.jobLink || "").replace(/"/g, '""')}"`,
			]);
			const csvContent = [
				headers.join(","),
				...rows.map((e) => e.join(",")),
			].join("\n");
			const blob = new Blob(["\uFEFF" + csvContent], {
				type: "text/csv;charset=utf-8;",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`JobTrackr_Applications_${user?.name || "Report"}.csv`,
			);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error generating CSV report:", err);
		}
	};

	const exportToPDF = () => {
		if (jobs.length === 0)
			return alert("No applications data available to export.");
		const doc = new jsPDF();
		doc.setFont("helvetica", "bold");
		doc.setFontSize(20);
		doc.setTextColor(79, 70, 229);
		doc.text("JobTrackr Applications Report", 14, 20);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.setTextColor(100, 100, 100);
		doc.text(
			`Generated for: ${user?.name || "User"} | Total Applications: ${jobs.length} | Date: ${new Date().toLocaleDateString()}`,
			14,
			28,
		);

		const tableRows = jobs.map((job) => [
			job.company,
			job.role,
			job.status,
			job.priority || "Medium",
			job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : "N/A",
			job.followUpDate
				? new Date(job.followUpDate).toLocaleDateString()
				: "N/A",
		]);

		autoTable(doc, {
			startY: 35,
			head: [
				[
					"Company",
					"Role",
					"Status",
					"Priority",
					"Applied Date",
					"Follow-Up Date",
				],
			],
			body: tableRows,
			headStyles: { fillColor: [79, 70, 229], fontStyle: "bold" },
			alternateRowStyles: { fillColor: [248, 249, 250] },
			margin: { top: 35 },
			theme: "striped",
		});
		doc.save(`JobTrackr_Applications_${user?.name || "Report"}.pdf`);
	};

	const handleSubmit = async (form) => {
		try {
			if (editData) {
				await axios.put(`/jobs/${editData._id}`, form);
			} else {
				await axios.post("/jobs", form);
			}
			setShowForm(false);
			setEditData(null);
			fetchJobs();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this application?")) return;
		try {
			await axios.delete(`/jobs/${id}`);
			fetchJobs();
		} catch (err) {
			console.error(err);
		}
	};

	const handleEdit = (job) => {
		setEditData(job);
		setShowForm(true);
	};

	const handleDragEnd = async (result) => {
		const { destination, source, draggableId } = result;
		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		const updatedStatus = destination.droppableId;
		const updatedJobs = jobs.map((job) => {
			if (job._id === draggableId) {
				return { ...job, status: updatedStatus };
			}
			return job;
		});
		setJobs(updatedJobs);

		try {
			await axios.put(`/jobs/${draggableId}`, { status: updatedStatus });
		} catch (err) {
			console.error("Failed to update status on server:", err);
			fetchJobs();
		}
	};

	const filtered = jobs.filter((j) => {
		const matchStatus = filter === "All" || j.status === filter;
		const matchSearch =
			j.company.toLowerCase().includes(search.toLowerCase()) ||
			j.role.toLowerCase().includes(search.toLowerCase());
		return matchStatus && matchSearch;
	});

	const statData = [
		{ label: "Applied", color: "blue" },
		{ label: "Interview", color: "yellow" },
		{ label: "Offer", color: "green" },
		{ label: "Rejected", color: "red" },
	];

	const kanbanColumns = ["Applied", "Interview", "Offer", "Rejected"];

	return (
		<div className="page-wrapper">
			<div className="dashboard-header">
				<div>
					<h3 style={{ color: "#ffff" }}>Hey, {user?.name || "there"}!</h3>
					<p style={{ color: "white" }}>
						{jobs.length === 0
							? "Kindly start adding your job applications below."
							: `You have ${jobs.length} application${jobs.length > 1 ? "s" : ""} tracked.`}
					</p>
				</div>
				<div className="d-flex gap-2 align-items-center flex-wrap">
					<div className="view-switcher-pill">
						<button
							className={`btn btn-toggle ${viewMode === "list" ? "active" : ""}`}
							onClick={() => setViewMode("list")}
							style={{
								fontSize: "1rem",
								fontFamily: "Arial",
							}}>
							List
						</button>
						<button
							className={`btn btn-toggle ${viewMode === "kanban" ? "active" : ""}`}
							onClick={() => setViewMode("kanban")}
							style={{
								fontSize: "1rem",
								fontFamily: "Arial",
							}}>
							Kanban
						</button>
					</div>

					<Dropdown>
						<Dropdown.Toggle
							variant="light"
							id="dropdown-export"
							className="btn-export">
							Export
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item
								onClick={exportToCSV}
								style={{ fontSize: "1.5rem" }}>
								Save as Spreadsheet (.CSV)
							</Dropdown.Item>
							<Dropdown.Item
								onClick={exportToPDF}
								style={{ fontSize: "1.5rem" }}>
								Print Report (.PDF)
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>

					<button
						className="btn btn-add"
						onClick={() => {
							setEditData(null);
							setShowForm(true);
						}}>
						+ Add Application
					</button>
				</div>
			</div>

			{jobsDueToday.length > 0 && (
				<div className="action-required-alert mb-4 shadow-sm">
					<div className="d-flex align-items-center mb-2">
						<h4
							className="mb-0 alert-heading"
							style={{ fontFamily: "Times New Roman" }}>
							Action Required: You have {jobsDueToday.length} follow-up
							{jobsDueToday.length > 1 ? "s" : ""} scheduled for today!
						</h4>
					</div>
					<p
						className="alert-subtext mb-3"
						style={{ fontWeight: "bold", fontSize: "1rem" }}>
						Reach out to recruiters, verify application portals, or update
						interview schedules.
					</p>
					<div className="row g-2">
						{jobsDueToday.map((job) => (
							<div key={job._id} className="col-12 col-md-6 col-lg-4">
								<div className="due-job-badge-card d-flex justify-content-between align-items-center">
									<div>
										{job.jobLink ? (
											<a
												href={job.jobLink}
												target="_blank"
												rel="noopener noreferrer"
												className="due-card-link-title"
												style={{ fontSize: "1.3rem" }}>
												{job.company}
											</a>
										) : (
											<div
												className="due-card-static-title"
												style={{
													fontSize: "1.3rem",
													fontWeight: "bold",
													fontFamily: "Times New Roman",
													color: "black",
												}}>
												{job.company}
											</div>
										)}
										<div
											className="due-card-subtitle"
											style={{
												fontSize: "1rem",
												fontWeight: "normal",
												fontFamily: "Times New Roman",
												color: "black",
											}}>
											{job.role}
										</div>
									</div>
									<span
										className="badge status-pill-indicator"
										style={{
											fontSize: "1rem",
											fontWeight: "normal",
											fontFamily: "Times New Roman",
											color: "black",
										}}>
										{job.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<Row className="mb-4 g-3">
				{statData.map((s) => (
					<Col key={s.label} xs={6} md={3}>
						<div className={`stat-card border-card-${s.color}`}>
							<div className="stat-info align-center">
								<h3 style={{ fontSize: "2rem" }}>
									{jobs.filter((j) => j.status === s.label).length}
								</h3>
								<p style={{ fontWeight: "bold" }}>{s.label}</p>
							</div>
						</div>
					</Col>
				))}
			</Row>

			{jobs.length > 0 ? (
				viewMode === "list" ? (
					<Row className="g-4">
						<Col lg={4} md={12}>
							<div className="chart-card shadow-sm">
								<p
									className="section-title"
									style={{ fontFamily: "Times New Roman", fontSize: "2rem" }}>
									Breakdown Matrix
								</p>
								<StatsChart jobs={jobs} />
								<div className="mt-3">
									{jobs.filter(
										(j) =>
											j.followUpDate &&
											new Date(j.followUpDate) < new Date() &&
											j.status !== "Offer" &&
											j.status !== "Rejected",
									).length > 0 && (
										<div
											className="overdue-warning-pill"
											style={{
												fontSize: "1.3rem",
												color: "#6c757d",
												fontWeight: "bold",
											}}>
											{
												jobs.filter(
													(j) =>
														j.followUpDate &&
														new Date(j.followUpDate) < new Date() &&
														j.status !== "Offer" &&
														j.status !== "Rejected",
												).length
											}
											&ensp;follow-up(s) overdue
										</div>
									)}
								</div>
							</div>
						</Col>
						<Col lg={8} md={12}>
							<div className="filter-bar-row mb-3">
								<div className="filter-pills-container">
									{["All", "Applied", "Interview", "Offer", "Rejected"].map(
										(s) => (
											<button
												key={s}
												className={`btn filter-pill ${filter === s ? "active" : ""}`}
												onClick={() => setFilter(s)}
												style={{ fontSize: "1rem" }}>
												{s}{" "}
												{s !== "All" &&
													`(${jobs.filter((j) => j.status === s).length})`}
											</button>
										),
									)}
								</div>
							</div>
							<Form.Control
								className="search-input mb-3 shadow-sm"
								placeholder="Search by company or role...."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								style={{ fontSize: "1rem" }}
							/>
							{filtered.length === 0 ? (
								<div
									className="empty-state shadow-sm"
									style={{ border: "1px solid #94a3b8" }}>
									<h4>No matching configurations</h4>
									<p>Try resetting filters or clear search data input values</p>
								</div>
							) : (
								filtered.map((job) => (
									<JobCard
										key={job._id}
										job={job}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								))
							)}
						</Col>
					</Row>
				) : (
					<DragDropContext onDragEnd={handleDragEnd}>
						<Row className="kanban-container g-3 match-height">
							{kanbanColumns.map((colName) => {
								const columnJobs = jobs.filter(
									(j) => j.status.toLowerCase() === colName.toLowerCase(),
								);
								return (
									<Col key={colName} xs={12} md={3}>
										<div
											className={`kanban-column-wrapper column-${colName.toLowerCase()} shadow-sm`}>
											<div className="kanban-column-header d-flex justify-content-between align-items-center mb-2 px-2 pt-2">
												<span className="fw-bold column-header-text">
													{colName}
												</span>
												<span className="badge column-counter-pill">
													{columnJobs.length}
												</span>
											</div>

											<Droppable droppableId={colName}>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.droppableProps}
														className={`kanban-droppable-area ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
														style={{
															minHeight: "550px",
															transition: "all 0.2s ease",
														}}>
														{columnJobs.map((job, index) => (
															<Draggable
																key={job._id}
																draggableId={job._id}
																index={index}>
																{(provided, snapshot) => (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		className={`kanban-card-drag-wrapper mb-2 ${snapshot.isDragging ? "is-dragging" : ""}`}>
																		<JobCard
																			job={job}
																			onEdit={handleEdit}
																			onDelete={handleDelete}
																		/>
																	</div>
																)}
															</Draggable>
														))}
														{provided.placeholder}
													</div>
												)}
											</Droppable>
										</div>
									</Col>
								);
							})}
						</Row>
					</DragDropContext>
				)
			) : (
				<div className="empty-state shadow-sm">
					<div className="empty-icon">📋</div>
					<h5>No applications yet</h5>
					<p>
						Click "+ Add Application" to start tracking your placements
						dashboard
					</p>
					<button
						className="btn btn-add mt-2"
						onClick={() => setShowForm(true)}>
						+ Add your first application
					</button>
				</div>
			)}

			<JobForm
				show={showForm}
				onHide={() => {
					setShowForm(false);
					setEditData(null);
				}}
				onSubmit={handleSubmit}
				editData={editData}
			/>
		</div>
	);
};

export default Home;
