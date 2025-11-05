// Layout.jsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Driversidebar from "./Driversidebar";
import './Driverdashboard.css';
import { useAuth } from "../context/AuthContext";

function Layoutdriver() {
 const { user, loading } = useAuth();

  if (loading) return null;

  // redirect if not logged in or role mismatch
  if (!user || user.role !== "driver") {
    return <Navigate to="/driver-login" replace />;
  }
  return (
    <div className="driverlayout-container">
      <Driversidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );

}

export default Layoutdriver;