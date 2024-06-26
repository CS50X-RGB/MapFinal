import { useReducer, useState } from "react";
import "../App.css";
import Logo from "../logo.svg";
import { useDispatch, useSelector } from "react-redux";
import LogoMob from "../logo2.svg";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import RegisterAxios from "../utils/Db/Resgister";
import { login } from "../cart/authSlice";

function reducer(state, action) {
  switch (action.type) {
    case "setEmail":
      return { ...state, email: action.payload };
    case "setName":
      return { ...state, name: action.payload };
    case "setPassword":
      return { ...state, password: action.payload };
    case "setDlNo":
      return { ...state, dlNo: action.payload };
    case "setPhoneNumber":
      return { ...state, phoneNo: action.payload };
    default:
      return state;
  }
}

export default function Register() {
  const [image, setImage] = useState(null);
  const initialState = {
    name: "",
    email: "",
    password: "",
    dlNo: "",
    phoneNo: "",
  };
  const navigate = useNavigate();
  const [res, setRes] = useState(null);
  const dispatch = useDispatch();
  const [state, dispatchReducer] = useReducer(reducer, initialState);
  const [userType, setUserType] = useState(null);

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImage(reader.result);
      };

      reader.onerror = (error) => {
        console.error(error);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await RegisterAxios(
        image,
        state.name,
        state.email,
        state.password,
        state.dlNo,
        userType,
        state.phoneNo
      );
      console.log(response);
      if (response.data.success) {
        setRes(response.data.message);
        dispatch(login());
        navigate("/main");
      } else if (!response.data.success && response.data.errors) {
        // Registration failed with validation errors
        const errorMessages = response.data.errors
          .map((error) => error.message)
          .join(", ");
        console.log(`Registration failed: ${errorMessages}`);
        setRes(`Registration failed: ${errorMessages}`);
      } else {
        console.error("Unexpected error during registration");
        setRes("An unexpected error occurred during registration.");
      }
    } catch (error) {
      console.error(error);
      setRes("An error occurred during registration.");
    }
  };

  const handleNameChange = (e) => {
    dispatchReducer({ type: "setName", payload: e.target.value });
  };

  const handleEmailChange = (e) => {
    dispatchReducer({ type: "setEmail", payload: e.target.value });
  };

  const handlePasswordChange = (e) => {
    dispatchReducer({ type: "setPassword", payload: e.target.value });
  };

  const handleDrivingLicenseChange = (e) => {
    dispatchReducer({ type: "setDlNo", payload: e.target.value });
  };

  const handlePhoneChange = (e) => {
    dispatchReducer({ type: "setPhoneNumber", payload: e.target.value });
  };

  return (
    <>
      <div className="bg-back min-h-screen font-mono flex py-[1rem] md:py-[3rem] flex-row justify-center gap-4">
        <form
          className="flex flex-col items-center gap-4 px-[1rem] md:px-[3rem] py-[1rem] w-[70%] md:w-[50%] box rounded-l-[2rem]"
          onSubmit={handleSubmit}
        >
          <div className="absolute md:hidden brightness-150 blur-xl radial p-[5rem] rounded-full right-[.3rem]" />
          <img
            src={LogoMob}
            className="block md:hidden z-10 w-[40%] p-3"
            alt="Logo of Company"
          />
          <h1 className="block md:hidden text-xl text-center text-text">
            MAP-O-SHARE
          </h1>
          <h1 className="text-bold text-text p-[0.5rem] md:p-[1rem] font-bold text-2xl md:text-6xl text-center">
            Register
          </h1>
          <div
            className={`rounded-full ${
              !image ? "p-[3rem]" : "p-[.1rem]"
            } relative border-2 border-text`}
          >
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={convertToBase64}
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="ProfileImage"
                    className="rounded-full w-[8rem] h-[8rem] object-cover"
                  />
                  <IoMdAdd
                    size={50}
                    className="fill-text z-30 absolute -right-[1rem] bottom-[0.1rem]"
                  />
                </>
              ) : (
                <IoMdAdd
                  size={30}
                  className="fill-text z-30 absolute -right-[.9rem]"
                />
              )}
            </label>
          </div>
          <h1 className="text-text text-center">Choose Your Profile Pic</h1>
          <div className="flex flex-col gap-[1rem]">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={state.name}
              onChange={handleNameChange}
              className="bg-back text-md md:text-xl placeholder-text  text-text focus:text-back border-2 border-text w-full px-2 py-3 rounded-full focus:bg-text"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={state.email}
              onChange={handleEmailChange}
              className="bg-back text-md md:text-xl placeholder-text text-xl text-text focus:text-back border-2 border-text w-full px-2 py-3 rounded-full focus:bg-text"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={state.password}
              onChange={handlePasswordChange}
              className="bg-back text-md md:text-xl placeholder-text text-xl text-text focus:text-back border-2 border-text w-full px-2 py-3 rounded-full focus:bg-text"
            />
            <input
              type="text"
              name="drivingLicense"
              placeholder="Driving Lisence Number.."
              required
              value={state.dlNo}
              onChange={handleDrivingLicenseChange}
              className="bg-back placeholder-text text-md md:text-xl text-text focus:text-back border-2 border-text w-full px-2 py-3 rounded-full focus:bg-text"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone No."
              required
              value={state.phoneNo}
              onChange={handlePhoneChange}
              className="bg-back placeholder-text text-md md:text-xl text-text focus:text-back border-2 border-text w-full pr-[4rem] px-2 py-3 rounded-full focus:bg-text"
            />
            <div className="flex flex-row justify-around text-text">
              <div className="flex flex-row gap-3 items-center">
                <input
                  type="radio"
                  id="regularUser"
                  name="userType"
                  className="form-radio text-text"
                  required
                  onChange={() => setUserType("RegularUser")}
                />
                <label htmlFor="regularUser" className="cursor-pointer">
                  RegularUser
                </label>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <input
                  type="radio"
                  id="resourcePoint"
                  name="userType"
                  className="form-radio text-text"
                  required
                  onChange={() => setUserType("ResourcePoint")}
                />
                <label htmlFor="resourcePoint" className="cursor-pointer">
                  ResourcePoint
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-text flex flex-row justify-center items-center text-back px-[.5rem] md:px-[2rem] py-[1rem] rounded-3xl shadow-text shadow-2xl hover:text-text hover:bg-back"
          >
            Submit Details
          </button>
          <p className="text-text text-lg">OR</p>
          <p className="text-bold text-blue-600">
            Already have an account{" "}
            <Link to={"/login"} className="text-text">
              Login
            </Link>
          </p>
          {res && <div className="text-red-500 text-center p-2">
            {res}
          </div>}
        </form>
        <div className="hidden md:flex z-10 flex-col items-center rounded-r-[2rem] bg-text w-1/4">
          <img src={Logo} className="w-[55%] p-3" alt="Logo of Company" />
          <h1 className="text-3xl shadow-back font-bold">MAP-0-SHARE</h1>
        </div>
        <div className="hidden md:flex absolute brightness-150 blur-xl radial p-[5rem] rounded-full right-[8.25rem]" />
      </div>
    </>
  );
}
