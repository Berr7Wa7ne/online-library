import React, { useState } from "react";
import axios from "axios";
import HeroImage from "../../assets/library-4.jpg";
import { useNavigate} from 'react-router-dom';

const HeroSection = () => {
  // State for search query, titles, and errors
  const [searchQuery, setSearchQuery] = useState("");
  const [titles, setTitles] = useState([]);
  const [error, setError] = useState("");

  const navigate  = useNavigate();
  // const book = { title: "Book Title", author: "Author Name" }; // Mocked book object
  
  // Function to navigate to Checkout page
  const navigateToCheckout = () => {
    navigate("/checkout", {
      // state: { book }
    });
  };

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    try {
      const response = await axios.get("http://localhost:5000/book/searchBooks", {
        params: { title: searchQuery },
      });
      const results = response.data;

      if (results.length > 0) {
        setTitles(results.map((book) => book.title)); // Extract titles
      } else {
        setTitles([]);
        setError("No results found.");
      }
    } catch (err) {
      console.error("Error searching books:", err);
      setError("Failed to fetch search results.");
    }
  };

  // Handle checkout navigation when a book title is clicked
  const handleCheckoutNavigation = (title) => {
    // Here you can map the title to a book object or use the mocked one
    const selectedBook = { title, author: "Author Name" }; // You can replace this with actual book data from search results

    // Now call navigateToCheckout to go to the Checkout page
    navigateToCheckout(selectedBook);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-12 space-x-8 mt-24">
      {/* Left Section */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Today's research, <br /> tomorrow's innovation
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Accelerating research discovery to shape a better future
        </p>

        {/* Search Bar */}
        <div className="mt-8 flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search books, keywords"
            className="flex-grow px-4 py-2 text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            🔍
          </button>
        </div>

        {/* Dropdown Results */}
        <div className="mt-4">
          {titles.length > 0 ? (
            <ul className="border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
              {titles.map((title, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCheckoutNavigation(title)} // Trigger checkout navigation
                >
                  {title}
                </li>
              ))}
            </ul>
          ) : (
            error && <p className="mt-4 text-gray-500">{error}</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
        <img
          src={HeroImage}
          alt="Research illustration"
          className="w-full max-w-sm"
        />
      </div>
    </div>
  );
};

export default HeroSection;
