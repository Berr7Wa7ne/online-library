import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../models/prisma.js"; // Adjust the path as needed

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

// Registration Controller
export const register = async (req, res) => {
  const { email, password, role } = req.body;
  const profilePhoto = req.file?.path; // If using multer for profile photo uploads

  // Prevent users from registering as librarians
  if (role && role.toLowerCase() === "librarian") {
    return res.status(403).json({ error: "Cannot register as librarian" });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "reader", // Default to "reader"
        profilePhoto,
      },
    });

    res.status(201).json({ message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};
