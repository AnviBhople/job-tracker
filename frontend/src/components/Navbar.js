import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar as BsNavbar, Nav, Container } from "react-bootstrap";

const Navbar = ({ jobCount }) => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	// 1. Unified state setup reading safely from localStorage on init
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return localStorage.getItem("theme") === "dark";
	});

	// 2. Automatically sync the HTML node data tag whenever state alters
	useEffect(() => {
		const rootWrapper = document.querySelector(".page-wrapper");
		if (rootWrapper) {
			rootWrapper.setAttribute("data-theme", isDarkMode ? "dark" : "light");
		}
		// Also apply it directly to the body element as a failsafe
		document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
	}, [isDarkMode]);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => {
			const nextMode = !prev;
			localStorage.setItem("theme", nextMode ? "dark" : "light");
			return nextMode;
		});
	};

	return (
		<BsNavbar
			className="jt-navbar"
			expand="lg"
			data-theme={isDarkMode ? "dark" : "light"}>
			<Container>
				<BsNavbar.Brand as={Link} to="/">
					💼 JobTrackr
				</BsNavbar.Brand>

				<div className="d-flex align-items-center gap-2 order-lg-2">
					{/* Dark Mode button positioned securely right beside collapse links */}
					<button
						className="btn btn-theme-toggle px-3 py-1.5"
						onClick={toggleDarkMode}
						title="Toggle Theme"
						type="button">
						{isDarkMode ? "☀️ Light" : "🌙 Dark"}
					</button>
					<BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
				</div>

				<BsNavbar.Collapse
					id="responsive-navbar-nav"
					className="justify-content-end order-lg-1">
					{user ? (
						<Nav className="align-items-center gap-3 mt-3 mt-lg-0">
							{jobCount > 0 && (
								<span className="stat-pill">
									{jobCount} <span>applications</span>
								</span>
							)}
							<span className="user-greeting">Hi, {user.name}</span>
							<button className="btn btn-logout" onClick={handleLogout}>
								Sign out
							</button>
						</Nav>
					) : (
						<Nav className="gap-1 mt-2 mt-lg-0">
							<Nav.Link as={Link} to="/login">
								Login
							</Nav.Link>
							<Nav.Link as={Link} to="/register">
								Register
							</Nav.Link>
						</Nav>
					)}
				</BsNavbar.Collapse>
			</Container>
		</BsNavbar>
	);
};

export default Navbar;
