import axios from "axios";

export const baseUrl = "https://maposhare.onrender.com/api/v1";
export const localUrl = "http://localhost:3005/api/v1";


const RegisterAxios = async (
  image,
  name,
  email,
  password,
  dlNo,
  userType,
  phoneno
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/users/register`,
      {
        name,
        email,
        password,
        dLNo: dlNo,
        userType: userType,
        profilePic: image,
        phoneno,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    localStorage.setItem("Map_0_Share", response.data.token);
    return response;
  } catch (error) {
    console.log(error);
    if (error.response.data) {
      console.log(error.response.data);
      return error.response.data
    }
    return error.message;
  }
};

export default RegisterAxios;
