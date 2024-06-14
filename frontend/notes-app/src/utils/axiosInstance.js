import axios from "axios";
import { BASE_URL } from "./constant";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // corrected from baseurl to baseURL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Correcting the typo in 'interception' to 'interceptors'
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
