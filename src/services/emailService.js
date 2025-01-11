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
        from: process.env.EMAIL_USER,
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
  }
};

module.exports = { sendEmailReminders };
