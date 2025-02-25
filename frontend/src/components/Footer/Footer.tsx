import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-4 mt-auto">
      <div className="max-w-6xl flex flex-col md:flex-row justify-between space-x-24 items-center px-6 ml-40">
        {/* Copyright Text */}
        <p className="text-sm">© 2025 Online Library. All rights reserved.</p>

        {/* Footer Links */}
        <div className="flex space-x-6">
          <Link to="/privacy" className="hover:text-blue-500">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-blue-500">
            Terms of Use
          </Link>
          <Link to="/contact" className="hover:text-blue-500">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
