import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getReaderDashboard } from "../controllers/readerController.js";

const router = express.Router();

router.get("/dashboard", protect(["reader"]), getReaderDashboard);


export default router;
