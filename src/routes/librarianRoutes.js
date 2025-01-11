const express = require("express");
const  { protect } = require("../middlewares/authMiddleware.js");
const { viewOverdueBooks } = require("../controllers/librarianController.js");


const router = express.Router();


router.get("/overdue", protect(["LIBRARIAN"]), viewOverdueBooks);


module.exports = router;
