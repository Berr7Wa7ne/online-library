const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { checkOutBook } = require("../controllers/checkController.js");

const router = express.Router();

router.post("/checkout", protect(["READER"]), checkOutBook);

module.exports = router;