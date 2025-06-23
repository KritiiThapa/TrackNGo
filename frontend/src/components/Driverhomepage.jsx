import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import './Dashboard.css';
import LiveMap from "./LiveMap";

const Driverhomepage = () => {
  const location = useLocation();
  const passedCount = location.state?.count;

  const [greeting, setGreeting] = useState("Hello!");
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [routeName, setRouteName] = useState("Route A");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 🌅");
    else if (hour < 17) setGreeting("Good afternoon☀️");
    else setGreeting("Good evening🌙");

    if (passedCount !== undefined) {
      setAttendanceCount(passedCount);
    }

    const userRole = localStorage.getItem("userRole"); // Get the role
    if (userRole === "driver") {
      const socket = io("http://localhost:3000"); // Adjust for your backend

      function sendLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            socket.emit("driverLocationUpdate", coords);
          });
        } else {
          console.warn("Geolocation not supported");
        }
      }

      const locationInterval = setInterval(sendLocation, 5000);
      sendLocation();

      return () => {
        clearInterval(locationInterval);
        socket.disconnect();
      };
    }
  }, [passedCount]);

  return (
    <div className="page-container" style={{ display: "flex", minHeight: "100vh", background: "var(--background, #f5f5f5)", color: "var(--text, #222)" }}>
      <aside className="sidebar">
        <h2>🚍 TrackNGo</h2>
        <a href="/driver">🏠 Driver Dashboard</a>
        <a href="http://localhost:3000/live?role=driver" target="_blank" rel="noopener noreferrer">📍 Live Map</a>
        <a href="/attendance">✅ Take Attendance</a>
        <a
          href="/driver-login"
          onClick={() => {
            localStorage.removeItem("driver");
            localStorage.removeItem("userRole"); 
          }}
        >
          🚪 Logout
        </a>
      </aside>

      <main className="main">
        <nav className="navbar">
          <div className="logo">Driver Panel</div>
          <div className="nav-right">
            <span className="greeting">{greeting}</span>
          </div>
        </nav>

        <section className="dashboard">
          <div className="card">
            <div className="card-icon">🗺️</div>
            <h3>Assigned Route</h3>
            <p>{routeName}</p>
          </div>

          <div className="card">
            <div className="card-icon">🧒✅</div>
            <h3>Attendance Taken</h3>
            <p>{attendanceCount}</p>
          </div>

          <div className="card">
            <div className="card-icon">📍</div>
            <h3>Live Tracking</h3>
            <p>Enabled</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Driverhomepage;
