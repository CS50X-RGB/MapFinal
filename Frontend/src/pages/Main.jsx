import React, { useEffect, useState } from "react";
import { Map, NavigationControl, Marker, Popup } from "react-map-gl";
import { Button ,Spinner,Modal,Avatar,User, ModalContent,Table,TableColumn,TableHeader,TableBody,TableRow, ModalHeader, ModalBody, ModalFooter,TableCell, useDisclosure,Switch} from "@nextui-org/react";
import Navbar from "../components/navbar.jsx";
import { MoonIcon,SunIcon } from "../assests/Icons.jsx";
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../index.css";
import { locationRoutes, notifyRoutes } from "../core/apiRoutes.js";
import {postData,deleteData, getData, putData} from "../core/apiHandler"
import { fetchPetrolPumps } from "../utils/getPetrolPumps.jsx";
import {
  PetrolPumpLayer,
  ChargingPointsLayer,
  ResourcePointsLayer,
} from "../utils/PetrolPumps.jsx";
import LatLonToKM from "../utils/LatLonToKM.jsx";
import { fetchChargingStations } from "../utils/getChargingPoints.jsx";
import { useSelector } from "react-redux";
import { FaRegFaceSmileWink } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { useMutation, useQuery } from "@tanstack/react-query";
import sendFirebaseToken, { requestPermission } from "../utils/Notifications.js";



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
 const {isOpen : isOpenNeigh, onOpen : onOpenNeigh, onOpenChange : onOpenChangeNeigh} = useDisclosure();
  const [neighDriver, setneighDriver] = useState(null);
  const [theme, setTheme] = useState("streets-v2");
  const { user } = useSelector((state) => state.auth);
  const [succ, setSucc] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [notifyAll, setnotifyAll] = useState(false);
  const [id, setId] = useState(null);
  const columns = [
    "User Name",
     "Phone",
     "Distance",
     "Driving License",
     "Actions" 
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { coords } = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        requestPermission(); 
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
  const [r,setR] = useState(100);
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
  const notifySingle = useMutation({
    mutationKey : ["notifySingle"],
    mutationFn : (user) => {
      const body = {
        userId : user.userId,
        message: `${user.name} wants help for more details you can call on ${user.phoneno} 
              the consumer is ${user.distance} Km away from your current location`,
      }
      return postData(notifyRoutes.singleNotify,{},body);
    }
  })
  const notifyAllControlPostive = useMutation({
     mutationKey : ["notifyAllControlPostive"],
      mutationFn : (data) => {
        console.log(data);
        const userId = data.map(item => item.userId);
        const body ={
            userId,
            message: `${user.name} wants help for more details you can call on ${user.phoneno} 
              the consumer is ${data.distance} Km away from your current location`,
       }
       return postData(notifyRoutes.allNotify,{},body);
     } 
  })
  const notiftAllControlNegative = useMutation({
     mutationKey : ["notifyAllControlNegative"],
    mutationFn : (userId) => {
     const body = {
        userId,
        message: `${user.name} will be penalized`,
      }  
        return postData(notifyRoutes.allNotify,{},body);
    }
  });
  const antiDriver = useMutation({
     mutationKey: ["antiDriver"],
     mutationFn : () => {
        return deleteData(locationRoutes.deleteLoc,{},{});
    }
  });
   const driMode = useMutation({
      mutationKey : ["driMode"],
      mutationFn : () => {
            return postData(locationRoutes.updateLoc,{},location);
      }
  })
  const tokenSender = async () => {
      await sendFirebaseToken();
       driMode.mutate();
  }
 const {data :getNeighbours,isFetching : isFetchingNeigh,isFetched: isFetchedNeigh} = useQuery({
  queryKey : ["getNeighbours",r],
  queryFn : () => {
     return getData(`/location/nearby/${r}`,{}); 
  },
 });
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        if (driverMode) {
          const res = driMode.mutate();
          console.log(res);
        }
      } catch (error) {
        console.error("Error in interval:", error);
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, [driverMode]);

  useEffect(() => {
    if (notifyAll && driverMode && neigh) {
      notifyAllControlPostive.mutate(data);
    } else if (!notifyAll && driverMode && neigh) {
      notiftAllControlNegative.mutate(data);
    }
  }, [notifyAll, data]);
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (neigh && driverMode) {
          const res = getNeighbours;
          onOpenNeigh(); 
          if (isFetchedNeigh && res.data) {
            const filteredNearbyDrivers = res.data.nearbyDrivers.filter(
              (driver) => Math.abs(driver.distance) > 0.001
            );
            setData(filteredNearbyDrivers);
            setneighDriver(plotGJSONPoints(filteredNearbyDrivers));
            setData(filteredNearbyDrivers);
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

   const cancelTrans = useMutation({
     mutationKey  : ["cancelTrans"],
     mutationFn : (driverId) =>{
       const selectedDriver = data.find((driver) => driver.userId === driverId); 
       const body = {
          id: selectedDriver.userId,
       }
      return putData('/users/UnsucessTrans',{},body);
    },
    onSuccess : (data) => {
        setId(null);
        setnotifyAll(false);
        setNeigh(false);
        setDriverMode(false);
   },
   onError : (error) => {
       console.error(error);
     }
  });

  const successTrans = useMutation({
       mutationKey : ["successTrans"],
       mutationFn : (driverId) => {
      const selectedDriver = data.find((driver) => driver.userId === driverId);
       const body = {
          id: selectedDriver.userId,
       }
      return putData('/users/sucessTrans',{},body);
    },
    onSuccess : (data) => {
        setId(null);
        setnotifyAll(false);
        setNeigh(false);
        setDriverMode(false);
   },
   onError : (error) => {
       console.error(error);
     } 
  }); 
 
  const handleSuccess = async () => {
    await successTrans.mutate(id);
  };
  const Failure = async () => {
    await cancelTrans.mutate(id);
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
    return (
    <div className="flex bg-background flex-col justify-center items-center h-[100vh]">
      <h1 className="text-2xl font-mono font-bold">
            <Spinner title="Loading Details" />
        </h1>
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
            <Button
              onClick={() => setActive(!active)}
              className="bg-back text-text px-6 py-3"
            >
              See Liquid Resources
            </Button>
            <Button
              onClick={() => setActive1(!active1)}
              className="bg-back text-text px-6 py-3"
            >
              See electric{" "}
            </Button>
            {driverMode ? (
              <>
                <Button
                  className="bg-back text-text px-6 py-3"
                  onPress={() =>{
                   setDriverMode(!driverMode);
                }}
                >
                  {user?.userType === "RegularUser"
                    ? "DriverMode is ON"
                    : "Sharing Mode is ON"}
                </Button>
                {!neigh ? (
                  <>
                    <Button
                      className="bg-back text-text px-6 py-3"
                      onClick={() => setNeigh(!neigh)}
                    >
                      {user?.userType === "RegularUser"
                        ? "See Near By Users"
                        : "Those who need Resources"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-back text-text px-6 py-3"
                      onClick={() => {
                        antiDriver.mutate();
                        setNeigh(!neigh);
                      }}
                    >
                      Switch Off
                    </Button>
                  </>
                )}
              </>
            ) : (
              <Button
                className="bg-back text-text px-6 py-3"
                onClick={() => {
                    tokenSender();
                  setDriverMode(!driverMode);
                }}
              >
                Driver Mode is OFF
              </Button>
            )}
          </>
          <Modal size="full" className="bg-back w-full h-full flex justify-center" isOpen={isOpenNeigh} onOpenChange={onOpenChangeNeigh}>
          <ModalContent>
          {(onClose) => (
          <>
          <ModalHeader className="text-text text-2xl font-mono">User Details</ModalHeader>
          {isFetchedNeigh ? (
            <div className="font-mono text-text bg-back z-4">
              {!notifyAll && (
                <Button
                  className="bg-text text-back px-4 py-2 rounded-xl m-2"
                  onClick={() => {
                    notifyAllControlPostive();
                    setnotifyAll(true);
                  }}
                >
                  Notify Everyone
                </Button>
              )}
              {notifyAll && (
                <>
                  <Button
                    className="bg-text text-back px-4 py-2 rounded-xl m-2"
                    onClick={() => setnotifyAll(false)}
                  >
                    Interupt the process
                  </Button>
                </>
              )}
            <ModalBody>
              <Table removeWrapper classNames={{
                 base : "bg-back b-0 m-0 p-0",
                td : "text-md lg:text-lg font-semibold",
                 table : "bg-back shadow-xl shadow-blue-500 rounded-xl",
                 th : "bg-back text-text border-b border-blue-400 py-5 font-mono text-2xl font-bold"
              }}>
                <TableHeader className="text-2xl"> 
                    {columns.map((c,index) => {
                         return <TableColumn key={index}>{c}</TableColumn>
                     })}
                </TableHeader>
                {data && data?.length > 0 ? 
                <TableBody className="font-mono bg-back text-2xl">
                  {data?.map((driver) => (
                    <TableRow key={driver.userId}>
                      <TableCell>
                        <User
                         name={driver.name}
                         avatarProps={{
                             src : driver?.profilePic,
                            size : "lg"
                          }}
                          alt="ProfilePic" 
                          className="rounded-full text-xl"
                        />
                      </TableCell>
                      <TableCell className="cursor-pointer">
                        {driver.phone}
                      </TableCell>
                      <TableCell className="cursor-pointer">
                        {driver.distance} Km away
                      </TableCell>
                      <TableCell className="cursor-pointer">
                        {driver.dlNo}
                      </TableCell>
                      <TableCell>
                           <Button onClick={() => {
                                  notifySingle.mutate(driver);
                           }} className="bg-text text-back shadow-xl">
                                Notfiy User{" "}
                            </Button>
                        {notifyAll && (
                          <>
                             <Button
                             className="bg-text text-text"
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
                              </Button>
 
                            <div className="flex flex-row">
                              <Button
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
                              </Button>
                              <Button
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
                              </Button>
                            </div>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
           : <TableBody emptyContent={"No Users are near You"}/>
              }
              </Table>
            </ModalBody>
            </div>
          ): (
             <Spinner className="font-mono" classNames={{
                     circle1 : "bg-text",
                     label : "text-text text-xl"
              }} label="Loading Users Details" />
        )} 
      </>
       )}
      </ModalContent>
        </Modal>
          {theme === "streets-v2" ? (
            <Button
              className="bg-back text-text flex flex-row justify-center px-6 py-3 rounded-xl"
              onClick={() => setTheme("streets-v2-dark")}
            >
              <MoonIcon /> Select Dark Theme
            </Button>
          ) : (
            <Button
              className="bg-back text-text flex flex-row justify-center px-6 py-3 rounded-xl"
              onClick={() => setTheme("streets-v2")}
            >
             <SunIcon /> Select Light Theme
            </Button>
          )}
         </Navbar>
      </div>
    </>
  );
}

export default Main;
