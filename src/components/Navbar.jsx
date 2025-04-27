import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { FaVideo } from "react-icons/fa";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    await axios
      .get("https://newbackendm.onrender.com/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    navigateTo("/login");
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)} className=" video-call-btn">
              Home
            </Link>
                <a href="https://ujjwal1267.github.io/based_on_City/" target="_blank" rel="noopener noreferrer" className="video-call-btn">
                   Nearby{/*/loc.html*/}
               </a>
            <Link to={"/appointment"} onClick={() => setShow(!show)}  className=" video-call-btn">
              Appointment
            </Link>
           
            <a href="https://videocalltest-3doewn8hn-ujjwal-s-projects-be8ed2f2.vercel.app/" target="_blank" rel="noopener noreferrer" className="video-call-btn">
  <FaVideo /> Video Call
</a>

            
            <a href=" https://672fa0496612de73d6dcdcd5--spiffy-melba-f67476.netlify.app/ " target="_blank" rel="noopener noreferrer" className="video-call-btn">
                   Blog
            </a>


            <a href="https://mediare.netlify.app/" target="_blank" rel="noopener noreferrer" className="video-call-btn">
                   Shop
               </a>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
          </div>
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>
              LOGOUT
            </button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>
              LOGIN
            </button>
          )}
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
