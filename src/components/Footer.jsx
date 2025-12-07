import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="footer-logo">BookMyShow</h2>
          <p>Book movies, events, and premieres with ease. Enjoy a seamless experience.</p>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
           <li
              className="text-light"
              onClick={() => {
                document
                  .getElementById("now-showing")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Home
            </li>

            <li
              className="text-light"
              onClick={() => {
                document
                  .getElementById("now-showing")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Movies
            </li>

            <li
              className="text-light"
              onClick={() => {
                document
                  .getElementById("events")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Events
            </li>

            <li
              className="text-light"
              onClick={() => {
                document
                  .getElementById("premieres")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Premieres
            </li>
            <li className="text-light"
              onClick={() =>
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li>FAQ</li>
            <li>Help Center</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaYoutube />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} BookMyShow Clone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
