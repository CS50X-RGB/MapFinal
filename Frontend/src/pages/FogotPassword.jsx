import { useState } from "react";
import Logo from "../logo.svg";
import LogoMob from "../logo2.svg";
import { Link } from "react-router-dom";
import axios from "axios";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");
  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mapfinal.onrender.com/api/v1/users/forgot-password",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setResponse(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="bg-back min-h-screen font-mono flex py-[1rem] md:py-[3rem] flex-row justify-center gap-4 relative">
        <div className="hidden md:flex z-10 flex-col items-center rounded-l-[2rem] bg-text w-1/4">
          <img src={Logo} className="w-[55%] p-3" alt="Logo of Company" />
          <h1 className="text-3xl shadow-back font-bold">MAP-0-SHARE</h1>
        </div>
        <div className="hidden md:flex absolute brightness-150 blur-xl radial p-[5rem] rounded-full right-[8.25rem]" />
        <form
          className="flex flex-col justify-center items-center gap-4 px-[1rem] md:px-[3rem] py-[1rem] w-[70%] md:w-1/2 box2 rounded-r-[2rem] bg-back relative z-20"
          onSubmit={formSubmit}
        >
          <div className="absolute md:hidden brightness-150 blur-xl radial p-[5rem] rounded-full right-[3rem] top-[3rem]" />
          <img
            src={LogoMob}
            className="block md:hidden z-10 w-[40%] p-3"
            alt="Logo of Company"
          />
          <h1 className="block md:hidden text-xl text-center text-text bottom-[]">
            MAP-O-SHARE
          </h1>
          <h1 className="text-bold text-text p-[1rem] md:p-[2rem] font-bold text-2xl md:text-6xl text-center">
            Forgot Password
          </h1>
          <div className="flex flex-col justify-center items-center gap-8">
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="bg-back text-md md:text-xl placeholder-text text-xl text-text focus:text-back border-2 border-text w-full px-2 py-3 rounded-full focus:bg-text"
            />
          </div>
          <button
            type="submit"
            className="bg-text flex flex-row justify-center items-center text-back px-[2rem] md:px-[4rem] py-[1rem] rounded-3xl shadow-text shadow-2xl hover:text-text hover:bg-back"
          >
            Recover Password
          </button>
          {response.message ? (
            <>
              <div>
                <h1 className="bg-text text-back border border-text rounded-lg font-mono">
                  {response.message}
                </h1>
              </div>
            </>
          ) : (
            <></>
          )}
          <p className="text-text text-lg">OR</p>
          <p className="text-bold text-blue-600">
            Back to Login{" "}
            <Link to={"/login"} className="text-text">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
