import axios from "axios";
import { baseUrl } from "./Resgister";

export const handleLogout = async () => {
  try {
    const response = await axios.get(`${baseUrl}/users/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    localStorage.removeItem("Map-0-Share");
    return response;
  } catch (err) {
    console.error(err);
  }
};

export default handleLogout;
