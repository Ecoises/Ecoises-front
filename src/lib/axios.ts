import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default api;
