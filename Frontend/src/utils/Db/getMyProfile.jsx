import { getData } from "../../core/apiHandler";
import { authRoutes } from "../../core/apiRoutes";


const ProfileAxios = async () => {
  try {
    const response  = await getData(authRoutes.myprofile,{},{});
    return response;
  } catch (err) {
    console.error(err);
  }
};

export default ProfileAxios;
