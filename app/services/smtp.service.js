// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const nodemailer = require('nodemailer');
const { badRequestResponse, successResponse } = require("../responses/responses");

// Configure SMTP settings
const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT || 587,
   secure: process.env.SMTP_PORT,
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
   },
});

exports.sendEmail = async (res, receipts, subject, html) => {
   const mailOptions = {
      to: receipts,
      from: process.env.SMTP_FROM_EMAIL,
      subject: subject,
      text: 'OTP',
      html: html,
   };

   try {
      await transporter.sendMail(mailOptions);
      return true;
   } catch (error) {
      console.error('Error sending email:', error);
      return false;
   }
};
