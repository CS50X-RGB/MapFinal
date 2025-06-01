import cheerio from "cheerio";
import axios from "axios";
import cron from "node-cron";

let lastUpdateTime = null;



let stateWisePrices = [];

const updatePetrolPrices = async () => {
  const petrolData = [];
  try {
    const response = await axios.get("https://www.ndtv.com/fuel-prices/petrol-price-in-all-state");
    const $ = cheerio.load(response.data);

    $(".font-16.color-blue.short-nm tbody tr").each((_, el) => {
      const state = $(el).find("td:first-child a").text().trim();
      const price = $(el).find("td:nth-child(2)").text().trim();
      if (state && price) {
        petrolData.push({ state, petrol: price });
      }
    });
    petrolData.shift(); // remove table header
    return petrolData;
  } catch (e) {
    console.error("Failed to fetch petrol prices:", e.message);
    return [];
  }
};

const updateDieselPrices = async () => {
  const dieselData = [];
  try {
    const response = await axios.get("https://www.ndtv.com/fuel-prices/diesel-price-in-all-state");
    const $ = cheerio.load(response.data);

    $(".font-16.color-blue.short-nm tbody tr").each((_, el) => {
      const state = $(el).find("td:first-child a").text().trim();
      const price = $(el).find("td:nth-child(2)").text().trim();
      if (state && price) {
        dieselData.push({ state, diesel: price });
      }
    });
    dieselData.shift(); // remove table header
    return dieselData;
  } catch (e) {
    console.error("Failed to fetch diesel prices:", e.message);
    return [];
  }
};

const updateStateWisePrices = async () => {
  const petrolList = await updatePetrolPrices();
  const dieselList = await updateDieselPrices();

  const priceMap = new Map();

  petrolList.forEach(({ state, petrol }) => {
    priceMap.set(state, { state, petrol });
  });

  dieselList.forEach(({ state, diesel }) => {
    if (priceMap.has(state)) {
      priceMap.get(state).diesel = diesel;
    } else {
      priceMap.set(state, { state, diesel });
    }
  });

  stateWisePrices = Array.from(priceMap.values());
  lastUpdateTime = new Date();
  console.log(`✅ Fuel prices updated @ ${lastUpdateTime.toISOString()}`);
};


cron.schedule("0 0 * * *", () => {
  updateStateWisePrices();
});
export const getFuelPrices = async (req, res) => {
  const shouldUpdate =
    !lastUpdateTime || new Date() - lastUpdateTime > 24 * 60 * 60 * 1000;

  if (shouldUpdate) {
    await updateStateWisePrices();
  }

  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = stateWisePrices.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    page,
    totalStates: stateWisePrices.length,
    totalPages: Math.ceil(stateWisePrices.length / limit),
    fuelPrices: paginatedData,
  });
};


export default { getFuelPrices };
