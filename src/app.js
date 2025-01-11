const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes");
const librarianRoutes = require("./routes/librarianRoutes.js");
const readerRoutes = require("./routes/readerRoutes.js");

const app = express();

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
app.use("/librarian", librarianRoutes);
app.use("/reader", readerRoutes);

module.exports = app;
