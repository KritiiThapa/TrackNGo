import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API
      const { data } = await fetchDataFromApi(
        `/drivers?populate=*&filters[$and][0][email]=${email}&filters[$and][1][password]=${password}`
      );
      console.log("API response:", data);

      // Check if any driver is returned
      if (!data.length) {
        alert("Wrong credentials");
        return;
      }

      const driver = data[0];

      // Prepare driver data for context
      const driverData = {
        email: driver.email,
        name: driver.name || "Driver User",
        role: "driver",
      };

      // Save in context
      login(driverData);

      // Optionally save role in localStorage
      localStorage.setItem("userRole", "driver");

      // Navigate to driver homepage
      navigate("/driver-homepage");
    } catch (error) {
      console.error("Driver login error:", error);
      alert("Something went wrong. Please try again. "+ error.message);
    }
  };
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-8"
      style={{ background: "var(--background)", color: "var(--text)" }}
    >
      <header className="navbar flex items-center justify-between w-full shadow-md">
        <a href="/" className="text-2xl font-bold tracking-wide">
          TrackNGo
        </a>
      </header>

      <div
        className="w-[360px] h-[500px] mt-6 rounded-[25px] p-5 relative overflow-hidden"
        style={{ background: "var(--white)" }}
      >
        <h2 className="text-xl font-semibold text-center mb-4">Driver Login</h2>
                  <button
          className="mt-6 py-3 px-6 rounded-[30px] mx-auto block"
          onClick={() => navigate("/login")}
          style={{
            background: "linear-gradient(to right, var(--primary), var(--tertiary))",
            color: "var(--text)",
          }}
        >
          Continue as Parent
        </button>

        <form onSubmit={handleSubmit} className="w-[280px] mx-auto mt-8">
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full border-b py-2 my-2 outline-none"
            style={{ background: "transparent", borderColor: "#ccc" }}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full border-b py-2 my-2 outline-none"
            style={{ background: "transparent", borderColor: "#ccc" }}
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="w-[85%] py-2 px-4 rounded-[30px] mx-auto block mt-6"
            style={{
              background:
                "linear-gradient(to right, var(--primary), var(--tertiary))",
              color: "var(--text)",
            }}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;