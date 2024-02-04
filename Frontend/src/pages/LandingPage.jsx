import Logo from "../logo.svg";

export default function Home() {
  return (
    <>
      <div className="hidden md:flex z-10 flex-col items-center rounded-l-[2rem] bg-text w-1/4">
        <img src={Logo} className="w-[55%] p-3" alt="Logo of Company" />
        <h1 className="text-3xl shadow-back font-bold">MAP-0-SHARE</h1>
      </div>
    </>
  );
}
