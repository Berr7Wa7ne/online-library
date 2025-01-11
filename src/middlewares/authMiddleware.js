const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

const protect = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header("x-auth-token") || req.header("Authorization")?.split(" ")[1];
      console.log("Received Token:", token);

      if (!token) {
        console.error("No token provided");
        return res.status(401).json({ error: "No token provided" });
      }

      console.log("Verifying token...");
      const decoded = jwt.verify(token, JWT_SECRET_KEY); // Token verification
      console.log("Decoded Token:", decoded);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true },
      });
      console.log("Queried User from Database:", user);

      if (!user) {
        console.error("User not found in the database");
        return res.status(404).json({ error: "User not found" });
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        console.error("Access denied: User role not permitted");
        return res.status(403).json({ error: "Forbidden: Access denied" });
      }

      req.user = user; // Attach user to the request
      next(); // Proceed to the next middleware
    } catch (error) {
      console.error("Authentication error:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };
};

module.exports = { protect };
