import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar as BsNavbar, Nav, Container } from "react-bootstrap";

const Navbar = ({ jobCount }) => {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<BsNavbar className="jt-navbar text-white" expand="lg">
			<Container>
				<BsNavbar.Brand as={Link} to="/">
					<h1
						style={{
							fontFamily: "ui-monospace",
							fontWeight: "bold",
							color: "white",
							fontSize: "2rem",
							margin: 0,
						}}>
						JobTracker
					</h1>
				</BsNavbar.Brand>

				<BsNavbar.Toggle
					aria-controls="responsive-navbar-nav"
					style={{ borderColor: "rgba(255,255,255,0.3)" }}>
					<span style={{ color: "white", fontSize: "1.2rem" }}>☰</span>
				</BsNavbar.Toggle>

				<BsNavbar.Collapse
					id="responsive-navbar-nav"
					className="justify-content-end">
					{user ? (
						<Nav className="align-items-lg-center gap-2 py-2 py-lg-0">
							{jobCount > 0 && (
								<span
									className="stat-pill text-black"
									style={{ fontSize: "0.9rem" }}>
									<strong style={{ fontSize: "1rem" }}>{jobCount}</strong>
									&ensp;application(s)
								</span>
							)}
							<span className="user-greeting d-block py-1">
								Hi, {user.name}!
							</span>
							<button
								className="btn btn-logout text-white mt-1 mt-lg-0"
								onClick={handleLogout}>
								Sign out
							</button>
						</Nav>
					) : (
						<Nav className="d-flex gap-4 py-2 py-lg-0">
							<Nav.Link as={Link} to="/login" className="text-white">
								Login
							</Nav.Link>
							<Nav.Link as={Link} to="/register" className="text-white">
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
