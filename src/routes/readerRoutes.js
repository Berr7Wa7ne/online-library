const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { getReaderDashboard } =require("../controllers/readerController.js");

const router = express.Router();

router.get("/dashboard", protect(["reader"]), getReaderDashboard);


module.exports = router;
