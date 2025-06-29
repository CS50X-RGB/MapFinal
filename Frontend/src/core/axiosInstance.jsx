import axios from "axios";

export const baseUrl = "https://mapfinal.onrender.com/api/v1/";
export const localUrl = "http://localhost:3005/api/v1"

const instance = axios.create({
baseURL : baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
//    IDENTIFIER: "A2hG9tE4rB6kY1sN",
//    "ngrok-skip-browser-warning": "123",
    // "IDENTIFIER": "A2hG9tE4rB6kY1sN"
    // You can add more default headers here if needed
  },
});


/* Add an interceptor to set the Authorization header before each request */

instance.interceptors.request.use(
  (config) => {
    // const currentUser = localStorage.getItem("currentUserToken");
    // const token = currentUser;
    const token = localStorage.getItem("Map_0_Share");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default instance;
