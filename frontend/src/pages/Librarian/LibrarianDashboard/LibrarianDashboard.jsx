import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardChart from "../../../components/DashboardCharts/DashboardCharts";
import OverDueBooks from "../OverDueBook/OverDueBook";

const LibrarianDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    checkedOutBooks: 0,
    overdueBooks: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/librarian/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Librarian Dashboard</h2>

{/* Statistics Summary */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Total Books */}
  <div className="bg-blue-500 p-4 rounded-lg shadow-lg text-white flex items-center justify-between">
    <span className="text-4xl">📚</span>
    <div className="ml-auto text-right">
      <h3 className="text-[17px] font-semibold">Total Books</h3>
      <p className="text-xl">{stats.totalBooks}</p>
    </div>
  </div>

  {/* Books Borrowed */}
  <div className="bg-green-500 p-4 rounded-lg shadow-lg text-white flex items-center justify-between">
    <span className="text-4xl">📖</span>
    <div className="ml-auto text-right">
      <h3 className="text-[17px] font-semibold">Books Borrowed</h3>
      <p className="text-xl">{stats.checkedOutBooks}</p>
    </div>
  </div>

  {/* Overdue Books */}
  <div className="bg-red-500 p-4 rounded-lg shadow-lg text-white flex items-center justify-between">
    <span className="text-4xl">⏳</span>
    <div className="ml-auto text-right">
      <h3 className="text-[17px] font-semibold">Overdue Books</h3>
      <p className="text-xl">{stats.overdueBooks}</p>
    </div>
  </div>

  {/* Total Users */}
  <div className="bg-purple-500 p-4 rounded-lg shadow-lg text-white flex items-center justify-between">
    <span className="text-4xl">👥</span>
    <div className="ml-auto text-right">
      <h3 className="text-[17px] font-semibold">Total Users</h3>
      <p className="text-xl">{stats.totalUsers}</p>
    </div>
  </div>
</div>


      {/* Chart Display */}
      <DashboardChart stats={stats} />
      
      {/* OverDueBooks Display */}
      <OverDueBooks />
      
    </div>
  );
};

export default LibrarianDashboard;
