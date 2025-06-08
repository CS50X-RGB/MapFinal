import axios from "axios";
import { baseUrl, localUrl } from "./Resgister";

const LoginAxios = async (email, password) => {
  try {
    const response = await axios.post(
      `${baseUrl}/users/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(response.data,"Token");
    localStorage.setItem("Map_0_Share", response.data.token);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export default LoginAxios;
