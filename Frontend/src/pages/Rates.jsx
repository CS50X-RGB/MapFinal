import Logo from "../logo.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import GlbobalNavBar from "../components/globalNavBar";
import { Link } from "react-router-dom";

export const Prices = () => {
  const [petrolPrices, setPetrolPrice] = useState([]);
  const [diselPrice, setDiselPrice] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://maposhare.onrender.com/api/v1/data/fetchPrices",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
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
      <Link to={"/"} className="flex flex-col bg-black p-2">
        <img src={Logo} alt="Logo" className="rounded-full w-20 h-20 mt-4" />
        <h1 className="text-text shadow-2xl shadow-text font-mono text-lg md:text-xl font-extrabold">
          MAP-0-SHARE
        </h1>
      </Link>
      {loading ? (
        <p className="flex justify-center items-center font-mono">Loading...</p>
      ) : (
        <>
          <h1 className="bg-back font-mono flex justify-center text-text">
            Petrol Prices in INDIA
          </h1>
          <div className="flex flex-col justify-center items-center bg-back">
            <table className="font-mono font-fixed bg-back text-text border-separate border-spacing-2 border-text shadow-xl shadow-text rounded-xl">
              <thead>
                <tr>
                  <th className="border border-text">State</th>
                  <th className="border border-text"> Price</th>
                </tr>
              </thead>
              <tbody>
                {petrolPrices.map((price, index) => (
                  <tr key={index}>
                    <td className="border border-text">
                      {price.state}
                    </td>
                    <td className="border border-text">
                      {price.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h1 className="bg-back text-text p-3 flex justify-center font-mono">Diesel Prices Across INDIA</h1>
            <table className="font-mono font-fixed bg-back text-text border-separate border-spacing-2 border-text shadow-xl shadow-text">
              <thead>
                <tr>
                  <th className="border border-text">State</th>
                  <th className="border border-text">Price</th>
                </tr>
              </thead>
              <tbody>
                {diselPrice.map((price, index) => (
                  <tr key={index}>
                    <td className="border border-text">{price.state}</td>
                    <td className="border border-text">{price.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <GlbobalNavBar />
    </>
  );
};

export default Prices;
