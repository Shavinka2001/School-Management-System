// Import necessary modules
import express from "express"; // Using ESM import
import { Signup, Login, userVerification } from "../controllers/AuthController.js"; // Correct import with ESM

const router = express.Router();

// Define routes
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification); // Add route for user verification if needed

export default router; // Export the router for use in other files