import { configureStore } from "@reduxjs/toolkit";
import './cart/authSlice.jsx';
import authReducer from "./cart/authSlice.jsx";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./cart/authSlice.jsx";

const persistConfig = {
  key: "root",
  storage
}
const persistAuthData = persistReducer(persistConfig, authSlice);
export const store = configureStore({
  reducer: {
    auth: persistAuthData,
  }
})
export const persistor = persistStore(store);
