import admin from "firebase-admin";
import { config } from "dotenv";
import fs from "fs";

config({
  path: "./data/config.env",
});

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;


const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
});


export const singleMessaging = async (token,message) => {
   const messagestruct = {
    data :
    {
      message
    },
    notification: {
      title: 'Map-0-Share',  
       body: message  
    },
    token : token
   }
   await admin.messaging().send(messagestruct).then((response) => {
    console.log(`Notification send`,response);
  }).catch((error) => {
      console.error('Error sending notification:', error);
  });
}
export const multiMessaging = (tokens,message) => {
 const messagestruct = {
    data :
    {
      message
    },
    tokens : tokens
   };
  admin.messaging().sendMulticast(messagestruct).then((response) => {
        console.log('Multicase notification sent:',response);
  }).catch((error) => {
    console.error('Error sending multicast notification:', error);
  });
}
/*
const PROJECT_ID = 'map-server-c2509'
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];
export function getAcessToken(){
  return new Promise((resolve,reject) => {
      const key = serviceAccount;
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
     );
    jwtClient.authorize((err,tokens) => {
       if(err){
         reject(err);
         return;
       }
       resolve(tokens.access_token);
    })
  })
}

function sendFcmMessage(fcmMessage) {
  getAccessToken().then(function(accessToken) {
    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      // [START use_access_token]
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
      // [END use_access_token]
    };

    const request = https.request(options, function(resp) {
      resp.setEncoding('utf8');
      resp.on('data', function(data) {
        console.log('Message sent to Firebase for delivery, response:');
        console.log(data);
      });
    });

    request.on('error', function(err) {
      console.log('Unable to send message to Firebase');
      console.log(err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  });
}
*/
