import axios from "axios";

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
        "https://maposhare.onrender.com/api/v1/users/register",
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
    localStorage.setItem("Map_0_Share",response.data.token);
    return response;
  } catch (error) {
    return error.message;
  }
};

export default RegisterAxios;
