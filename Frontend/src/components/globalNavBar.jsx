import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoPricetagsSharp } from "react-icons/io5";

export const GlbobalNavBar = () =>{

        return (
                <>
                <div className="flex max-w-[100%] fixed bottom-0 rounded-t-full p-[4vh] justify-around gap-2 bg-[#173049] w-full ">
                        <Link to={"/main"} className="bg-transparent flex flex-col gap-2 focus:bg-text focus:border-b-8 rounded-full p-[1rem] absolute left-[20%] bottom-0 focus:bottom-9" >
                                <FaHome size={30} style={{ color: "white" }} />
                        </Link>
                        <Link to={"/rates"} className="bg-transparent focus:bg-text focus:border-b-8 rounded-full p-[1rem] absolute left-[50%] bottom-0 focus:bottom-9" >
                                <IoPricetagsSharp size={30} className="fill-white"/>
                        </Link>
                        <Link to={"/profile"} className="bg-transparent focus:bg-text focus:border-b-8 rounded-full p-[1rem] absolute left-[80%] bottom-0 focus:bottom-9" >
                                <CgProfile size={30} style={{ color: "white" }} />
                        </Link>
                </div>
                </>
        )
}

export default GlbobalNavBar;