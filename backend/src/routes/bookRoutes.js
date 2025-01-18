const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { addBook, updateBook, searchBooks } = require("../controllers/bookController.js");

const router = express.Router();

// Protected routes
router.post("/addBook", protect(["LIBRARIAN"]), addBook); // Librarian-only
router.put("/updateBook/:id", protect(["LIBRARIAN"]), updateBook); // Librarian-only
// Public routes
router.get("/searchBooks", searchBooks);

module.exports = router;
