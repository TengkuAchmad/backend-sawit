// ENVIRONMENTS
require('dotenv').config()

// LIBRARIES
const sgMail = require('@sendgrid/mail')
const {badRequestResponse} = require("../responses/responses");

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendEmail = async (res, receipts, subject, html) => {
   const msg = {
      to: receipts,
      from: 'eseuramoeappsdeveloper@gmail.com',
      subject: subject,
      text: "OTP",
      html: html,
   }

   try {
      sgMail
         .send(msg)
         .then(() => {
            return true;
         })
         .catch((error) => {
            return badRequestResponse(res, "Internal Server Error in sending email!", error);
         })
   } catch (e) {
      return badRequestResponse(res, "An error occured", e);
   }




}