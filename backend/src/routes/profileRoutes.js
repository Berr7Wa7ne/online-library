const express = require("express");
const {getProfile, updateProfile, updateBio, uploadProfilePhoto } = require("../controllers/profileController.js");
const upload = require("../utils/multerConfig.js");
const router = express.Router();

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/bio", updateBio);
router.put("/upload-photo", upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;
