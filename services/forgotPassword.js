import crypto from "crypto";
import { sendResetEmail } from "./emailService.js";

//  Forgot Password - Generate Token and Send Email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    //  Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    //  Generate Token (Store in Frontend Only)
    const token = crypto.randomBytes(32).toString("hex");

    //  Send Reset Email
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendResetEmail(email, resetLink);

    res.status(200).send({
      message: "Password reset link sent. Check your email!",
      token,
    });
  } catch (err) {
    res.status(500).send({ message: "Error sending reset email" });
  }
};
