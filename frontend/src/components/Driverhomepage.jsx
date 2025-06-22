import React, { useEffect, useState } from "react";
import './Dashboard.css';

const Driverhomepage = () => {
  const [greeting, setGreeting] = useState("Hello!");
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [routeName, setRouteName] = useState("Route A");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 🌅");
    else if (hour < 17) setGreeting("Good afternoon☀️");
    else setGreeting("Good evening🌙");

    // Simulate live attendance
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setAttendanceCount(count);
      if (count === 25) clearInterval(interval);
    }, 100);
  }, []);

  return (
    <div className="page-container" style={{ display: "flex", minHeight: "100vh", background: "var(--background)", color: "var(--text)" }}>
      <aside className="sidebar">
        <h2>🚍 TrackMyBus</h2>
        <a href="#">🏠 Driver Dashboard</a>
        <a href="http://localhost:3000/live" target="_blank" rel="noopener noreferrer">📍 Live Map</a>
        <a href="#">✅ Take Attendance</a>
        <a
          href="/driver-login"
          onClick={() => {
            localStorage.removeItem("driver");
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
