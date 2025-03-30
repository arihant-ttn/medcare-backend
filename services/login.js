import passport from "passport";
import pkg from "passport-local";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db/index.js";
import config from "../config/index.js";
const LocalStrategy = pkg.Strategy;
// JWT Secret Key
const JWT_SECRET = "your_secret_key"; // Use env variable in production



export const authenticateGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.redirect(`${API_BASE_URL}/login?error=GoogleLoginFailed`);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.redirect(`${API_BASE_URL}/login?token=${token}`);
  })(req, res, next);
};
// Local Strategy for authenticating users with email and password
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        console.log("Local Strategy Hit for email:", email);

        // Check if user exists in the database
        const result = await pool.query(
          "SELECT user_id, name, email,password FROM users WHERE email = $1",
          [email]
        );
        

        if (result.rows.length === 0) {
          console.log("User not found.");
          return done(null, false, { message: "Invalid username or password" });
        }

        const user = result.rows[0];
        console.log("User found:", user);

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.log("Password does not match.");
          return done(null, false, { message: "Invalid username or password" });
        }

        // Successful login
        return done(null, user);
      } catch (error) {
        console.error("Error in Local Strategy:", error);
        return done(error);
      }
    }
  )
);

// JWT Strategy for protecting routes
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [payload.id]);

      if (result.rows.length === 0) {
        return done(null, false);
      }

      const user = result.rows[0];
      return done(null, user);
    } catch (err) {
      console.error("Error in JWT Strategy:", err);
      return done(err, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null,user);
});

passport.deserializeUser(async (email,user, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    done(null,user);
  } catch (err) {
    done(err);
  }
});

export default passport;
