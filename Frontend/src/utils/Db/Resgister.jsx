import axios from "axios";

export const baseUrl = "https://maposhare.onrender.com/api/v1/";
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
      `${localUrl}/users/register`,
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
    console.log(response.data.token);
    localStorage.setItem("Map_0_Share", response.data.token);
    return response;
  } catch (error) {
    return error.message;
  }
};

export default RegisterAxios;
