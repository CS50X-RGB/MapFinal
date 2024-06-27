import "../index.css";
import logo3 from "./assets/logo.svg";
import bg from "./assets/bg.svg";
import Example from "./Accordian.jsx";
import { Link } from "react-router-dom";
import { Image, Button } from "@nextui-org/react";

function LandingPage() {
  return (
    <div className="color font-poppins">
      <nav className="flex flex-row w-full justify-between">
        <Image src={logo3} width={100} height={100} />
        <div className="flex text-2xl font-poppins font-bold items-center p-4 flex-row text-white gap-4">
          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register</Link>
          <Button className="p-3 font-bold bg-white">Contact Us</Button>
        </div>
      </nav>
      <div className="flex flex-col gap-[2rem] text-white text-5xl font-extrabold  items-center justify-center h-[40vh]">
        <h1>Sharing Resources to Create</h1>
        <h1>Shared Moments,That</h1>
        <h1>Catalyst A <span className="text-[#051937]">Positive Change</span></h1>
      </div>
      <div className="flex p-[2rem] flex-row w-full items-start">
        <Button className="px-[4rem] justify-self-start  py-[2rem] text-xl border-dotted border-4 border-sky-500 bg-gradient-to-r from-blue-400 to-pink-200 text-blue-800 border-dotted font-bold ml-[1rem]">Start Now</Button>
      </div>
    </div>
  );
}

export default LandingPage;
