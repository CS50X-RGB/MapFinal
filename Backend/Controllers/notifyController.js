import PushNotifications from "@pusher/push-notifications-server";
import User from "../Models/user.js";
//import { multiMessaging, singleMessaging } from "../firebase.js";
import sendNotifcationSendAll from "../utils/notificationSender.js";

/*
const beamsClient = new PushNotifications({
        instanceId: "c41a756e-0c26-4252-9373-43bff3466a8b",
        secretKey: "B28F08010F5773E93A0CD71CC50B528AED7A6ACFAB2D95BAA2541B8559C2E51B",
});

export const sendNotificationAll = async (req, res) => {
   try {
      const { userIds, message } = req.body;
      const users = await User.find({
         _id: { $in: userIds }
      }, 'fcmToken');
      const tokens = users.map(user => user.fcmToken).filter(token => token);
      if (tokens.length == 0) {
         return res.status(404).json({
            success: false,
            message: 'No FCM Tokens found'
         })
      }
      const multi = await multiMessaging(tokens, message);
      console.log(multi);
      return res.status(200).json({
         success: true,
         message: "Notifications Sent"
      })
   } catch (error) {
      return res.status(500).json({
         success: false,
         err: error,
         message: "Internal Server Error"
      });
   }
}
*/
export const sendNotification = async (req, res) => {
   try {
      const { userId, message } = req.body;
      const { data, status } = await sendNotifcationSendAll(userId, message);
      console.log(data);
      if (status !== 200) {
         return res.status(status).json({
            success: false,
            message: 'Notification sent failed',
         });
      }
      //   const { fcmToken } = await User.findById(userId,'fcmToken');
      //   const messaging = await singleMessaging(fcmToken,message);
      //   console.log(messaging,"messaging");
      //   if(!messaging || !token){
      //         return res.status(400).json({
      //             success : false,
      //             err : "Sending message failed or token not found for user",
      //             message: 'Notification sent failed',
      //   });
      //   }
      return res.status(200).json({
         success: true,
         message: 'Notification sent',
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         error: "Internal Server Error"
      });
   }
}


export default { sendNotification };
