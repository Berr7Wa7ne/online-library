import React, { useState } from "react";
import axios from "axios";

const CheckIn = ({ initialCheckouts = [] }) => {
const [checkouts, setCheckouts] = useState(initialCheckouts || []);
  const [loading, setLoading] = useState(null); // Track loading per book

  // Function to handle book check-in
  const handleCheckIn = async (id) => {
    try {
      setLoading(id);
      const response = await axios.put(`http://localhost:5000/check/checkin/${id}`);
      console.log(response.data);

      // Update the state with the returned book data
      setCheckouts((prevCheckouts) =>
        prevCheckouts.map((checkout) =>
          checkout.id === id ? { ...response.data.checkout } : checkout
        )
      );
    } catch (error) {
      console.error("Error checking in book:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Checkouts</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="py-2 px-4 border-b">Book Title</th>
              <th className="py-2 px-4 border-b">Due Date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {checkouts.map((checkout) => (
                <tr key={checkout.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{checkout.book?.title || "Unknown Title"}</td>
                <td className="py-2 px-4 border-b">{checkout.expectedCheckinDate?.split("T")[0]}</td>
                <td className={`py-2 px-4 border-b ${checkout.status === "OVERDUE" ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                    {checkout.status}
                </td>
                <td className="py-2 px-4 border-b">
                    {checkout.status !== "RETURNED" ? (
                    <button
                        onClick={() => handleCheckIn(checkout.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                        Check In
                    </button>
                    ) : (
                    <span className="text-green-500 font-semibold">Checked In</span>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckIn;
