import "../index.css";
import logo3 from "./assets/logo.svg";
import bg from "./assets/bg.svg";
import Example from "./Accordian.jsx";
import { Link } from "react-router-dom";
import { Image, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import car from "../assests/car.svg";
import petrolPump from "../assests/petrolpump.svg";
import Accordian from "./Accordian.jsx";

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
        <p className="text-lg text-center bg-clip-text text-transparent bg-gradient-to-tr from-black to-blue-800">
          Map-O-Share Ignite compassion on the road.
          Share a drop, be a driving force.
          Fuel the journey of kindness, connecting drivers in need with a community that cares. Together, we turn every drive into a shared
          adventure of generosity and support.</p>
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
      <div className="flex  flex-col md:flex-row justify-around w-full items-center">
        <div className="w-full md:w-1/2 items-center flex p-8 flex-col">
          <h1 className="text-blue-700 font-extrabold text-4xl p-8">
            Never get your car get stopped
          </h1>
          <p className="text-white text-xl font-bold">
            Create your own polling stations whenever you want at your control
          </p>
        </div>
        <div className="relative overflow-hidden p-7 w-full md:w-1/2 ">
          <img src={petrolPump} className="w-1/4 h-1/4" alt="Petrol Pump" />
          <motion.img
            initial={{ x: "100%", y: "-70%" }}
            animate={{ x: "0%", y: "0%" }}
            transition={{ duration: 7, ease: "easeIn" }}
            src={car}
            className="w-full h-full absolute top-10 z-30" alt="car" />
        </div>
      </div>
      <div className="flex px-[4rem] flex-col items-center justify-center">
        <h1 className="text-6xl text-green-500 pb-[3rem]">FAQ</h1>
        <div className="flex flex-row items-center justify-center h-[40vh] gap-4 w-full">
          <div className="flex flex-col w-full md:w-1/2 gap-4">
            <Accordian />
            <Accordian />
            <Accordian />
          </div>
          <div className="flex flex-col w-1/2 gap-3">
            <Accordian />
            <Accordian />
            <Accordian />
          </div>
        </div>
      </div>
    </div >
  );
}

export default LandingPage;
