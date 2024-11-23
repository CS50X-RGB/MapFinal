import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDCUfMEYF9C9F0qD4LGLMkGqnXDpaSDZl4",
  authDomain: "map-server-c2509.firebaseapp.com",
  projectId: "map-server-c2509",
  storageBucket: "map-server-c2509.firebasestorage.app",
  messagingSenderId: "733403763407",
  appId: "1:733403763407:web:d77f453a21507f4c5c1dba",
  measurementId: "G-ZHRPM81LXT"
};


export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

