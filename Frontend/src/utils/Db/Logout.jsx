import axios from "axios";

export const handleLogout = async () => {
  try {
    const response = await axios.get("http://localhost:3005/api/v1/users/logout", {
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
