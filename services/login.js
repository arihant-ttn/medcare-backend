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
// const JWT_SECRET = "your_secret_key"; // Use env variable in production


passport.use(new GoogleStrategy(
  {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google/callback'
  },
  async (accessToken, refreshToken, profile, done) =>{
      try {
          const email = profile.emails[0].value;  


          let user = await pool.query('select * from users where email = $1', [email])
          if(user.rows.length === 0){
              // create new user 
              user = await pool.query('insert into users (name, email) values ($1, $2) returning *', [profile.displayName, profile.emails[0].value ])
          }
          return done(null, user.rows[0])
      } catch (error) {
          return done(error, null)
      }
  }
))

export const authenticateGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});


export const handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.redirect(`http://localhost:3001/login?error=GoogleLoginFailed`);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.redirect(`http://localhost:3001/login?token=${token}`);
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





export default passport;
