const prisma = require("../models/prisma.js");

const checkOutBook = async (req, res) => {
    try {
      const { bookId, expectedCheckinDate } = req.body;
      const userId = req.user.id; // Assuming user is authenticated
  
      // Ensure the book isn't already checked out
      const activeCheckout = await prisma.checkout.findFirst({
        where: { bookId, status: 'CHECKED_OUT' },
      });
  
      if (activeCheckout) {
        return res.status(400).json({ error: "Book is already checked out" });
      }
  
      // Check out the book
      const checkout = await prisma.checkout.create({
        data: {
          userId,
          bookId,
          expectedCheckinDate: new Date(expectedCheckinDate),
        },
      });
  
      res.status(201).json({ message: "Book checked out successfully", checkout });
    } catch (error) {
      console.error("Error checking out book:", error.message);
      res.status(500).json({ error: "Failed to check out book" });
    }
  };

  module.exports = {checkOutBook}
  