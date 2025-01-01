import { configureStore } from "@reduxjs/toolkit";
import './cart/authSlice.jsx';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./cart/authSlice.jsx";
import authMiddleware from "./cart/authMiddleare.jsx";

const persistConfig = {
  key: "root",
  storage
}
const persistAuthData = persistReducer(persistConfig, authSlice);
export const store = configureStore({
  reducer: {
    auth: persistAuthData,
  },
  middleware : (getDefaultMiddleware)  => 
    getDefaultMiddleware({
       serializableCheck : {
        ignoreActions : ['persist/PERSIST','persist/REHYDRATE']
      }
    }).concat(authMiddleware),
})
export const persistor = persistStore(store);
