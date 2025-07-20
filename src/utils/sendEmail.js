const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Tickitz" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

module.exports = sendEmail;
