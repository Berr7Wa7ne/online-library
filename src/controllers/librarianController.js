const prisma =require("../models/prisma");

const viewOverdueBooks = async (req, res) => {
    console.log("Fetching overdue books...");
  
    try {
      const currentDate = new Date();
      console.log("Current date:", currentDate);
  
      const overdueBooks = await prisma.checkout.findMany({
        where: {
          status: 'CHECKED_OUT',
          expectedCheckinDate: { lt: currentDate },
        },
        include: { user: true, book: true },
      });
  
      console.log("Overdue books fetched successfully:", overdueBooks);
      res.status(200).json(overdueBooks);
    } catch (error) {
      console.error("Error fetching overdue books:", error.message);
      res.status(500).json({ error: "Failed to fetch overdue books" });
    }
  };
  

  module.exports = {viewOverdueBooks}
  