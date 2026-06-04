// import React, { useState, useEffect } from "react";
// import { Modal, Form, Row, Col } from "react-bootstrap";

// const JobForm = ({ show, onHide, onSubmit, editData }) => {
// 	const [form, setForm] = useState({
// 		company: "",
// 		role: "",
// 		status: "Applied",
// 		priority: "Medium",
// 		appliedDate: "",
// 		followUpDate: "",
// 		notes: "",
// 		jobLink: "",
// 	});

// 	useEffect(() => {
// 		if (editData) {
// 			setForm({
// 				company: editData.company || "",
// 				role: editData.role || "",
// 				status: editData.status || "Applied",
// 				priority: editData.priority || "Medium",
// 				appliedDate: editData.appliedDate
// 					? editData.appliedDate.slice(0, 10)
// 					: "",
// 				followUpDate: editData.followUpDate
// 					? editData.followUpDate.slice(0, 10)
// 					: "",
// 				notes: editData.notes || "",
// 				jobLink: editData.jobLink || "",
// 			});
// 		} else {
// 			setForm({
// 				company: "",
// 				role: "",
// 				status: "Applied",
// 				priority: "Medium",
// 				appliedDate: "",
// 				followUpDate: "",
// 				notes: "",
// 				jobLink: "",
// 			});
// 		}
// 	}, [editData, show]);

// 	const handleChange = (e) =>
// 		setForm({ ...form, [e.target.name]: e.target.value });
// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		onSubmit(form);
// 	};

// 	return (
// 		<Modal show={show} onHide={onHide} size="lg" centered>
// 			<Modal.Header closeButton>
// 				<Modal.Title>
// 					{editData ? "Edit Application" : "Add New Application"}
// 				</Modal.Title>
// 			</Modal.Header>
// 			<Modal.Body>
// 				<Form onSubmit={handleSubmit}>
// 					<Row>
// 						<Col md={6}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Company *</Form.Label>
// 								<Form.Control
// 									name="company"
// 									value={form.company}
// 									onChange={handleChange}
// 									placeholder="e.g. Google"
// 									required
// 								/>
// 							</Form.Group>
// 						</Col>
// 						<Col md={6}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Role *</Form.Label>
// 								<Form.Control
// 									name="role"
// 									value={form.role}
// 									onChange={handleChange}
// 									placeholder="e.g. Software Engineer Intern"
// 									required
// 								/>
// 							</Form.Group>
// 						</Col>
// 					</Row>
// 					<Row>
// 						<Col md={4}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Status</Form.Label>
// 								<Form.Select
// 									name="status"
// 									value={form.status}
// 									onChange={handleChange}>
// 									<option>Applied</option>
// 									<option>Interview</option>
// 									<option>Offer</option>
// 									<option>Rejected</option>
// 								</Form.Select>
// 							</Form.Group>
// 						</Col>
// 						<Col md={4}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Priority</Form.Label>
// 								<Form.Select
// 									name="priority"
// 									value={form.priority}
// 									onChange={handleChange}>
// 									<option>High</option>
// 									<option>Medium</option>
// 									<option>Low</option>
// 								</Form.Select>
// 							</Form.Group>
// 						</Col>
// 						<Col md={4}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Applied Date</Form.Label>
// 								<Form.Control
// 									name="appliedDate"
// 									type="date"
// 									value={form.appliedDate}
// 									onChange={handleChange}
// 								/>
// 							</Form.Group>
// 						</Col>
// 					</Row>
// 					<Row>
// 						<Col md={6}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Follow-up Date</Form.Label>
// 								<Form.Control
// 									name="followUpDate"
// 									type="date"
// 									value={form.followUpDate}
// 									onChange={handleChange}
// 								/>
// 							</Form.Group>
// 						</Col>
// 						<Col md={6}>
// 							<Form.Group className="mb-3">
// 								<Form.Label>Job Link</Form.Label>
// 								<Form.Control
// 									name="jobLink"
// 									value={form.jobLink}
// 									onChange={handleChange}
// 									placeholder="https://..."
// 								/>
// 							</Form.Group>
// 						</Col>
// 					</Row>
// 					<Form.Group className="mb-3">
// 						<Form.Label>Notes</Form.Label>
// 						<Form.Control
// 							name="notes"
// 							as="textarea"
// 							rows={3}
// 							value={form.notes}
// 							onChange={handleChange}
// 							placeholder="Interview round details, HR contact, salary info, etc."
// 						/>
// 					</Form.Group>
// 					<div className="d-flex justify-content-end gap-2 mt-2">
// 						<button
// 							type="button"
// 							className="btn btn-modal-cancel"
// 							onClick={onHide}>
// 							Cancel
// 						</button>
// 						<button type="submit" className="btn btn-modal-save">
// 							{editData ? "Save changes" : "Add application"}
// 						</button>
// 					</div>
// 				</Form>
// 			</Modal.Body>
// 		</Modal>
// 	);
// };

// export default JobForm;
import React, { useState, useEffect } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";

const JobForm = ({ show, onHide, onSubmit, editData }) => {
	const [form, setForm] = useState({
		company: "",
		role: "",
		status: "Applied",
		priority: "Medium",
		appliedDate: "",
		followUpDate: "",
		notes: "",
		jobLink: "",
		interviewNotes: "", // Tracked structured input state
	});

	useEffect(() => {
		if (editData) {
			setForm({
				company: editData.company || "",
				role: editData.role || "",
				status: editData.status || "Applied",
				priority: editData.priority || "Medium",
				appliedDate: editData.appliedDate
					? editData.appliedDate.slice(0, 10)
					: "",
				followUpDate: editData.followUpDate
					? editData.followUpDate.slice(0, 10)
					: "",
				notes: editData.notes || "",
				jobLink: editData.jobLink || "",
				interviewNotes: editData.interviewNotes || "",
			});
		} else {
			setForm({
				company: "",
				role: "",
				status: "Applied",
				priority: "Medium",
				appliedDate: "",
				followUpDate: "",
				notes: "",
				jobLink: "",
				interviewNotes: "",
			});
		}
	}, [editData, show]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm({
			...form,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton>
				<Modal.Title>
					{editData ? "Edit Application" : "Add New Application"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Company *</Form.Label>
								<Form.Control
									name="company"
									value={form.company}
									onChange={handleChange}
									placeholder="e.g. Google"
									required
								/>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Role *</Form.Label>
								<Form.Control
									name="role"
									value={form.role}
									onChange={handleChange}
									placeholder="e.g. Software Engineer Intern"
									required
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label>Status</Form.Label>
								<Form.Select
									name="status"
									value={form.status}
									onChange={handleChange}>
									<option>Applied</option>
									<option>Interview</option>
									<option>Offer</option>
									<option>Rejected</option>
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label>Priority</Form.Label>
								<Form.Select
									name="priority"
									value={form.priority}
									onChange={handleChange}>
									<option>High</option>
									<option>Medium</option>
									<option>Low</option>
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label>Applied Date</Form.Label>
								<Form.Control
									name="appliedDate"
									type="date"
									value={form.appliedDate}
									onChange={handleChange}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Follow-up Date</Form.Label>
								<Form.Control
									name="followUpDate"
									type="date"
									value={form.followUpDate}
									onChange={handleChange}
								/>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Job Link</Form.Label>
								<Form.Control
									name="jobLink"
									value={form.jobLink}
									onChange={handleChange}
									placeholder="https://..."
								/>
							</Form.Group>
						</Col>
					</Row>
					<Form.Group className="mb-3">
						<Form.Label>General Notes</Form.Label>
						<Form.Control
							name="notes"
							as="textarea"
							rows={2}
							value={form.notes}
							onChange={handleChange}
							placeholder="HR contact, submission configurations, salary benchmarks, etc."
						/>
					</Form.Group>

					{/* Displays interview preparation logs unconditionally or during the interview stage */}
					<Form.Group className="mb-3">
						<Form.Label style={{ fontWeight: "600", color: "#4f46e5" }}>
							Interview Preparation & Panel Notes
						</Form.Label>
						<Form.Control
							name="interviewNotes"
							as="textarea"
							rows={3}
							value={form.interviewNotes}
							onChange={handleChange}
							placeholder="Log technical questions asked, behavioral pointers, interview times, or presentation details here..."
							style={{ borderLeft: "4px solid #4f46e5" }}
						/>
					</Form.Group>

					<div className="d-flex justify-content-end gap-2 mt-2">
						<button
							type="button"
							className="btn btn-modal-cancel"
							onClick={onHide}>
							Cancel
						</button>
						<button type="submit" className="btn btn-modal-save">
							{editData ? "Save changes" : "Add application"}
						</button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default JobForm;
