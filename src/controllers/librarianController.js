const prisma =require("../models/prisma");
const { sendEmailReminders } = require('../services/emailService');

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

  // Controller to trigger email reminders
const triggerEmailReminders = async (req, res) => {
    try {
      await sendEmailReminders();
      res.status(200).json({ message: 'Email reminders sent successfully.' });
    } catch (error) {
      console.error('Error triggering email reminders:', error.message);
      res.status(500).json({ error: 'Failed to send email reminders.' });
    }
  };
  

  module.exports = {viewOverdueBooks, triggerEmailReminders}
  