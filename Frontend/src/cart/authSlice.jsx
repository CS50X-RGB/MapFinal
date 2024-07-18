import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialAuthState = Cookies.get("auth") === "true";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: initialAuthState,
    user: {}
  },
  reducers: {
    login: (state, action) => {
      state.isAuth = action.payload.token;
      state.user = action.payload.user;
      console.log(action.payload);
      if (localStorage.getItem("Map_0_Share") !== "undefined") {
        Cookies.set("auth", true, { sameSite: "None", secure: true });
      }
    },
    logout: (state, action) => {
      state.isAuth = false;
      state.user = null;
      if (localStorage.getItem("Map_0_Share") !== "undefined") {
        Cookies.set("auth", false, { sameSite: "None", secure: true });
      }
      localStorage.removeItem("Map_0_share");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
