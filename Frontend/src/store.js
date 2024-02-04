import { configureStore } from "@reduxjs/toolkit";
import './cart/authSlice.jsx';
import authReducer from "./cart/authSlice.jsx";

export const store = configureStore({
        reducer: {
                auth: authReducer,
        }
})