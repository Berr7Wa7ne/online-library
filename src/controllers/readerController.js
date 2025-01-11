const prisma =require("../models/prisma");

const getReaderDashboard = async (req, res) => {
    try {
      // Simulate fetching data specific to the reader (like reading history, etc.)
      const readerData = {
        borrowedBooks: 5,
        overdueBooks: 1,
        totalBooksRead: 15,
      };
  
      res.status(200).json({
        message: "Reader Dashboard Data",
        data: readerData,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  };
  
  // Example function to retrieve a list of books (for readers)
  const viewBooks = async (req, res) => {
    try {
      // Simulate fetching book data (you can replace this with actual database queries)
      const books = [
        { id: 1, title: "Book One", author: "Author One" },
        { id: 2, title: "Book Two", author: "Author Two" },
        { id: 3, title: "Book Three", author: "Author Three" },
      ];
  
      res.status(200).json({
        message: "Available Books",
        books,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  };

  module.exports = {getReaderDashboard, viewBooks}
  