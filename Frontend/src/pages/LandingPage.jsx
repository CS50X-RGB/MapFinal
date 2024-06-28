import "../index.css";
import logo3 from "./assets/logo.svg";
import bg from "./assets/bg.svg";
import Example from "./Accordian.jsx";
import { Link } from "react-router-dom";
import { Image, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import car from "../assests/car.svg";
import petrolPump from "../assests/petrolpump.svg";

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
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 2, type: 'spring', stiffness: 120 }}
        className="flex flex-col gap-[1rem] md:gap-[2rem] text-white text-3xl md:text-5xl font-extrabold  items-center justify-center h-[30vh] md:h-[40vh]">
        <h1>Sharing Resources to Create</h1>
        <h1>Shared Moments,That</h1>
        <h1>Catalyst A <span className="text-[#051937]">Positive Change</span></h1>
      </motion.div>
      <div className="flex p-[.4rem] md:p-[2rem] flex-row items-start ml-[8rem] md:ml-[10rem]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-[2rem] md:px-[4rem] rounded-xl justify-self-start py-[1rem] text-xl border-dotted border-4 border-sky-500 bg-gradient-to-r from-blue-400 to-pink-200
          text-blue-800 border-dotted font-bold">
          Start Now
        </motion.button>
      </div>
      <div className="flex flex-row justify-around w-full items-center">
        <h1 className="text-blue-700 font-extrabold text-4xl p-8  w-1/2">Never get your car get stopped</h1>
        <div className="flex flex-col">
          <Image src={petrolPump} className="w-full h-1/2" />
          <Image src={car} className="w-[80%] h-1/2" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
