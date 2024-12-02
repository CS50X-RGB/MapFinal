import { useEffect, useState } from "react";
import Logo from "../logo.svg";
import { IoMdAdd } from "react-icons/io";
import ProfileAxios from "../utils/Db/getMyProfile";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import GlbobalNavBar from "../components/globalNavBar";
import { Image,Input,Button } from "@nextui-org/react";
import { putData } from "../core/apiHandler";

function Profile() {
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [edit, setEdit] = useState(false);
  const [editLic, setEditLic] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [imageUpdated, setImageUpdated] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await ProfileAxios();
        setUser(res.data.user);
        setImage(res.data.user.profilePic);
        setOriginalImage(res.data.user.profilePic);
        setName(res.data.user.name);
        setLicense(res.data.user.dLNo);
        setPhone(res.data.user.phoneno);
        setEmail(res.data.user.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUsers();
  }, []);

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImage(reader.result);
        setImageUpdated(true);
      };

      reader.onerror = (error) => {
        console.error(error);
      };
    }
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  const handleEditEmailToggle = (e) => {
    e.preventDefault();
    setEditEmail(!editEmail);
  };

  const handleEditPhoneToggle = (e) => {
    e.preventDefault();
    setEditPhone(!editPhone);
  };

  const handleEditLicToggle = (e) => {
    e.preventDefault();
    setEditLic(!editLic);
  };

  const handleUpdateDetails = async () => {
    try {
      const body = {
          name: edit ? name : undefined,
          email: editEmail ? email : undefined,
          phone: editPhone ? phone : undefined,
          profilePic: imageUpdated ? image : undefined,
          dLNo: editLic ? license : undefined,
      }
      const res = await putData("/users/resetDetails",{},body);  
      if (res.data.success) {
        console.log("User details updated successfully!");
        setOriginalImage(res.data.user.profilePic);
        setImageUpdated(false);
        window.location.reload();
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <>
      <nav className="bg-back p-4">
        <Link to={"/"} className="flex flex-col">
          <img src={Logo} alt="Logo" className="rounded-full w-20 h-20 mt-4" />
          <h1 className="text-text shadow-2xl shadow-text font-mono text-xl font-extrabold">
            MAP-0-SHARE
          </h1>
        </Link>
        <div className="relative">
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={convertToBase64}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer block h-[20vh] w-[20vh] rounded-full overflow-hidden relative border-2 border-text mx-auto mb-4"
          >
            {image ? (
              <>
                <Image
                  src={user.profilePic}
                  alt="ProfileImage"
                  sizes=""
                  className="w-full h-full object-cover"
                />
                <IoMdAdd
                  size={40}
                  className="fill-text z-30 absolute -right-5 bottom-1"
                />
              </>
            ) : (
              <IoMdAdd
                size={20}
                className="fill-text z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </label>
        </div>
        <span className="text-2xl text-text flex justify-center font-mono">
          {user.userType}
        </span>
      </nav>
      <div className="flex justify-center items-center bg-text">
        <div className="bg-opacity-70 rounded-md shadow-2xl shadow-back">
          <form className="bg-back font-mono text-text p-[0.1rem] md:p-[3rem] rounded-xl">
            <div className="mb-4 flex flex-row justify-around gap-2 md:gap-4 ">
              <label htmlFor="name" className="block mb-2 text-text text-md md:text-2xl">
                Name
              </label>
              {edit ? (
                <>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full flex flex-row justify-center items-center gap-4 rounded border border-text p-2 text-xl text-back bg-text"
                  />  
                  <Button
                    isIconOnly
                    onClick={handleEditToggle}
                    className="bg-inherit fill-blue-500 hover:bg-back hover:fill-black"
                    type="button"
                  >
                    <FaPencilAlt size={34} />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-md font-ostwald md:text-2xl">{user.name}</span>
                  <button
                    onClick={handleEditToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]" />
                  </button>
                </>
              )}
            </div>
            <div className="mb-4 flex flex-row justify-around gap-4 ">
              <label htmlFor="name" className="block mb-2 text-text text-lg md:text-2xl">
                Dl No
              </label>
              {editLic ? (
                <>
                  <input
                    type="text"
                    id="license"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full rounded border border-text p-2 text-xl text-back bg-text"
                  />
                  <button
                    onClick={handleEditLicToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-lg md:text-2xl">{user.dLNo}</span>
                  <button
                    onClick={handleEditLicToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]" />
                  </button>
                </>
              )}
            </div>
            <div className="mb-4 flex flex-row justify-around gap-1 md:gap-4 ">
              <label htmlFor="name" className="block mb-2 text-text text-lg md:text-2xl">
                PhoneNo
              </label>
              {editPhone ? (
                <>
                  <input
                    type="text"
                    id="license"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded border border-text p-2 text-xl text-back bg-text"
                  />
                  <button
                    onClick={handleEditPhoneToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-lg md:text-2xl">{user.phoneno}</span>
                  <button
                    onClick={handleEditPhoneToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]"/>
                  </button>
                </>
              )}
            </div>
            <div className="mb-4 flex flex-row justify-around gap-1 md:gap-4 ">
              <label htmlFor="name" className="block mb-2 text-text text-lg md:text-2xl">
                Email
              </label>
              {editEmail ? (
                <>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-text p-2 text-lg md:text-xl text-back bg-text"
                  />
                  <button
                    onClick={handleEditEmailToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-md md:text-2xl">{user.email}</span>
                  <button
                    onClick={handleEditEmailToggle}
                    className="fill-text"
                    type="button"
                  >
                    <FaPencilAlt className="w-[4rem]" />
                  </button>
                </>
              )}
            </div>
            <Link
              to={"/forgot-password"}
              className="text-xl text-text flex justify-center items-center hover:bg-text hover:text-back px-3"
            >
              Reset Password
            </Link>
            {(edit || editLic || editPhone || editEmail || imageUpdated) && (
              <button
                type="button"
                className="bg-text text-back flex px-6 py-3 justify-center items-center rounded-2xl shadow-2xl shadow-text mx-auto"
                onClick={handleUpdateDetails}
              >
                Update Details
              </button>
            )}
          </form>
        </div>
      </div>
      <GlbobalNavBar/>
    </>
  );
}

export default Profile;
