import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateResetToken, verifyResetToken } from "../services/tokenService.js";

// ✅ Forgot Password Controller
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
    const token = generateResetToken(user.id);
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // ✅ Send Reset Link to Email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    );

    res.status(200).json({ message: "Reset link sent to your email!" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// ✅ Reset Password Controller
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = verifyResetToken(token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update User's Password
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      decoded.id,
    ]);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(400).json({ message: "Invalid or expired token!" });
  }
};
