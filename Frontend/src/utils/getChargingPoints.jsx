export const fetchChargingStations = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=[out:json];(node[%27amenity%27=%27charging_station%27](around:5000,${latitude},${longitude});way[%27amenity%27=%27charging_station%27](around:2000,${latitude},${longitude}););out;`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();

    const chargingStationCoordinates = data.elements.map((element) => ({
      latitude: element.lat,
      longitude: element.lon,
      name: element.tags.name || "Charging Station",
    }));

    return chargingStationCoordinates;
  } catch (e) {
    console.error("Failed to fetch charging stations:", e);
  }
};

export default fetchChargingStations;
