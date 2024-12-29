import "../index.css";
import logo3 from "./assets/logo.svg";
import { Link } from "react-router-dom";
import { Image, Button,User,Dropdown,DropdownItem,DropdownTrigger,DropdownMenu } from "@nextui-org/react";
import { motion } from "framer-motion";
import car from "../assests/car.svg";
import petrolPump from "../assests/petrolpump.svg";
import Accordian from "./Accordian.jsx";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const Faqs = [
  {
    title: "How does the rating system work in Map-O-Share?",
    description: "The rating system in Map-O-Share assigns ratings to users in two ways: +0.5 for completing a transaction of shared resources (Customer and Provider), and -0.5 for aborting a transaction after setting up a meetup for potential transactions between Providers and Resource Acceptors."
  },
  {
    title: "What are the requirements for Fuel Resource Sharing Orders?",
    description: "For liquid-type Resource Providers: Only 10 litres per order. For liquid-type Resource Acceptors: Maximum of 10 litres per order."
  },
  {
    title: "What are the requirements for Electrical Battery Sharing Order",
    description: "For Electrical Battery Resource Provider :Only 2 EV batteries at Once per Order.For Electrical Battery Resoure Acceptor :1 EV battery at max per order"
  }
];

const Faqs1 = [
  {
    title: "What is the age requirements for registering in Map-O-Share",
    description: "For registration in Map-O-Share, the user must be in age group of 18-60.For registration in Map-O-Share, the user must be in age group of 18-60."
  },
  {
    title: "What type of Services are provided by Map-O-Share?",
    description: "Map-O-Share provides sharing of 2 types of resources liquid resources (Fuel and Diesel) and Electrical battery."
  },
  {
    title: "What type of resources are allowed in sharing in Map-O-Share",
    description: "Map-O-Share provides sharing of 2 types of resources.Liquid Resources(Fuel and Diesel) and Electrical battery"
  }
]

function LandingPage() {
  const {user} = useSelector((state) => state.auth);
   console.log(user);
  return (
    <div className="color font-poppins">
      <nav className="flex flex-row w-full justify-between">
        <Image src={logo3} width={100} height={100} />
        <div className="flex text-2xl font-poppins font-bold items-center p-4 flex-row text-white gap-4">
          {user ? 
             (
              <div className="flex flex-row items-center">
              
           <Dropdown>
           <DropdownTrigger>
             <User   
                name={user?.name}
                avatarProps={{
                   src: user?.profilePic,
                   size : "lg"
                 }}
                 />
           </DropdownTrigger>
               <DropdownMenu 
               classNames={{
                 base : "bg-back text-text" 
              }}
               aria-label="Action event example" 
             >
                   <DropdownItem key="main">
                    <Link to={"/main"}>Get Started</Link>
                  </DropdownItem>
                  <DropdownItem key="prices">
                    <Link to={"/rates"}>Prices</Link>
                 </DropdownItem>
                  <DropdownItem key="profile">
                          <Link to={"/profile"}>Profile</Link>
                     </DropdownItem>
                  <DropdownItem key="delete" className="text-danger" color="danger">
                    Logout
                  </DropdownItem>
             </DropdownMenu>
            </Dropdown>
             </div> 
            ): (
             <div className="flex flex-row text-md gap-2 items-center">
               <Link to={"/login"}>Login</Link>
                <Link to={"/register"}>Register</Link>
                <Button className="p-3 font-bold bg-white">Contact Us</Button>
              </div>
            )
         }

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
        <p className="text-lg text-center px-[10rem] bg-clip-text text-transparent bg-gradient-to-tr from-black to-blue-800">
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
          <Link to="/register">
            Start Now
          </Link>
        </motion.button>
      </div>
      <div className="flex  flex-col md:flex-row justify-around w-full items-center">
        <div className="w-full md:w-1/2 items-center flex p-8 flex-col">
          <h1 className="text-black font-extrabold text-4xl p-8">
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
      <div className="flex px-[1rem] md:px-[4rem] flex-col items-center justify-center">
        <h1 className="text-3xl md:text-6xl font-bold text-blue-700 pb-[0rem] md:pb-[3rem]">FAQ</h1>
        <div className="flex flex-col md:flex-row items-center justify-center h-[100vh] md:h-[50vh] gap-4 w-full">
          <div className="flex flex-col w-full md:w-1/2 gap-4">
            {Faqs.map((faq, index) => (
              <Accordian key={index} title={faq.title} description={faq.description} />
            ))}
          </div>
          <div className="flex flex-col  w-full md:w-1/2 gap-3">
            {Faqs1.map((faq, index) => (
              <Accordian key={index} title={faq.title} description={faq.description} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
}

export default LandingPage;
