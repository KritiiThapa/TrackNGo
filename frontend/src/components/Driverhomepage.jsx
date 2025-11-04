import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Driverdashboard.css";

const Driverhomepage = () => {
  const location = useLocation();
  const passedCount = location.state?.count;
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("Hello!");
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [routeName, setRouteName] = useState("Route A");
  const [authorized, setAuthorized] = useState(false); // ✅ auth flag

  // ✅ Role check (runs first)
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (!userRole) {
      alert("Please log in first.");
      navigate("/login");
    } else if (userRole === "parent") {
      alert("Access denied! Only drivers can view this page.");
      navigate("/dashboard");
    } else if (userRole === "driver") {
      setAuthorized(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Main logic (still runs but does nothing until authorized = true)
  useEffect(() => {
    if (!authorized) return; // prevent running before auth check done

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 🌅");
    else if (hour < 17) setGreeting("Good afternoon ☀️");
    else setGreeting("Good evening 🌙");

    if (passedCount !== undefined) {
      setAttendanceCount(passedCount);
    }

    const socket = io("http://localhost:3000");

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
  }, [authorized, passedCount]);

  // ✅ Early return AFTER all hooks
  if (!authorized) return null;

  // === Render UI ===
  return (
    <div
      className="page-container"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--background, #f5f5f5)",
        color: "var(--text, #222)",
      }}
    >
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
