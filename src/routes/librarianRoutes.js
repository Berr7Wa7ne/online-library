const express = require("express");
const  { protect } = require("../middlewares/authMiddleware.js");
const { viewOverdueBooks } = require("../controllers/librarianController.js");
const { triggerEmailReminders } = require('../controllers/librarianController.js');


const router = express.Router();


router.get("/overdue", protect(["LIBRARIAN"]), viewOverdueBooks);
router.post('/send-reminders', protect(['LIBRARIAN']), triggerEmailReminders);

module.exports = router;
