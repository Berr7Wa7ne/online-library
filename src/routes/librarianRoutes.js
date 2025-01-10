import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getLibrarianDashboard } from "../controllers/librarianController.js";


const router = express.Router();


router.get("/dashboard", protect(["LIBRARIAN"]), getLibrarianDashboard);


export default router;
