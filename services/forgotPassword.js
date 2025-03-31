import bcrypt from "bcrypt";
import pool from "../db/index.js";
import { sendEmail } from "./sendEmail.js";
import { generateToken } from "./jwtService.js";
//  Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = result.rows[0];
    console.log(user);
    const token = generateToken(user.user_id);
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // //  Send Reset Link to Email
    await sendEmail(user.email, "Password Reset Request", "resetPassword", {
      name: user.name,
      resetLink,
    });

    res.status(200).json({ message: "Reset link sent to your email!" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

