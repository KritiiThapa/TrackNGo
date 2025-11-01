import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import io from 'socket.io-client';
import { findOptimalRoute } from '../utils/dijkstra';
import busImage from '../img/bus.png'; // <-- import local image

const LiveMap = ({ role }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const optimalRouteLineRef = useRef(null);
  const socketRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    // Initialize map once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([27.7007, 85.3001], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Icons
      const busIcon = L.icon({
        iconUrl: busImage, // <-- use local image
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50]
      });

      const schoolIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png",
        iconSize: [60, 60],
        iconAnchor: [30, 60],
        popupAnchor: [0, -60]
      });

      const pickupIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      // School & pickup points
      const school = { lat: 27.7007, lng: 85.3001, name: "School" };
      const pickupPoints = [
        { lat: 27.7150, lng: 85.3200, name: "Pickup Point 1 - Boudha" },
        { lat: 27.6950, lng: 85.2850, name: "Pickup Point 2 - Lazimpat" },
        { lat: 27.6850, lng: 85.3150, name: "Pickup Point 3 - Patan" },
        { lat: 27.7200, lng: 85.2900, name: "Pickup Point 4 - Maharajgunj" },
        { lat: 27.6900, lng: 85.3250, name: "Pickup Point 5 - Kupondole" }
      ];

      // Add school marker
      L.marker([school.lat, school.lng], { icon: schoolIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${school.name}</b><br>Main School Location`)
        .openPopup();

      // Add pickup markers
      pickupPoints.forEach(point => {
        L.marker([point.lat, point.lng], { icon: pickupIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<b>${point.name}</b>`);
      });

      // Optimal route
      const optimalRoute = findOptimalRoute(school, pickupPoints);
      setRouteInfo({
        distance: optimalRoute.totalDistance,
        stops: optimalRoute.route.length - 1
      });

      const routeCoordinates = optimalRoute.route.map(point => [point.lat, point.lng]);
      optimalRouteLineRef.current = L.polyline(routeCoordinates, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(mapInstanceRef.current);

      optimalRouteLineRef.current.bindPopup(
        `<b>Optimal Bus Route</b><br>Total Distance: ${optimalRoute.totalDistance} km<br>Stops: ${pickupPoints.length}`
      );

      // Save icons & points in map instance
      mapInstanceRef.current.busIcon = busIcon;
      mapInstanceRef.current.school = school;
      mapInstanceRef.current.pickupPoints = pickupPoints;
    }

    // Connect socket
    socketRef.current = io('http://localhost:3000');
    console.log("Socket connected as role:", role);

    // DRIVER: send location immediately and watch
    if (role === "driver" && navigator.geolocation) {
      // Send initial location immediately
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        socketRef.current.emit("send-location", { latitude, longitude, id: "bus1" });
      });

      // Watch continuously
      const watchId = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        socketRef.current.emit("send-location", { latitude, longitude, id: "bus1" });
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
        socketRef.current.disconnect();
      };
    }

    // PARENT: receive live location
    if (role === "parent") {
      let firstUpdate = true; // to center map on first location
      socketRef.current.on("receive-location", data => {
        const { id, latitude, longitude } = data;
        const latlng = [latitude, longitude];

        if (markersRef.current[id]) {
          markersRef.current[id].setLatLng(latlng);
        } else {
          markersRef.current[id] = L.marker(latlng, { icon: mapInstanceRef.current.busIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup("Live Bus Location");
        }

        // Center map on first bus location
        if (firstUpdate) {
          mapInstanceRef.current.setView(latlng, 13);
          firstUpdate = false;
        }
      });

      socketRef.current.on("user-disconnected", id => {
        if (markersRef.current[id]) {
          mapInstanceRef.current.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }

  }, [role]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      {routeInfo && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontFamily: 'Arial, sans-serif'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>Route Information</h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Total Distance:</strong> {routeInfo.distance} km
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Pickup Stops:</strong> {routeInfo.stops}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveMap;
