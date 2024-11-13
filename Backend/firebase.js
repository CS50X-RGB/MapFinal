import admin from "firebase-admin";
import { google } from "googleapis";
import * as https from "https";
import serviceAccount from "./data/map-server-c2509-firebase-adminsdk-p3kxl-937061eb62.json";

const PROJECT_ID = 'map-server-c2509';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: PROJECT_ID,
});

/**
 * Get a valid access token.
 */
export function getAccessToken() {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      SCOPES,
      null
    );

    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

/**
 * Send FCM message using Firebase Admin SDK
 * @param {object} fcmMessage - The message payload
 */
function sendFcmMessage(fcmMessage) {
  getAccessToken().then(accessToken => {
    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    };

    const request = https.request(options, (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (data) => {
        console.log('Message sent to Firebase for delivery, response:', data);
      });
    });

    request.on('error', (err) => {
      console.log('Unable to send message to Firebase:', err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  }).catch((error) => {
    console.error("Error obtaining access token:", error);
  });
}


