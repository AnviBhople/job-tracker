import axios from "axios";

const instance = axios.create({
	baseURL: "https://job-tracker-0rs6.onrender.com/api",
});

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) config.headers["x-auth-token"] = token;
	return config;
});

export default instance;
