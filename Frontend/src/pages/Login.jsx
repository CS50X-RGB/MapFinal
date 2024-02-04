import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../logo.svg";
import LogoMob from "../logo2.svg";
import LoginAxios from "../utils/Db/Login";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../cart/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [res, setRes] = useState(null);
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth);

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await LoginAxios(email, password);
      console.log(response);
      dispatch(login());
      navigate("/main");
      console.log(isAuth);
      setRes(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {res ? (
        <div>
          <h1 className="text-2xl bg-green-500">{res.data}</h1>
        </div>
      ) : (
        <div></div>
      )}
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
            Login
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
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="bg-back text-md md:text-xl placeholder-text text-xl text-text focus:text-back border-2 border-text w-full px-2 py-3 rounded-full focus:bg-text"
            />
          </div>
          <button
            type="submit"
            className="bg-text flex flex-row justify-center items-center text-back px-[2rem] md:px-[4rem] py-[1rem] rounded-3xl shadow-text shadow-2xl hover:text-text hover:bg-back"
          >
            Login
          </button>
          <p className="text-text text-lg">OR</p>
          <div className="flex flex-col gap-4 justify-center items-center font-mono">
            <p className="text-bold text-blue-600">
              Create Your Account{" "}
              <Link to={"/register"} className="text-text">
                Register
              </Link>
            </p>
            <Link to={"/forgot-password"} className="text-text">
              Forgot Password
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
