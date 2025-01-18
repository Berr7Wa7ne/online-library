const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { checkOutBook, checkInBook } = require("../controllers/checkController.js");

const router = express.Router();

// Protect routes
router.post("/checkout", protect(["READER"]), checkOutBook);
router.patch("/checkin/:id", protect(["READER"]), checkInBook);

module.exports = router;