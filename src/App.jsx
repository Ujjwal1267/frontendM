import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./main";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import "./App.css";


const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://newbackendm.onrender.com/api/v1/user/patient/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to authenticate. Please log in again.");
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, []); // ✅ Runs only once on component mount

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        {/* Show Chatbot only on relevant pages */}
        <Routes>
          <Route path="/" element={<Chatbot />} />
          <Route path="/appointment" element={<Chatbot />} />
        </Routes>

        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </div>
  );
};

export default App;
