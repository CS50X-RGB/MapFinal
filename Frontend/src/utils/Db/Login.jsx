import axios from "axios";
import { baseUrl } from "./Resgister";

const LoginAxios = async (email, password) => {
  try {
    const response = await axios.post(
      `${baseUrl}/users/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        validateStatus: () => true, // ✅ prevents axios from throwing on non-2xx
      }
    );

    if (response.status === 200) {
      console.log(response.data, "Token");
      localStorage.setItem("Map_0_Share", response.data.token);
      return response.data;
    } else {
      console.warn("Login failed:", response.data.message || "Unexpected error");
      return null; // or return false or response.data.message based on use case
    }
  } catch (err) {
    console.error("Network error:", err.message);
    return null;
  }
};

export default LoginAxios;
