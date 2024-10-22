// ENVIRONTMENTS
require('dotenv').config()

// LIBRARIES
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
   host: process.env.MAIL_HOST,
   port: Number(process.env.MAIL_PORT),
   secure: true,
   auth: {
     user: process.env.MAIL_USERNAME,
     pass: process.env.MAIL_PASSWORD,
    },
  });
  
  
  exports.send = async (recipients, subject, content) => {
    
  // MAIL OPTIONS
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: recipients,
    subject: subject,
    html: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}