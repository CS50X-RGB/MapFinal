import User from "../Models/user.js";
import redis from "../server.js";

export const UpdateLoc = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        await redis.geoadd('driverLocations', longitude, latitude, String(req.user._id));
        const name = req.user.name;
        const id = req.user._id;
        const user = await User.findByIdAndUpdate(id,
          {
             active : true
          },
          {
            new : true
          }
        );
 
        if(!user){
            return res.status(404).json({
              success : false,
              message : "User update active not occuring"
           });
        }
        const phone = req.user.phoneno;
        const dlNo = req.user.dLNo;
        const profilePic = req.user.profilePic;
        await redis.hset('userData', id, JSON.stringify({ name, phone, dlNo }));
        await redis.hset('profilePic', id, profilePic);
        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};



export const getNearby = async (req, res) => {
    try {
        const { r } = req.params;
        const userId = String(req.user?._id); // Safely retrieve user ID

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        const userLoc = await redis.geopos('driverLocations', userId);
        // Check if userLoc exists and contains valid coordinates
        if (!userLoc || !userLoc[0]) {
            return res.status(404).json({
                success: false,
                message: "User location not found in driverLocations.",
            });
        }

        const [lon, lat] = userLoc[0];

        const nearbyDrivers = await redis.georadius(
            'driverLocations',
            lon,
            lat,
            parseFloat(r),
            'km',
            'WITHDIST'
        ); 
        // Check if there are nearby drivers
        if (!nearbyDrivers || nearbyDrivers.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No nearby drivers found.",
            });
        }

        const nearbyDriversWithInfo = await Promise.all(
            nearbyDrivers.map(async (driver) => {
                const driverId = driver[0];
                // Skip if the driver is the requesting user
                if (driverId === req.params.userId || driverId === userId) {
                    return null;
                }

                const [driverLon, driverLat] = await redis.geopos('driverLocations', driverId);

                /*if (!driverLon || !driverLat) {
                    return null; // Skip if driver location is invalid
                }
*/

                const userData = await redis.hget('userData', driverId);
                // console.log(userData,"userId");
                const { name, phone, dlNo } = JSON.parse(userData);
                const profilePic = await redis.hget('profilePic', driverId);
                const distance = driver[1];
                return {
                    userId: driverId,
                    name,
                    phone,
                    dlNo,
                    latitude: driverLon[1],
                    longitude: driverLon[0],
                    distance,
                    profilePic,
                };
            })
        );
      //  console.log(nearbyDriversWithInfo,"Nearby");
        // Filter out null results
        const filteredNearbyDriversWithInfo = nearbyDriversWithInfo.filter(driver => driver !== null);

        if (filteredNearbyDriversWithInfo.length === 0) {
            return res.status(400).json({
                success: true,
                message: "No drivers found with complete information.",
            });
        }

        res.status(200).json({
            success: true,
            nearbyDrivers: filteredNearbyDriversWithInfo,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const RemoveFromList = async (req, res) => {
    try {
      const userId = String(req.user._id);
      await redis.zrem('driverLocations', userId);
      await redis.hdel('userData', userId);
      await redis.hdel('profilePic', userId);
      //remove 
      const user = await User.findByIdAndUpdate(req.user._id,{ active : false }, {new : true});
      res.status(200).json({
        message : "Updated Information", 
        success: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };
  

export default { UpdateLoc, getNearby, RemoveFromList };
