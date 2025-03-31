import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

// ✅ Create Transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL, // Your Gmail address
    pass: process.env.SMTP_PASSWORD, // Your 16-character App Password
  },
});

// ✅ Send Email Function
export const sendEmail = async (to, subject, template, data) => {
  try {
    //  Define Path to EJS Template
    const templatePath = path.join(process.cwd(), "templates", `${template}.ejs`);

    //  Render EJS Template with Data
    console.log("endEmail ", data);
    const html = await ejs.renderFile(templatePath, data);

    //  Email Options
    const mailOptions = {
      from: process.env.SMTP_EMAIL, // Sender's email
      to, // Recipient's email
      subject, // Email subject
      html, // Rendered HTML content
    };

    //  Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};
