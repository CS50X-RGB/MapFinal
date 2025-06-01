import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/Main.jsx";
import MainCopy from "./pages/MainCopy.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import "./index.css";
import { useSelector,useDispatch } from "react-redux";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./pages/FogotPassword.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import Prices from "./pages/Rates.jsx";
import Home from "./pages/LandingPage.jsx";


export default function App() {
  const { isAuth } = useSelector((state) => state.auth); 

  
  return (
    <Routes>
      {isAuth  ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/main" element={<MainCopy />} />
          <Route path="/register" element={<Navigate to="/main" />} />
          <Route path="/login" element={<Navigate to="/main" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetPassword/:resetIdentifier" element={<ResetPassword />} />
          <Route path="/rates" element={<Prices />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Navigate to="/register" />} />
          <Route path="/main" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetPassword/:resetIdentifier" element={<ResetPassword />} />
          <Route path="/rates" element={<Navigate to="/login" />} />
        </>
      )
      }
    </Routes >
  );
}
