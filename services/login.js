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



passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;

        // Check if user already exists
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [id]
        );

        let user;
        if (existingUser.rows.length === 0) {
          // Create new user
          const newUser = await pool.query(
            `INSERT INTO users (google_id, name, email) 
             VALUES ($1, $2, $3) RETURNING *`,
            [id, displayName, emails[0].value]
          );
          user = newUser.rows[0];
        } else {
          user = existingUser.rows[0];
        }
        

        return done(null, user);
      } catch (error) {
        console.error("Error in Google Auth:", error);
        return done(error, null);
      }
    }
  )
);
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
