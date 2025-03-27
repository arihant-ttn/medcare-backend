import express from "express";
import passport from "../services/login.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT Secret Key (use env variable in production)
const JWT_SECRET = "your_secret_key"; // Change for production

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


// ✅ Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// ✅ Google Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3001/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:3001/appointment");
  }
);

// ✅ Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    
    res.redirect("/");
  });
});

export default router;
