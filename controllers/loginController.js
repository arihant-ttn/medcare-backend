import express from "express";
import passport from "../services/login.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../services/jwtService.js";
import { handleGoogleCallback,authenticateGoogle } from "../services/login.js";
const router = express.Router();

// JWT Secret Key (use env variable in production)
const JWT_SECRET = process.env.JWT_SECRET; // Change for production

router.post("/login", (req, res, next) => {
  console.log("POST /login hit");

  passport.authenticate("local", async (err, user, info) => {
    console.log("Authentication hit:", user);
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log("Invalid credentials");
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Generate JWT Token after successful login
      const payload = { id: user.user_id, email: user.email };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      console.log(token)
      console.log("Token generated successfully");
      console.log(payload.id);
      // Send token to the client
      return res.status(200).json({
        message: "Login Successful",
        token: token,
        user: {
          id: user.user_id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send("Server Error");
    }
  })(req, res, next);
});


//  Google Auth Route
  export const googleAuth = authenticateGoogle;
  export const googleAuthCallback = handleGoogleCallback

  //  Logout Route
  router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
  
      //  Destroy session and redirect to login
      req.session.destroy(() => {
        res.redirect("http://localhost:3001/login");
      });
    });
  });
  
export default router;
