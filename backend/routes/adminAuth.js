const express = require("express");
const axios = require("axios");
const { auth } = require("../firebaseConfig");
const {
  getAdminByUsername,
  createAdmin,
  createAdminUser
} = require("../services/firebaseService");

const router = express.Router();

// Firebase Web API Key
const FIREBASE_API_KEY = "AIzaSyDDYX61344lv5bOHf6oBv1Z0Udl8S7C3Oc";

/* =========================
   TEST ROUTE
========================= */
router.get("/ping", (req, res) => {
  res.json({ status: "admin route alive ✅" });
});

/**
 * POST /api/admin/login
 * Supports:
 *  - Demo admin (for testing)
 *  - Real admins (future)
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // 🔍 Find admin (demo or real)
    let admin = await getAdminByUsername(username.toLowerCase());

    /**
     * DEMO ADMIN FALLBACK
     */
    if (!admin) {
      const DEMO_ADMIN = {
        username: "admin",
        password: "admin123"
      };

      if (
        username === DEMO_ADMIN.username &&
        password === DEMO_ADMIN.password
      ) {
        // Create Firebase user for demo admin
        const adminEmail = `${DEMO_ADMIN.username}@vibeathon.internal`;

        try {
          // Try to get existing user or create new one
          let userRecord;
          try {
            userRecord = await auth.getUserByEmail(adminEmail);
          } catch (error) {
            // User doesn't exist, create it
            userRecord = await createAdminUser(adminEmail, DEMO_ADMIN.password);
          }

          // Create admin in database
          admin = await createAdmin({
            username: DEMO_ADMIN.username,
            email: adminEmail,
            role: "admin"
          });

          // Set custom claims for role-based access
          await auth.setCustomUserClaims(userRecord.uid, {
            id: admin.id,
            role: "admin",
            username: admin.username
          });
        } catch (error) {
          console.error("Error creating demo admin:", error);
          return res.status(500).json({
            message: "Failed to create demo admin"
          });
        }
      } else {
        return res.status(401).json({
          message: "Invalid credentials"
        });
      }
    }

    // 🔐 Sign in with Firebase Authentication
    const adminEmail = admin.email || `${admin.username}@vibeathon.internal`;

    try {
      // Sign in using Firebase REST API
      const signInResponse = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email: adminEmail,
          password: password,
          returnSecureToken: true
        }
      );

      // Get the Firebase ID token (contains custom claims)
      const idToken = signInResponse.data.idToken;

      return res.status(200).json({
        message: "Admin login successful",
        token: idToken,
        admin: {
          username: admin.username,
          role: admin.role
        }
      });
    } catch (authError) {
      console.error("Firebase Auth Error:", authError);

      // Handle Firebase Auth errors
      if (authError.response?.data?.error?.message) {
        const errorMessage = authError.response.data.error.message;
        if (errorMessage.includes("INVALID_PASSWORD") || errorMessage.includes("EMAIL_NOT_FOUND")) {
          return res.status(401).json({
            message: "Invalid credentials"
          });
        }
      }

      return res.status(401).json({
        message: "Invalid credentials"
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
