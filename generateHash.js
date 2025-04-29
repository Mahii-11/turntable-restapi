// Import bcryptjs module
const bcrypt = require("bcryptjs");

// Function to generate hashed password
async function generateHash() {
  try {
    const password = "669098@@"; // Replace this with the new password you want to set
    const salt = await bcrypt.genSalt(10); // Salt generation
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
    console.log("Hashed Password:", hashedPassword); // This will print the hashed password
  } catch (error) {
    console.error("Error generating hash:", error);
  }
}

// Call the function
generateHash();
