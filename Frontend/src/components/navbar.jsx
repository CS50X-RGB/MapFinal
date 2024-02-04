import React, { useEffect, useState } from "react";
import "./navbar.css";
import ProfileAxios from "../utils/Db/getMyProfile";
import handleLogout from "../utils/Db/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../cart/authSlice";

export default function Navbar({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ProfileAxios();
        const userData = response.data.user;
        console.log(response.data.user);
        dispatch(login(userData));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const logoutHandler = async () => {
    try {
      await handleLogout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-back flex flex-row justify-center items-center p-4 rounded-t-xl">
      {isAuth ? (
        <div className="flex flex-end font-mono items-center">
          <p className="text-xl text-text">Welcome {user.name}</p>
          <img
            className="hidden md:block rounded-full h-[10vh] "
            src={user.profilePic}
            alt="profilepic"
          />
          {children}
          <button
            onClick={logoutHandler}
            className="bg-text text-back px-3 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
