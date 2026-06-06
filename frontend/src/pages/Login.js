import React, { useState, useContext } from "react";
import { Form, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
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
			const res = await axios.post("/auth/login", form);
			login(res.data.user, res.data.token);
			navigate("/");
		} catch (err) {
			setError(err.response?.data?.msg || "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-wrapper px-3">
			<div className="auth-card w-100" style={{ maxWidth: "420px" }}>
				<h2 className="fs-3">Welcome back</h2>
				<p className="auth-sub">Sign in to your JobTracker account</p>
				{error && (
					<Alert
						variant="danger"
						style={{ fontSize: "0.875rem", borderRadius: "8px" }}>
						{error}
					</Alert>
				)}
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label style={{ fontSize: "1rem" }}>Email</Form.Label>
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
						<Form.Label style={{ fontSize: "1rem" }}>Password</Form.Label>
						<Form.Control
							name="password"
							type="password"
							placeholder="Your password"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</Form.Group>
					<button
						type="submit"
						className="btn btn-auth w-100"
						disabled={loading}>
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</Form>
				<p className="auth-footer">
					No account? <Link to="/register">Create one free</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
