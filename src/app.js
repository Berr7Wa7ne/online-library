const express = require('express');
const cors = require('cors');
const app = express();
import authRoutes from "./routes/authRoutes.js";
import librarianRoutes from "./routes/librarianRoutes.js";
import readerRoutes from "./routes/readerRoutes.js";


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/librarian", librarianRoutes);
app.use("/reader", readerRoutes);



module.exports = app;