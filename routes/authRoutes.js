const express = require("express");
const { login } = require("../controllers/authController");
const User = require("../models/user");

const router = express.Router();

// Login Route
router.post("/login", login);

// New Route to Create Admin User (for testing)
router.post("/create-admin", async (req, res) => {
  try {
    // Create a new admin user with email, hashed password, and isAdmin set to true
    const newUser = new User({
      email: "adibmahi14@gmail.com", // Admin email
      password: "$2b$10$xyJCi9NnhWTmfmPbGQgTcOStvjWkmtZh4iJRu.ugJZtUAPudDDlGm", // Hashed password
      isAdmin: true,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "Admin user created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin user", error });
  }
});

module.exports = router;
