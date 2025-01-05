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
        console.log(true);
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
        const userId = String(req.user._id);
        const userLoc = await redis.geopos('driverLocations', userId);

        const [lon, lat] = userLoc[0];
 

        const nearbyDrivers = await redis.georadius(
            'driverLocations',
            lon,
            lat,
            parseFloat(r),
            'km',
            'WITHDIST'
        );

        const nearbyDriversWithInfo = await Promise.all(
            nearbyDrivers.map(async (driver) => {
                const userId = driver[0];
                if (userId === req.params.userId) {
                    return null;
                }
                if(userId === req.user._id){
                   return null;
                }
                const [driverLon, driverLat] = await redis.geopos('driverLocations', userId);
                const userData = await redis.hget('userData', userId);
                const { name, phone, dlNo } = JSON.parse(userData);
                const profilePic = await redis.hget('profilePic', userId);
                const distance = driver[1];

                return {
                    userId,
                    name,
                    phone,
                    dlNo,
                    latitude: driverLat,
                    longitude: driverLon,
                    distance,
                    profilePic
                };
            })
        );

        const filteredNearbyDriversWithInfo = nearbyDriversWithInfo.filter(driver => driver !== null);
        if (filteredNearbyDriversWithInfo.length === 0) {
            res.json({
                message: "No drivers found",
            });
        }

        res.status(200).json({
             success : true,
             nearbyDrivers: filteredNearbyDriversWithInfo
          });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
;

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
