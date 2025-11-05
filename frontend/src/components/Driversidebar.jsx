import { Link } from "react-router-dom";
import './Driverdashboard.css';
import { useAuth } from "../context/AuthContext";
// console.log("Sidebar is rendering");


const Driversidebar = () => {
  const { logout } = useAuth();
  return (
 <aside className="sidebar">
        <h2>🚍 TrackNGo</h2>
        <Link to="/driver-homepage">🏠 Driver Dashboard</Link>
      <Link to="/driver-homepage/livemap">📍 Live Map</Link>
        <Link to="/driver-homepage/attendance">✅ Take Attendance</Link>
        <Link
          to="/driver-login"
          onClick={() => {
            localStorage.removeItem("driver");
            logout();
          }}
        >
          🚪 Logout
        </Link>
    </aside>
  );
};

export default Driversidebar;