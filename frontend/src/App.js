import React, { useContext, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./index.css";

const PrivateRoute = ({ children }) => {
	const { token } = useContext(AuthContext);
	return token ? children : <Navigate to="/login" />;
};

function App() {
	const [jobCount, setJobCount] = useState(0);

	return (
		<AuthProvider>
			<Router>
				<Navbar jobCount={jobCount} />
				<div>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route
							path="/"
							element={
								<PrivateRoute>
									<Home setJobCount={setJobCount} />
								</PrivateRoute>
							}
						/>
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
