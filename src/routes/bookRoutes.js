const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { addBook, updateBook } = require("../controllers/bookController.js");

const router = express.Router();

router.post("/addBook", protect(["LIBRARIAN"]), addBook); // Librarian-only
router.put("/updateBook/:id", protect(["LIBRARIAN"]), updateBook); // Librarian-only

module.exports = router;
