import { useMutation } from "@tanstack/react-query";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../firebase";
import { postData } from "../core/apiHandler";
import { authRoutes } from "../core/apiRoutes";

export function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  })
}

  const messaging = getMessaging(app);
export default async function sendFirebaseToken() {
   return getToken(messaging, { vapidKey: "BDKK21GIFafFzHCpKJ2GnsiAf-0woWSadCA2RnR_6bDWh6dOz3JxfmVk2VZOupvcElThwyrJ1ebKto_IfWJU-NY" })
        .then(async (currentToken) => {
            if (currentToken) {
                 console.log(currentToken,"token");
                  const token = {
                    fcmToken : currentToken
                 }
               const response = await postData(authRoutes.sendToken,{},token);
               console.log(response);
            } else {
                console.log("No Firebase token available. Request permission to generate one.");
            }
        })
        .catch((err) => {
            console.error("An error occurred while retrieving token: ", err);
        });
}
export async function deleteToken(){
        return deleteToken(messaging).then(() => {
            console.log("Delete Token done");
        }).catch((err) => {
            console.log('Unable to delete Token',err);
        })
}
