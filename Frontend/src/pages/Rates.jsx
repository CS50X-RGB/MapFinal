import Logo from "../logo.svg";
import { useEffect, useState } from "react";
import GlbobalNavBar from "../components/globalNavBar";
import { Link } from "react-router-dom";
import { getData } from "../core/apiHandler";
import {Image, TableHeader,Table,TableColumn,TableCell,TableBody,TableRow } from "@nextui-org/react";

export const Prices = () => {
  const [petrolPrices, setPetrolPrice] = useState([]);
  const [diselPrice, setDiselPrice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData("/data/fetchPrices"); 
        setPetrolPrice(response.data.petrolPrices);
        setDiselPrice(response.data.dieselPrices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Link to={"/"} className="flex flex-col  bg-black p-2">
      <div className="flex flex-col items-center w-1/4 justify-center">
        <Image src={Logo} alt="Logo" className="rounded-full w-20 h-20" />
        <h1 className="text-text shadow-2xl shadow-text font-mono text-lg md:text-xl font-extrabold">
          MAP-0-SHARE
        </h1>
      </div>
      </Link>
      {loading ? (
        <p className="flex justify-center items-center font-mono">Loading...</p>
      ) : (
        <>
          <h1 className="bg-back font-mono font-bold text-3xl p-5 flex justify-center  text-text">
            Petrol Prices in INDIA (STATE WISE)
          </h1>
          <div className="flex px-8 flex-col justify-center items-center bg-back">
            <Table classNames={{
                base : "bg-back w-1/2 text-text font-mono",
                th : "bg-text text-xl font-mono text-back  font-bold"
             }} removeWrapper aria-label="Petrol Prices" className="font-mono font-fixed shadow-xl shadow-text rounded-2xl">
              <TableHeader>
                  <TableColumn>State</TableColumn>
                  <TableColumn> Price</TableColumn>
              </TableHeader>
              <TableBody> 
                {petrolPrices.map((price, index) => (
                <TableRow key={index}>
                    <TableCell className="text-xl border-b border-r border-text font-mono">
                      {price.state}
                    </TableCell>
                    <TableCell className="text-xl border-b border-text font-mono">
                      {price.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
       <h1 className="bg-back font-mono font-bold text-3xl p-5 flex justify-center  text-text">
            Diesel Prices in INDIA (STATE WISE)
          </h1>
          <Table classNames={{
                base : "bg-back w-1/2 text-text font-mono",
                th : "bg-text text-xl font-mono text-back  font-bold"
             }} removeWrapper aria-label="Petrol Prices" className="font-mono font-fixed shadow-xl shadow-text rounded-2xl">
              <TableHeader>
                  <TableColumn>State</TableColumn>
                  <TableColumn> Price</TableColumn>
              </TableHeader>
              <TableBody> 
                {diselPrice.map((price, index) => (
                <TableRow key={index}>
                    <TableCell className="text-xl border-b border-r border-text font-mono">
                      {price.state}
                    </TableCell>
                    <TableCell className="text-xl border-b border-text font-mono">
                      {price.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> 
          </div>
        </>
      )}
      <GlbobalNavBar />
    </>
  );
};

export default Prices;
