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
						}}>
						JobTracker
					</h1>
				</BsNavbar.Brand>

				<BsNavbar.Collapse
					id="responsive-navbar-nav"
					className="justify-content-end order-lg-1">
					{user ? (
						<Nav className="align-items-center gap-3 mt-3 mt-lg-0">
							{jobCount > 0 && (
								<span
									className="stat-pill text-black text-bold"
									style={{ fontSize: "1rem" }}>
									<strong style={{ fontSize: "1.5rem" }}>{jobCount}</strong>
									&ensp;application(s)
								</span>
							)}
							<span className="user-greeting">Hi, {user.name}!</span>
							<button
								className="btn btn-logout text-white"
								onClick={handleLogout}>
								Sign out
							</button>
						</Nav>
					) : (
						<Nav className="gap-1 mt-2 mt-lg-0 text-white">
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
