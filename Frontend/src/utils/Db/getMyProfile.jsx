import axios from "axios";
import { localUrl } from "./Resgister";

const ProfileAxios = async () => {
  console.log("Profile check....");
  try {
    const response = await axios.get(
      `${localUrl}/users/getMyProfile`,
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
