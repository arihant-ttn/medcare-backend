import nodemailer from "nodemailer";

//  Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // or use your SMTP provider
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

//  Send Password Reset Email
export const sendResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset Link",
    html: `
      <p>You requested a password reset. Click 
      <a href="${resetLink}" target="_blank">here</a> 
      to reset your password.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  //  Send Email
  await transporter.sendMail(mailOptions);
};
