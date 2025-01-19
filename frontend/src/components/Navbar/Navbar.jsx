import React, { useState } from 'react';
import libraryLogo from '../../assets/library-logo.jpg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  console.log('Rendering Navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu State:', !isMenuOpen);
  };
  return (
<div className="fixed top-4 md:left-1/2 md:transform md:-translate-x-1/2 md:w-[835px] md:h-[90px] w-[100%] h-[45px] bg-[#F9F9FB] border border-[#DFE1E6] rounded-[16px] flex items-center justify-center z-50">
  {/* Background overlay */}
  {isMenuOpen && (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-40"></div>
  )}

  {/* Inner Nav */}
  <nav className="relative md:w-[818px] md:h-[72px] w-[100%] h-[100%] bg-white shadow-md border border-[#DFE1E6] rounded-[12px] flex items-center justify-between px-6 z-50">
    {/* Logo and Name */}
    <div className="flex items-center gap-2">
      <img src={libraryLogo} alt="Daycare Logo" className="w-8 h-8 rounded-full" />
      <span className="text-2xl font-bold text-black font-sf-pro-rounded">
        Online Library
      </span>
    </div>

    {/* Hamburger Icon */}
    <div className="md:hidden z-50">
      <button onClick={toggleMenu} className="focus:outline-none">
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-black"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-black"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>
    </div>

    {/* Desktop Navigation Links */}
    <div className="hidden md:flex gap-6">
      <a href="#" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
        Home
      </a>
      <a href="#" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
        Browse
      </a>
      <Link to="/checkout" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
            My Books
      </Link>
      <Link to="/checkin" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
            My Checkouts
      </Link>
      <a href="#faqs" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
        More
      </a>
    </div>

    {/* Buttons */}
    <div className="hidden md:flex items-center gap-4">
      <button className="text-white px-4 py-2 border border-[#DFE1E6] rounded-[10px] hover:bg-gray-100 bg-[#7047EB] font-sf-pro-rounded">
        Login
      </button>
    </div>
  </nav>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="absolute top-[90px] left-0 w-full h-auto bg-white z-50 flex flex-col items-center py-6">
      <a href="#about" className="py-2 px-4 text-black hover:bg-gray-100 font-sf-pro-rounded w-full text-center">
        Home
      </a>
      <a href="#" className="py-2 px-4 text-black hover:bg-gray-100 font-sf-pro-rounded w-full text-center">
        Browse
      </a>
      <Link to="/checkout" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
            My books
      </Link>
      <Link to="/checkin" className="text-black hover:text-gray-600 font-sf-pro-rounded text-[16px]">
            My Checkouts
      </Link>
      <a href="#" className="py-2 px-4 text-black hover:bg-gray-100 font-sf-pro-rounded w-full text-center">
        More
      </a>
      <div className="flex flex-col gap-2 w-full px-4 mt-4 mr-5">
        <button className="text-white w-full py-2 border border-[#DFE1E6] rounded-[10px] hover:bg-gray-100 bg-[#7047EB] font-sf-pro-rounded">
          Login
        </button>
      </div>
    </div>
  )}
</div>
  );
};

export default Navbar;

