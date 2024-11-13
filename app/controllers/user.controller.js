// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");
const { v4: uuidv4 }       = require("uuid");
const jwt             = require("jsonwebtoken");
const argon2          = require("argon2");
const { https }    = require("firebase-functions/v2");
const fs = require('fs');
const path = require('path');


// CONSTANTS
const { JWT_SECRET }       = process.env;
const { successResponse }  = require("../responses/responses.js");
const { errorResponse }    = require("../responses/responses.js");
const { notFoundResponse }    = require("../responses/responses.js");
const { badRequestResponse}   = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma               = new PrismaClient();

// SERVICES
const { getLocalTime }     = require("../services/time.service.js");
const file_services = require("../services/file.service");
const {sendEmail} = require("../services/smtp.service");


// CONTROLLERS
exports.auth = async (req, res) => {
   try {
      if (!req.body.email || !req.body.password) {
         return errorResponse(res, "Please provide email and password!");
      }

      const user = await prisma.userData.findFirst({
         where: {
            Email_UD: req.body.email
         }
      });

      if (!user) {
         return notFoundResponse(res, "User not registered!");
      }

      if (await argon2.verify(user.Password_UD, req.body.password)) {
         const accessToken = jwt.sign({ userID: user.UUID_UD }, JWT_SECRET);

         await prisma.userData.update({
            where: {
               UUID_UD: user.UUID_UD, 
            },
            data: {
               LoggedAt_UD: getLocalTime(new Date()),
            }
         });

         return successResponse(res, "Authenticated!", {
            user: {
               id: user.UUID_UD,
               name: user.Name_UD,
               email: user.Email_UD,
               role: user.Role_UD,
               photo: user.PhotoUrl_UD,
            }, 
            token: accessToken,
         });
      } else {
         return errorResponse(res, "Invalid email or password!" );
      }
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message )
   }
}

exports.register = async (req, res) => {
   try {
      if (!req.body.name || !req.body.email || !req.body.password ) {
         return errorResponse(res, "Please provide all fields!");
      }

      let photo = "default";

      if (req.body.photo) {
         photo = req.body.photo;
      }

      const hashedPassword = await argon2.hash(req.body.password);

      await prisma.userData.create({
         data: {
            Name_UD: req.body.name,
            Email_UD: req.body.email,
            Password_UD: hashedPassword,
            Role_UD: "USER",
            PhotoUrl_UD: photo,
            UpdatedAt_UD: getLocalTime(new Date()),
            CreatedAt_UD: getLocalTime(new Date()),
         }
      });

      return successResponse(res, "Successfully create an account!");

   } catch (e) {
      return badRequestResponse(res, "Internal Server Error", e)
   }
}

exports.getAll = async (req, res) => {
   try {
      const userData = await prisma.userData.findMany({
         where: {
            Role_UD: "USER"
         },
         select: {
            UUID_UD: true,
            Name_UD: true,
            Email_UD: true,
            PhotoUrl_UD: true,
            OTP_UD: true,
         }
      });

      return successResponse(res, "Sucessfully retrieved data", userData);

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.getOne = async (req, res) => {
   try {
      const { id } = req.params;

      const userData = await prisma.userData.findUnique({
         where: {
            UUID_UD : id,
         }, select: {
            UUID_UD: true,
            Name_UD: true,
            Email_UD: true,
            Role_UD: true,
            PhotoUrl_UD: true,
         }
      });

      return successResponse(res, "Succesfully retrieved data!", userData);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.getByEmail = async (req, res) => {
   try {
      if (req.body.email) {
         const data = await prisma.userData.findMany({
            where: {
               Email_UD: req.body.email,
            }
         });

         if (data.length > 0) {
            return successResponse(res, "registered");
         } else {
            return successResponse(res, "unregistered");
         }
      }
   } catch (e) {
      return badRequestResponse(res, "Internal Server Error", e.message);
   }
}

exports.deleteAll = async (req, res) => {
   try {
      await prisma.userData.deleteMany({});
      return successResponse(res, "Deleted all user data!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.deleteOne = async (req, res) => {
   try {
      const { id } = req.params;

      await prisma.userData.delete({
         where: {
            UUID_UD: id
         }
      });

      return successResponse(res, "Deleted successfully");

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message)
   }
}

exports.updateOne = async (req, res) => {
   try {
      const { id } = req.params;

      const {name} = req.body;

      const image = req.files;

      if (!name || !image) {
         return badRequestResponse(res, "Please provide all fields required!");
      }

      const userData = await prisma.userData.findFirst({
         where: {
            UUID_UD: id,
         }
      });

      const fileUrl = await file_services.upload("eseuramoe/avatars", "png", image);

      await prisma.userData.update({
         where: {
            UUID_UD: id,
         }, data: {
            Name_UD: name,
            PhotoUrl_UD: fileUrl,
            UpdatedAt_UD: getLocalTime(new Date()),
         }
      });

      if ( userData.PhotoUrl_UD !== "example"){
         await file_services.delete(userData.PhotoUrl_UD);
      }

      return successResponse(res, "User data updated successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message ); 
   }
}

exports.sendOTP = async (req, res) => {
   try {

      if (!req.body.email) {
         return badRequestResponse(res, "Please fill all required fields!");
      }

      const userData = await prisma.userData.findFirst({
         where: {
            Email_UD: req.body.email
         }
      });

      if (userData) {
         // CREATE OTP
         const otp = Math.floor(1000 + Math.random() * 9000);

         await prisma.userData.update({
            where:{
               UUID_UD: userData.UUID_UD,
            }, data: {
               OTP_UD: otp,
               UpdatedAt_UD: getLocalTime(new Date()),
            }
         });

         const name = userData.Name_UD;
         const email = userData.Email_UD;

         const templatePath = path.resolve(__dirname, "../templates/otp.html");

         let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

         htmlTemplate = htmlTemplate.replace('{{username}}', name);
         htmlTemplate = htmlTemplate.replace('{{otp}}', otp);

        const sentEmail = await sendEmail(res, email, "One-Time Password",  htmlTemplate);

        return successResponse(res, "Email sent successfully!");

      } else {
         return notFoundResponse(res, "Email is not registered");
      }

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message); 
   }
}