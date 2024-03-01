import "../index.css";
import logo3 from "./assets/bg.svg";
import bg from "./assets/bg.svg";
import Example from "./Accordian.jsx";

function App() {
  return (
    <>
      <div className="font-poppins">
        <nav className="flex justify-right items-center bg-gray-800 p-4 relative">
          <img
            src={logo3}
            alt="logo"
            className="absolute top-5 z-10 w-24 h-24"
          />
          <ul className="flex absolute right-[1rem] top-5 z-10">
            <li>
              <a href="/" className="text-white font-poppins text-lg mr-8">
                Home
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="text-white font-poppins mr-8 text-lg"
              >
                Register
              </a>
            </li>
            <button></button>
          </ul>
          <img src={bg} alt="background" className="relative ml-auto z-4" />
          <div className="mb-4 flex flex-col absolute text-white left-[60%] top-[30%] transform translate-x-[-50%] translate-y-[-50%] justify-center items-center">
            <h1 className="text-4xl font-extrabold mb-4 font-poppins text-center leading-tight">
              Sharing Resources to Create
            </h1>
            <h1 className="text-4xl font-extrabold mb-4 font-poppins text-center leading-tight">
              Shared Moments,
            </h1>
            <h1 className="text-4xl font-extrabold mb-4 font-poppins text-center leading-tight">
              That Catalyst A{" "}
              <span className="text-[#AFFF04]">Positive Change</span>
            </h1>
          </div>
        </nav>
        <button className="text-2xl hero-btn px-[5rem] py-[1rem] rounded-xl border-dotted border border-white absolute bottom-[10rem] text-white left-[20rem] shadow-xl shadow-white">
          Start Now
        </button>
      </div>
      <Example />
      <h1>
        <span className=" bg-gradient-to-r from-cyan-500 to-blue-500">
          Map-O-Share{" "}
        </span>{" "}
        Ignite compassion on the road. Share a drop, be a driving force. Fuel
        the journey of kindness, connecting drivers in need with a community
        that cares. Together, we turn every drive into a shared adventure of
        generosity and support.
      </h1>
    </>
  );
}

export default App;
