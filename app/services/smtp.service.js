// ENVIRONMENTS
require('dotenv').config()

// LIBRARIES
const sgMail = require('@sendgrid/mail')
const {badRequestResponse} = require("../responses/responses");

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendEmail = async (receipts, subject, html) => {
   const msg = {
      to: receipts,
      from: 'eseuramoeappsdeveloper@gmail.com',
      subject: subject,
      text: "OTP",
      html: html,
   }

   sgMail
      .send(msg)
      .then(() => {
         return true;
      })
      .catch((error) => {
         console.log(error.message);
         return false;
      })



}