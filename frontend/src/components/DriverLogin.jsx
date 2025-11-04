import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../api/api";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    let { data } = await fetchDataFromApi(
      `/drivers?populate=*&filters[$and][0][email]=${formData.email}&filters[$and][1][password]=${formData.password}`,
    );

    if (!data.length) {
      alert("wrong credentials");
    } else {
      alert("Welcome");
      // localStorage.setItem("USER_NAME", data[0].attributes.name);
      // localStorage.setItem("USER_EMAIL", data[0].attributes.email);
      window.location.href = "/driver-homepage";
      localStorage.setItem("userRole", "driver");
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