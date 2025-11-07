import { Link } from "react-router-dom";
import './Dashboard.css'; // Put your CSS here
import { useAuth } from "../context/AuthContext";
// console.log("Sidebar is rendering");


const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
  
      <h2>🚍 TrackNGo</h2>
      <Link to="/dashboard">🏠 Dashboard</Link>
      
      <Link to="/drivers">👨‍✈️ Drivers</Link>
      <Link to="/livemap">📍 Live Map</Link>
      
      <Link
        to="/login"
        onClick={() => {
          localStorage.removeItem("user");
          logout();
        }}
      >
        🚪 Logout
      </Link>
    </aside>
  );
};

export default Sidebar;