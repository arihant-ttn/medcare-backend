import nodemailer from "nodemailer";

//  Nodemailer Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "medcare.bootcamp@gmail.com",
    pass: "Jaimatadi@12",
  },
  tls: {
    rejectUnauthorized: false, 
  },
  connectionTimeout: 10000, 
});


//  Send Password Reset Email
export const sendResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: "medcare.bootcamp@gmail.com",
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

