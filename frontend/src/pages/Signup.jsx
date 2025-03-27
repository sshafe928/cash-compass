import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import lock from "../assets/images/lockbg.webp";
import background from "../assets/images/img1.jfif";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance]   = useState("");
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/signup/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, balance }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Store user and token, then navigate to the dashboard (App.jsx)
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("An error occurred during signup");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative overflow-hidden">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat filter blur-lg"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      <div className="relative flex w-11/12 max-w-4xl bg-white bg-opacity-10 border border-white/20 rounded-xl shadow-lg overflow-hidden">
        {/* Form Container */}
        <div className="flex-1 p-10 flex flex-col justify-center items-center text-center">
          <h2 className="mb-5 text-2xl text-dark-blue font-semibold uppercase">Sign Up</h2>
          <form onSubmit={handleSubmit} className="w-80">
            <label htmlFor="name" className="block text-sm text-gray-700 font-semibold text-left mb-1">
              Full Name:
            </label>
            <input
              type="text"
              id="name"
              name="fullName"
              required
              placeholder="Enter your full name"
              className="w-full py-2 px-3 mb-4 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label htmlFor="email" className="block text-sm text-gray-700 font-semibold text-left mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full py-2 px-3 mb-4 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password" className="block text-sm text-gray-700 font-semibold text-left mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Create a password"
              className="w-full py-2 px-3 mb-4 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="balance" className="block text-sm text-gray-700 font-semibold text-left mb-1">
              Starting Balance:
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              required
              placeholder="0"
              className="w-full py-2 px-3 mb-4 border border-gray-300 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full p-2 mt-6 bg-dark-blue text-white rounded-full hover:bg-hl-blue hover:text-dark-blue transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?
            <a href="/login" className="text-blue-500 hover:underline"> Login here</a>
          </p>
        </div>

        {/* Image Container (Hidden on Small Screens) */}
        <div className="hidden md:flex flex-1 bg-blue-50 justify-center items-center">
          <img src={lock} alt="Secure Login" className="w-full h-full object-cover rounded-r-xl" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
