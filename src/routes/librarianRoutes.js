const express = require("express");
const  { protect } = require("../middlewares/authMiddleware.js");
const { getLibrarianDashboard } = require("../controllers/librarianController.js");


const router = express.Router();


router.get("/dashboard", protect(["LIBRARIAN"]), getLibrarianDashboard);


module.exports = router;
