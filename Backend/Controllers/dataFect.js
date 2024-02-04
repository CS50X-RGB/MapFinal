import cheerio from "cheerio";
import axios from "axios";
import cron from "node-cron";

let lastUpdateTime = null;
let petrolPrices = [];
let dieselPrices = [];

const updatePetrolPrices = async () => {
  try {
    const response = await axios.get("https://www.ndtv.com/fuel-prices/petrol-price-in-all-state", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const html = response.data;
    const $ = cheerio.load(html);

    petrolPrices = [];

    $(".font-16.color-blue.short-nm tbody tr").each((index, element) => {
      const state = $(element).find("td:first-child a").text().trim();
      const price = $(element).find("td:nth-child(2)").text().trim();
      petrolPrices.push({ state, price });
    });
    petrolPrices.shift();
    lastUpdateTime = new Date();
    console.log("Petrol prices updated successfully:", lastUpdateTime);
  } catch (error) {
    console.log("Error updating petrol prices:", error.message);
  }
};

const updateDieselPrices = async () => {
  try {
    const response = await axios.get("https://www.ndtv.com/fuel-prices/diesel-price-in-all-state", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    const html = await response.data;
    const $ = cheerio.load(html);

    dieselPrices = [];

    $(".font-16.color-blue.short-nm tbody tr").each((index, element) => {
      const state = $(element).find("td:first-child a").text().trim();
      const price = $(element).find("td:nth-child(2)").text().trim();
      dieselPrices.push({ state, price });
    });
    dieselPrices.shift();
    lastUpdateTime = new Date();
    console.log("Diesel prices updated successfully:", lastUpdateTime);
  } catch (err) {
    console.log(err);
  }
};

cron.schedule("0 0 * * *", () => {
  updatePetrolPrices();
  updateDieselPrices();
});

export const getFuelPrices = async (req, res) => {
  const shouldUpdate = !lastUpdateTime || (new Date() - lastUpdateTime) > 24 * 60 * 60 * 1000;

  if (shouldUpdate) {
    await updatePetrolPrices();
    await updateDieselPrices();
  }

  res.status(200).json({
    petrolPrices,
    dieselPrices,
  });
};

export default { getFuelPrices };
