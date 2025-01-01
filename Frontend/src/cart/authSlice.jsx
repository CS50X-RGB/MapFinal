import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialAuthState = localStorage.getItem("Map_0_Share");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialAuthState !== "undefined" ? initialAuthState : null,
    isAuth: !!initialAuthState && initialAuthState !== "undefined",
    user: null, // Use `null` to indicate no user data initially
  },
  reducers: {
    login: (state, action) => {
      const { user } = action.payload; 
      console.log(action.payload, "Token in slice");
      
      state.isAuth = true;
      state.user = user || {}; 
      state.token = localStorage.getItem("Map_0_Share");
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("Map_0_Share"); 
    },
    reset: (state) => {
      state.isAuth = false;
      state.user = {};
      state.token = null;
    },
  },
});

export const { login, logout,reset } = authSlice.actions;

export default authSlice.reducer;
