import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard"; // adjust path if it's elsewhere
import DriverLogin from "./components/DriverLogin"; 
import Driverhomepage from "./components/Driverhomepage";
import LiveMap from "./components/LiveMap";
import Attendance from './components/Attendance';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-homepage" element={<Driverhomepage /> } />
        <Route path="/livemap" element={<LiveMap />} />
        <Route path="/attendance" element={<Attendance />} />



      </Routes>
    </Router>
  );
}

export default App;