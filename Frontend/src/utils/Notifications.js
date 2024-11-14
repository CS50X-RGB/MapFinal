import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";

export function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  })
}


export async function sendFirebaseToken() {
    const m = messaging;
    return getToken(m, { vapidKey: process.env.FIREBASE_VAPID_KEY })
        .then((currentToken) => {
            if (currentToken) {
                  
            } else {
                console.log("No Firebase token available. Request permission to generate one.");
            }
        })
        .catch((err) => {
            console.error("An error occurred while retrieving token: ", err);
        });
}

