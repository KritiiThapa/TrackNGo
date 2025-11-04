// frontend/src/components/DriverMap.jsx
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom"; // ✅ for redirection

// === SOCKET CONNECTION ===
const socket = io("http://localhost:5001", {
  transports: ["websocket", "polling"],
});

console.log("🔌 Driver Map - Socket instance created");

socket.on("connect", () => {
  console.log("✅✅✅ DRIVER CONNECTED TO SERVER - Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("❌ Driver connection error:", error);
});

// === STATIC PICKUP POINTS ===
const PICKUP_POINTS = [
  { lat: 27.7172, lng: 85.3240, name: "Child 1 - School Gate" },
  { lat: 27.7200, lng: 85.3200, name: "Child 2 - Park Area" },
  { lat: 27.7150, lng: 85.3280, name: "Child 3 - Main Road" },
  { lat: 27.7220, lng: 85.3220, name: "Child 4 - Community Center" },
];

// FIX FOR LEAFLET DEFAULT MARKERS
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DriverMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const initializedRef = useRef(false);
  const routeLineRef = useRef(null);

  const [status, setStatus] = useState("Initializing...");
  const [authorized, setAuthorized] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [destinationReached, setDestinationReached] = useState(false);
  const [autoClearTimer, setAutoClearTimer] = useState(null);
  const [showNextPickup, setShowNextPickup] = useState(false);

  // ✅ ROLE CHECK
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

  // ✅ MAIN MAP LOGIC
  useEffect(() => {
    if (!authorized) return; // wait until driver is authorized
    if (initializedRef.current) {
      console.log("🚫 Map already initialized, skipping...");
      return;
    }

    if (!mapRef.current || !L) {
      console.log("❌ Map container or Leaflet not ready");
      return;
    }

    try {
      console.log("🚀 Initializing driver map...");
      initializedRef.current = true;
      setStatus("Creating map...");

      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([27.7172, 85.3240], 14);
      console.log("✅ Map instance created");

      // Add base layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
      console.log("✅ Tile layer added");

      // Add pickup points
      PICKUP_POINTS.forEach((point, index) => {
        const popupContent = `
          <div style="text-align:center;min-width:150px;">
            <b>${point.name}</b><br/>
            <small>Pickup Location</small><br/>
            <button id="route-btn-${index}"
              style="background:#3B82F6;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;margin-top:8px;width:100%;">
              🚗 Get Route
            </button>
          </div>
        `;

        const marker = L.marker([point.lat, point.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(popupContent);

        marker.on("popupopen", () => {
          const btn = document.getElementById(`route-btn-${index}`);
          if (btn) {
            btn.onclick = () => {
              console.log(`🎯 Route to ${point.name}`);
              calculateRouteToPoint(index);
              mapInstanceRef.current.closePopup();
            };
          }
        });
      });

      setStatus("Map ready! Getting your location...");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const busIcon = createBusIcon();
            driverMarkerRef.current = L.marker([coords.lat, coords.lng], {
              icon: busIcon,
            })
              .addTo(mapInstanceRef.current)
              .bindPopup("<b>🚍 YOUR BUS</b><br>You are here!")
              .openPopup();

            mapInstanceRef.current.setView([coords.lat, coords.lng], 14);
            setStatus("🚌 Live tracking active!");
            socket.emit("driverLocation", coords);
          },
          (err) => {
            console.error("❌ GPS error:", err);
            setStatus("Please allow location access");
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    } catch (err) {
      console.error("❌ Error initializing DriverMap:", err);
      setStatus(`Error: ${err.message}`);
    }

    return () => {
      console.log("🧹 Cleaning up driver map...");
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [authorized]);

  // ✅ HELPER FUNCTIONS
  const createBusIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          background: #dc2626;
          border: 3px solid white;
          border-radius: 8px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        ">🚌</div>
      `,
      className: "bus-marker",
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  };

  const calculateRouteToPoint = async (index) => {
    // your full route logic here (unchanged)
  };

  // ✅ Don’t render map until authorized
  if (!authorized) return null;

  // === JSX ===
  return (
    <div className="w-full h-full">
      <div className="p-4 bg-blue-600 text-white shadow-lg">
        <h2 className="text-xl font-bold">🚍 Driver Dashboard</h2>
        <p className="mt-2">{status}</p>
        <p className="text-sm opacity-90 mt-1">
          Your location is being shared in real time with parents.
        </p>
      </div>

      <div
        ref={mapRef}
        className="rounded-lg shadow-lg border-2 border-gray-200"
        style={{ height: "calc(100vh - 80px)", width: "100%" }}
      />
    </div>
  );
};

export default DriverMap;
