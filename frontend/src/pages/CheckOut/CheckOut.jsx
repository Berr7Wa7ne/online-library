import React, { useState, useEffect } from "react";
import axios from 'axios';
import Modal from "../../components/Modal/Modal";
// import { useLocation } from "react-router-dom";

const Checkout = () => {
    //State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expectedCheckinDate, setExpectedCheckinDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState([ { book: {} }]);
//   const [checkouts, setCheckouts] = useState([]); // Store fetched checkouts

    console.log("this is the checkoutdata", checkoutData)
  
  // Fetch checkouts when the component mounts
  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
            const token = localStorage.getItem('token'); // Get token inside the function
            if (!token){
              console.error("No token found, user is not authenticated.");
              return; // Stop execution if no token
            }
            console.log("This is the token", token)

        const response = await axios.get("http://localhost:5000/check/get-checkout", {
          headers: { Authorization: `Bearer ${token}` }, // Use storedToken instead of token st
        });

        console.log("This is the response", response)
        setCheckoutData(response.data.checkouts);
      } catch (error) {
        console.error("Error fetching checkouts:", error);
      }
    };
  
    fetchCheckouts();
  }, []); // No need to depend on token

  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 10); // Add 10 days
    setExpectedCheckinDate(defaultDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
  }, []);
  

  // Function to handle book check-in
  const handleCheckout = async () => {
    try {
    const storedToken = localStorage.getItem('token');
      setIsLoading(true);
      setError("");

      console.log("Checkout Data:", checkoutData);

      if (!checkoutData?.[0]?.book?.id) {
        setError("Book ID is missing. Please select a valid book to checkout.");
        setIsLoading(false);
        return;
      }

  
      const response = await axios.post('http://localhost:5000/check/checkout', {
        bookId: checkoutData?.[0]?.book?.id,
        expectedCheckinDate,
      }, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
  
      console.log('Checkout Response:', response.data);
  
      if (response.data) {
        setCheckoutData(response.data); // Store the API response
        setIsModalOpen(false);
        alert("Book checked out successfully!");
      }
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to checkout book");
    } finally {
      setIsLoading(false);
    }
  };


  //Return JSX code 
  return (
<div className="max-w-4xl mx-auto p-8 space-y-8">
  {/* Table Container */}
  <div className="overflow-hidden bg-white shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Details
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Information
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {checkoutData && checkoutData.length > 0 ? (
          checkoutData.map((checkout) => (
            <>
              <tr key={checkout.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Title
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {checkout.book?.title}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Author
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {checkout.book?.authors}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Status
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {checkout.status}
                </td>
              </tr>
            </>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="px-6 py-4 text-sm text-gray-500">
              No checkouts available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

{/* Checkout Section */}
<div className="bg-gray-50 p-6 rounded-lg shadow mt-6">
  <h3 className="text-lg font-bold mb-4">Checkout Book</h3>
  <p className="text-gray-600 mb-4">
    You are about to checkout the book:{" "}
    <strong>
      {checkoutData?.[0]?.book?.title || "Select a book to checkout"}
    </strong>
  </p>

  {/* Checkout Form */}
  <div className="space-y-4">
    {/* Hidden Input for Book ID */}
    <input
      type="hidden"
      value={checkoutData?.[0]?.book?.id || "No book selected. Please select a book."}
      readOnly
      id="bookId"
    />

    {/* Expected Check-In Date */}
    <div>
      <label htmlFor="checkinDate" className="block text-sm font-medium text-gray-700">
        Expected Check-In Date
      </label>
      <input
        id="checkinDate"
        type="date"
        value={expectedCheckinDate}
        onChange={(e) => setExpectedCheckinDate(e.target.value)}
        className="mt-2 w-full border border-gray-300 rounded p-3"
      />
    </div>

    {/* Error Display */}
    {error && <p className="text-red-500 text-sm">{error}</p>}

    {/* Confirm Checkout Button */}
    <div className="flex justify-center mt-6">
      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        disabled={isLoading || !expectedCheckinDate || !checkoutData?.[0]?.book?.id}
      >
        {isLoading ? "Processing..." : "Confirm Checkout"}
      </button>
    </div>
  </div>
</div>



      {/* Modal (Checkout Confirmation) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Checkout Book</h3>
        <p>Title: {checkoutData?.[0]?.book?.title || "No title available"}</p>
        <p>Author: {checkoutData?.[0]?.book?.authors || "No author available"}</p>

        <div className="mt-4">
          <label htmlFor="checkinDate" className="block text-gray-600">
            Expected Check-In Date
          </label>
          <input
            id="checkinDate"
            type="date"
            value={expectedCheckinDate}
            onChange={(e) => setExpectedCheckinDate(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-2"
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading || !expectedCheckinDate}
          >
            {isLoading ? "Processing..." : "Confirm Checkout"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
