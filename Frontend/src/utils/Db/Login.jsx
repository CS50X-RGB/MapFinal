import axios from "axios";

const LoginAxios = async (email, password) => {
  try {
    const response = await axios.post(
      `https://maposhare.onrender.com/api/v1/users/login`,
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
    console.log(response.data.token);
    localStorage.setItem("Map_0_Share",response.data.token);
    return response;
  } catch (err) {
    return err.message;
  }
};

export  default  LoginAxios;
