import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./components/Login";
import Home from "./components/Home";
import ParentMap from "./components/ParentMap";
import DriverMap from "./components/DriverMap";
import Dashboard from "./components/Dashboard";
import DriverLogin from "./components/DriverLogin"; 
import Driverhomepage from "./components/Driverhomepage";
// import LiveMap from "./components/LiveMap";
import Attendance from './components/Attendance';
import Layout from "./components/Layout";
import Layoutdriver from "./components/Layoutdriver";
import Driversidebar from "./components/Driversidebar";
import InfoDriver from "./components/InfoDriver";
import ImageTest from "./components/ImageTest";
import SimpleMap from "./components/SimpleMap";


function App() {
  return (
     <AuthProvider>
      <Router>
        <Routes>
          {/* Login routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/driver-login" element={<DriverLogin />} />

          {/* Parent routes */}
          <Route path="/" element={<PrivateRoute allowedRoles={["parent"]}><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="livemap" element={<ParentMap />} />
            <Route path="drivers" element={<InfoDriver />} />
          </Route>

          {/* Driver routes */}
          <Route path="/driver-homepage" element={<PrivateRoute allowedRoles={["driver"]}><Layoutdriver /></PrivateRoute>}>
            <Route index element={<Driverhomepage />} />
            <Route path="livemap" element={<DriverMap />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>

          {/* Test routes */}
          <Route path="/test-images" element={<ImageTest />} />
          <Route path="/test-simple" element={<SimpleMap />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;