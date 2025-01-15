const nodemailer = require('nodemailer');
const prisma = require('../models/prisma.js'); // Adjust the path as needed

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: process.env.SMTP_PORT,
 secure: false,
 auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 20000,
});

// Function to send email reminders
const sendEmailReminders = async () => {
  try {
    // Find books nearing their expected check-in date (within 2 days)
    const reminderDate = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
    const overdueBooks = await prisma.checkout.findMany({
      where: {
        status: 'CHECKED_OUT',
        expectedCheckinDate: { lte: reminderDate },
      },
      include: { user: true, book: true },
    });

    for (const checkout of overdueBooks) {
      const { email } = checkout.user;
      const { title } = checkout.book;

      // Construct the email content
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Library Check-in Reminder',
        text: `Dear user, please remember to return the book "${title}" by its expected check-in date (${checkout.expectedCheckinDate}).`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${email} for book "${title}".`);
    }
  } catch (error) {
    console.error('Error sending email reminders:', error.message);
    throw error;
  }
};

const notifyLibrariansAboutOverdueBooks = async () => {
  try {
      const currentDate = new Date();
      const overdueBooks = await prisma.checkout.findMany({
          where: {
              status: 'CHECKED_OUT',
              expectedCheckinDate: { lt: currentDate },
          },
          include: { user: true, book: true },
      });

      if (overdueBooks.length === 0) {
          console.log('No overdue books found. No notifications sent.');
          return;
      }

      // Prepare email for librarians
      const email = process.env.LIBRARIAN_EMAIL; // Assuming the librarian's email is stored in .env
      const emailContent = overdueBooks.map((checkout) => 
          `Book: ${checkout.book.title}\nChecked out by: (${checkout.user.email})\nExpected Check-in Date: ${checkout.expectedCheckinDate}`
      ).join('\n\n');

      const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email,
          subject: 'Overdue Books Notification',
          text: `The following books are overdue:\n\n${emailContent}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Notification email sent to the librarian.');
  } catch (error) {
      console.error('Error notifying librarian about overdue books:', error.message);
      throw error;
  }
};

module.exports = { sendEmailReminders, notifyLibrariansAboutOverdueBooks };
