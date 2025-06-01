import { useEffect, useState } from "react";
import Logo from "../logo.svg";
import { IoMdAdd } from "react-icons/io";
import ProfileAxios from "../utils/Db/getMyProfile";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlbobalNavBar from "../components/globalNavBar";
import { Image, Input, Button } from "@nextui-org/react";
import { putData } from "../core/apiHandler";
import { FaStar } from "react-icons/fa";
import ProfileCard from "../components/ProfileCard";

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
      };
      const res = await putData("/users/resetDetails", {}, body);
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
      </nav>
      <div className="p-4 flex flex-row h-screen bg-back">
        <ProfileCard />
      </div>
      <GlbobalNavBar />
    </>
  );
}

export default Profile;
