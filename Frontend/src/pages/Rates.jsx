import Logo from "../logo.svg";
import { useEffect, useState } from "react";
import GlbobalNavBar from "../components/globalNavBar";
import { Link } from "react-router-dom";
import { getData } from "../core/apiHandler";
import {
  Image,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import ShowTableData from "../components/ShowTable";

export const Prices = () => {
  const [petrolPrices, setPetrolPrice] = useState([]);
  const [page,setPage] = useState(1);
  const [pages,setPages]  = useState(0);
  const {
    data: fetchedData,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["fetching",page],
    queryFn: async () => {
      return getData(`/data/fetchPrices/${page}/10`, {}); // assuming getData is a custom fetcher function
    },
  });

  useEffect(() => {
    if (isFetched) {
      setPetrolPrice(fetchedData.data.fuelPrices);
      setPages(fetchedData.data.totalPages);
    }
  }, [isFetched, fetchedData]);
  const columns = [
    {
      name : "State"
    },
    {
      name : "Petrol"
    },
    {
      name : "Diesel"
    }
  ]
  return (
    <>
      <Link to={"/main"} className="flex flex-col  bg-black p-2">
        <div className="flex flex-col items-center w-1/4 justify-center">
          <Image src={Logo} alt="Logo" className="rounded-full w-20 h-20" />
          <h1 className="text-text shadow-2xl shadow-text font-mono text-lg md:text-xl font-extrabold">
            MAP-0-SHARE
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-4 bg-black h-screen">
      <h1 className="bg-back font-mono font-bold text-2xl p-5 flex justify-center  text-text">
        Fuel Prices in INDIA (STATE WISE)
      </h1>
      <ShowTableData loadingState={isFetching} data={petrolPrices} columnHeaders={columns} page={page} setPage={setPage} pages={pages} />
    </div>
      <GlbobalNavBar />
    </>
  );
};

export default Prices;
