import axios from "axios";

const ProfileAxios = async () => {
  console.log("Profile check....");
  try {
    const response = await axios.get(
      "http://localhost:3005/api/v1/users/getMyProfile",
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (err) {
    console.error(err);
  }
};

export default ProfileAxios;
