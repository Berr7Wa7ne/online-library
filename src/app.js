const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
const cron = require('node-cron');
const { sendEmailReminders } = require('./services/emailService.js');
const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes");
const checkRoutes = require("./routes/checkRoutes.js")
const librarianRoutes = require("./routes/librarianRoutes.js");
const readerRoutes = require("./routes/readerRoutes.js");

const app = express();

// Schedule the email reminders to run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Running daily email reminders task...');
    await sendEmailReminders();
  });

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/book", bookRoutes)
app.use("/check", checkRoutes)
app.use("/librarian", librarianRoutes);
app.use("/reader", readerRoutes);

module.exports = app;
