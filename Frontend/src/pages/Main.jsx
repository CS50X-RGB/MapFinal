import React, { useEffect, useState } from "react";
import { Map, NavigationControl, Marker, Popup } from "react-map-gl";
import Navbar from "../components/navbar.jsx";
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../index.css";
import { fetchPetrolPumps } from "../utils/getPetrolPumps.jsx";
import {
  PetrolPumpLayer,
  ChargingPointsLayer,
  ResourcePointsLayer,
} from "../utils/PetrolPumps.jsx";
import LatLonToKM from "../utils/LatLonToKM.jsx";
import { fetchChargingStations } from "../utils/getChargingPoints.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaRegFaceSmileWink } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

const beamsClient = new PusherPushNotifications.Client({
  instanceId: "c41a756e-0c26-4252-9373-43bff3466a8b",
});

// initializePusher();

const plotGJSON = (points) => {
  const geoJSONPoints = {
    type: "FeatureCollection",
    features: points.map((point, index) => ({
      type: "Feature",
      id: index,
      properties: {
        Name: point.name,
      },
      geometry: {
        type: "Point",
        coordinates: [point.longitude, point.latitude],
      },
    })),
  };
  return geoJSONPoints;
};

const plotGJSONPoints = (points) => {
  const geoJSONPoints = {
    type: "FeatureCollection",
    features: points.map((point, index) => ({
      type: "Feature",
      id: index,
      properties: {
        Name: point.name,
      },
      geometry: {
        type: "Point",
        coordinates: [point.longitude[0], point.longitude[1]],
      },
    })),
  };
  return geoJSONPoints;
};

function Main() {
  const [intial, setIntial] = useState(false);
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [err, setError] = useState(null);
  const [petrolPoints, setPetrolPoints] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [active1, setActive1] = useState(false);
  const [chargePoints, setChargePoints] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newMap, setNewMap] = useState(null);
  const [driverMode, setDriverMode] = useState(false);
  const [neigh, setNeigh] = useState(false);
  const [neighDriver, setneighDriver] = useState(null);
  const [theme, setTheme] = useState("streets-v2");
  const { user } = useSelector((state) => state.auth);
  const [succ, setSucc] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [notifyAll, setnotifyAll] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { coords } = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });

        const petrol = await fetchPetrolPumps(latitude, longitude);
        setPetrolPoints(plotGJSON(petrol));
        const chargePoints = await fetchChargingStations(latitude, longitude);
        setChargePoints(plotGJSON(chargePoints));
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (newMap) {
      const handleClick = async (e) => {
        if (e.lngLat) {
          const coordinates = e.lngLat;
          console.log("Clicked Coordinates:", coordinates);
          const distance = LatLonToKM(
            e.lngLat.lat,
            e.lngLat.lng,
            location.latitude,
            location.longitude
          );
          setSelected({ distance, ...e.lngLat });
          console.log("Selected:", selected);
          console.log(e);
        }
      };
      const handleMouseEnter = () => {
        newMap.getCanvas().style.cursor = "pointer";
      };
      const handleMouseLeave = () => {
        newMap.getCanvas().style.cursor = "";
      };
      newMap.on("click", handleClick);
      newMap.on("mouseenter", handleMouseEnter);
      newMap.on("mouseleave", handleMouseLeave);
      return () => {
        newMap.off("click", handleClick);
        newMap.off("mouseenter", handleMouseEnter);
        newMap.off("mouseleave", handleMouseLeave);
      };
    }
  }, [newMap]);

  async function notifyAllControlPostive(driver) {
    driver.map(async (d) => {
      try {
        const response = await axios.post(
          "https://maposhare.onrender.com/api/v1/notify/notify",
          {
            intersts: "all_drivers",
            title: `${d.name} Someone needs your help`,
            message: `${user.name} wants help for more details you can call on ${user.phoneno} 
                          he is ${d.distance} Km away from your current location`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    });
  }
  async function notiftAllControlNegative(driver) {
    try {
      console.log("Hii");
      const response = await axios.post(
        "https://maposhare.onrender.com/api/v1/notify/notify",
        {
          intersts: "all_drivers",
          title: `Sorry for the interuptions`,
          message: `${user.name} will be penalized`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  async function antiDriver() {
    try {
      const response = await axios.delete(
        "https://maposhare.onrender.com/api/v1/location/deleteLoc",
        {
          headers: {
            "Content-Length": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  const driMode = async () => {
    try {
      const response = await axios.post(
        "https://maposhare.onrender.com/api/v1/location/updateLoc",
        {
          longitude: location.longitude,
          latitude: location.latitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getNeighbours = async (r) => {
    try {
      const response = await axios.get(
        `https://maposhare.onrender.com/api/v1/location/nearby/${r}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (driverMode) {
          const res = await driMode();
          console.log(res);
        }
      } catch (error) {
        console.error("Error in interval:", error);
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, [driverMode]);

  useEffect(() => {
    if (notifyAll === true && driverMode && neigh) {
      notifyAllControlPostive(data);
    } else if (notifyAll === false && driverMode && neigh) {
      notiftAllControlNegative(data);
    }
  }, [notifyAll, data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(neigh);
        if (neigh && driverMode) {
          const res = await getNeighbours(100);
          console.log(res.data.nearbyDrivers);
          if (res.data) {
            const filteredNearbyDrivers = res.data.nearbyDrivers.filter(
              (driver) => Math.abs(driver.distance) > 0.001
            );
            setData(filteredNearbyDrivers);
            console.log(filteredNearbyDrivers);
            setneighDriver(plotGJSONPoints(filteredNearbyDrivers));
            setData(filteredNearbyDrivers);
            console.log(filteredNearbyDrivers);
            setneighDriver(plotGJSONPoints(filteredNearbyDrivers));
          }
        }
      } catch (error) {
        console.error("Error fetching neighbours:", error);
      }
    };

    fetchData();
  }, [neigh, driverMode]);

  useEffect(() => {
    const storedDriverMode = localStorage.getItem("driverMode");
    const storedNeigh = localStorage.getItem("neigh");
    const parsedDriverMode = storedDriverMode === "true";
    const parsedNeigh = storedNeigh === "true";
    setDriverMode(parsedDriverMode);
    setNeigh(parsedNeigh);
    return () => {
      localStorage.setItem("driverMode", driverMode.toString());
      localStorage.setItem("neigh", neigh.toString());
    };
  }, []);
  const initializePusher = async () => {
    try {
      await beamsClient.start();
      console.log("Pusher Push Notifications SDK started successfully");
      await beamsClient.addDeviceInterest("all_drivers");
      console.log("Successfully registered and subscribed!");
      setIntial(true);
    } catch (error) {
      console.error("Error initializing Pusher Push Notifications SDK:", error);
    }
  };
  useEffect(() => {
    if (driverMode && neigh) {
      initializePusher();
    }
  }, []);

  const cancelTrans = async (driverId) => {
    try {
      const selectedDriver = data.find((driver) => driver.userId === driverId);
      console.log(selectedDriver.userId);
      if (selectedDriver) {
        const response = await axios.put(
          "https://maposhare.onrender.com/api/v1/users/UnsucessTrans",
          {
            id: selectedDriver.userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(response.data.stars.my);
        setId(null);
        setnotifyAll(false);
        setNeigh(false);
        setDriverMode(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const successTrans = async (driverId) => {
    try {
      const selectedDriver = data.find((driver) => driver.userId === driverId);
      console.log(selectedDriver.userId);
      if (selectedDriver) {
        const responseSuccess = await axios.put(
          `https://maposhare.onrender.com/api/v1/users/sucessTrans`,
          {
            id: selectedDriver.userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log(responseSuccess.data);
        setId(null);
        setnotifyAll(false);
        setNeigh(false);
        setDriverMode(false);
      } else {
        console.error("Selected driver not found");
      }
    } catch (error) {
      console.error("Error in successTrans:", error);
    }
  };

  const handleSuccess = async () => {
    await successTrans(id);
  };
  const Failure = async () => {
    await cancelTrans(id);
  };
  useEffect(() => {
    if (id && cancel && driverMode && neigh) {
      Failure();
    }
  }, [id, cancel, neigh, driverMode]);

  useEffect(() => {
    if (id && succ && driverMode && neigh) {
      handleSuccess();
    }
  }, [id, succ, neigh, driverMode]);

  if (!location.latitude || !location.longitude) {
    return (<div className="flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-2xl font-mono font-bold"> Loading...</h1>
    </div>
    );

  }

  return (
    <>
      <div className="font-mono">
        <Map
          mapLib={maplibregl}
          ref={(map) => setNewMap(map && map.getMap())}
          initialViewState={{
            longitude: location.longitude,
            latitude: location.latitude,
            zoom: 18,
          }}
          style={{ width: "100%", height: "calc(100vh - 70px)" }}
          mapStyle={`https://api.maptiler.com/maps/${theme}/style.json?key=iA9HLCM3T07uoASxQjnx`}
        >
          <NavigationControl position="bottom-left" />
          <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            color="#000000"
          />
          {active && <PetrolPumpLayer data={petrolPoints} color={"#82AAFF"} />}
          {active1 && (
            <ChargingPointsLayer data={chargePoints} color={"#00FF00"} />
          )}
          {selected && (
            <Popup
              longitude={selected.lng}
              latitude={selected.lat}
              onClose={() => setSelected(null)}
            >
              <div className="text-text font-mono bg-back">
                <h1>{selected.distance} Km away</h1>
                <p>Lat: {selected.lat}</p>
                <p>Lon: {selected.lng}</p>
                {/* <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a> */}
              </div>
            </Popup>
          )}
          {neigh && driverMode && (
            <ResourcePointsLayer data={neighDriver} color={"#0FFFFF"} />
          )}
        </Map>
        <Navbar>
          <>
            <button
              onClick={() => setActive(!active)}
              className="bg-back text-text px-6 py-3"
            >
              See Liquid Resources
            </button>
            <button
              onClick={() => setActive1(!active1)}
              className="bg-back text-text px-6 py-3"
            >
              See electric{" "}
            </button>
            {driverMode ? (
              <>
                <button
                  className="bg-back text-text px-6 py-3"
                  onClick={() => setDriverMode(!driverMode)}
                >
                  {user.userType === "RegularUser"
                    ? "DriverMode is ON"
                    : "Sharing Mode is ON"}
                </button>
                {!neigh ? (
                  <>
                    <button
                      className="bg-back text-text px-6 py-3"
                      onClick={() => setNeigh(!neigh)}
                    >
                      {user.userType === "RegularUser"
                        ? "See Near By Users"
                        : "Those who need Resources"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-back text-text px-6 py-3"
                      onClick={() => {
                        antiDriver();
                        setNeigh(!neigh);
                      }}
                    >
                      Switch Off
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                className="bg-back text-text px-6 py-3"
                onClick={() => {
                  setDriverMode(!driverMode);
                }}
              >
                Driver Mode is OFF
              </button>
            )}
          </>
          {driverMode && neigh && data && data.length !== 0 && (
            <div className="font-mono text-text bg-back z-4">
              {!notifyAll && (
                <button
                  className="bg-text text-back px-4 py-2 rounded-xl m-2"
                  onClick={() => {
                    notifyAllControlPostive();
                    setnotifyAll(true);
                  }}
                >
                  Notify Everyone
                </button>
              )}
              {notifyAll && (
                <>
                  <button
                    className="bg-text text-back px-4 py-2 rounded-xl m-2"
                    onClick={() => setnotifyAll(false)}
                  >
                    Interupt the process
                  </button>
                </>
              )}
              <table className="text-auto mx-4 rounded-xl border-separate border-spacing-2 border border-text">
                <thead className="text-2xl">
                  <tr className=" bg-text text-back">
                    <th className="border-b border-t border-text">
                      ProfilePic
                    </th>
                    <th className="border-b border-t border-text">Name</th>
                    <th className="border-b border-t border-text">Phone</th>
                    <th className="border-b border-t border-text">Distance</th>
                    <th className="border-b border-t border-text">DL No</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-lg">
                  {data.map((driver) => (
                    <tr key={driver.userId}>
                      <td>
                        <img
                          src={driver.profilePic}
                          alt="ProfilePic"
                          className="h-[10vh] rounded-full border-2 border-text/70"
                        />
                      </td>
                      <td className="border-r border-l border-text px-2 cursor-pointer">
                        {driver.name}
                      </td>
                      <td className="border-r  border-text cursor-pointer">
                        {driver.phone}
                      </td>
                      <td className="border-r border-text cursor-pointer">
                        {driver.distance} Km
                      </td>
                      <td className="border-r border-text cursor-pointer">
                        {driver.dlNo}
                      </td>
                      <td>
                        {notifyAll && (
                          <>
                            <div className="flex flex-row">
                              <button
                                className="bg-text text-back flex flex-row m-1 hover:bg-back rounded-xl px-2 py-4 hover:text-text"
                                onClick={() => {
                                  setCancel(true);
                                  setId(driver.userId);
                                  cancelTrans(driver.userId);
                                }}
                              >
                                Cancel Order ?
                                <RxCross1
                                  className="fill-back hover:fill-text"
                                  size={23}
                                />
                              </button>
                              <button
                                className="bg-text text-back flex flex-row m-1 hover:bg-back rounded-xl px-2 py-4  hover:text-text"
                                onClick={() => {
                                  setSucc(true);
                                  setId(driver.userId);
                                  successTrans(driver.userId);
                                }}
                              >
                                Deal Done{" "}
                                <FaRegFaceSmileWink
                                  className="fill-back hover:fill-text"
                                  size={23}
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {theme === "streets-v2" ? (
            <button
              className="bg-back text-text flex flex-row justify-center px-6 py-3 rounded-xl"
              onClick={() => setTheme("streets-v2-dark")}
            >
              Select Dark Theme
            </button>
          ) : (
            <button
              className="bg-back text-text flex flex-row justify-center px-6 py-3 rounded-xl"
              onClick={() => setTheme("streets-v2")}
            >
              Select Light Theme
            </button>
          )}
        </Navbar>
      </div>
    </>
  );
}

export default Main;
