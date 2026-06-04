import React, { useState, useContext } from "react";
import { Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await axios.post("/auth/register", form);
			login(res.data.user, res.data.token);
			navigate("/");
		} catch (err) {
			setError(err.response?.data?.msg || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-wrapper">
			<div className="auth-card">
				<h4>Create your account</h4>
				<p className="auth-sub">Start tracking your job applications today</p>
				{error && (
					<Alert
						variant="danger"
						style={{ fontSize: "0.875rem", borderRadius: "8px" }}>
						{error}
					</Alert>
				)}
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Full name</Form.Label>
						<Form.Control
							name="name"
							placeholder="Your name"
							value={form.name}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							name="email"
							type="email"
							placeholder="you@email.com"
							value={form.email}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-4">
						<Form.Label>Password</Form.Label>
						<Form.Control
							name="password"
							type="password"
							placeholder="Min 6 characters"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<button
						type="submit"
						className="btn btn-auth w-100"
						disabled={loading}>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</Form>
				<p className="auth-footer">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
