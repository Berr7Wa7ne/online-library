const prisma =require("../models/prisma");

const getLibrarianDashboard = async (req, res) => {
    try {
      // Simulate fetching data specific to the librarian
      // You can replace this with actual data fetching from the database
      const dashboardData = {
        totalUsers: 100,
        totalBooks: 500,
        newRegistrations: 10,
      };
  
      res.status(200).json({
        message: "Librarian Dashboard Data",
        data: dashboardData,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  };

  module.exports = {getLibrarianDashboard}
  