const prisma = require("../models/prisma.js");

// Get librarian profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("This is the userId", userId)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        displayName: true,
        email: true,
        phone: true,
        address: true,
        bio: true,
        profilePhoto: true,
      },
    });
    res.json("This is the response", user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update personal details
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, displayName, email, phoneNumber, address } = req.body;
    console.log
    ("This is the request payload", 
        userId, 
        firstName,
        lastName,
        displayName,
        email,
        phoneNumber,
        address,
    )
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, displayName, email, phoneNumber, address },
    });
    res.json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Update bio
const updateBio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;
    console.log("This is the bio", bio)
    await prisma.user.update({ where: { id: userId }, data: { bio } });
    res.json({ message: "Bio updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update bio" });
  }
};

// Upload profile picture
const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const profilePhoto = req.file.buffer.toString("base64"); // Storing as base64
    console.log("This is the profile photo", profilePhoto)
    await prisma.user.update({ where: { id: userId }, data: { profilePhoto } });
    res.json({ message: "Profile photo updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile photo" });
  }
};

module.exports = {getProfile, updateProfile, updateBio, uploadProfilePhoto};
