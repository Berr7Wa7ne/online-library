const prisma =require("../models/prisma");

const viewOverdueBooks = async (req, res) => {
    try {
      const overdueBooks = await prisma.checkout.findMany({
        where: {
          status: 'CHECKED_OUT',
          expectedCheckinDate: { lt: new Date() },
        },
        include: { user: true, book: true },
      });
  
      res.status(200).json(overdueBooks);
    } catch (error) {
      console.error("Error fetching overdue books:", error.message);
      res.status(500).json({ error: "Failed to fetch overdue books" });
    }
  };

  module.exports = {viewOverdueBooks}
  