// ENVIRONTMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");
const { v4: uuidv4 }       = require("uuid");
const jwt                  = require("jsonwebtoken");
const argon2               = require("argon2");

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
const { send }             = require("../services/smtp.service.js");


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
         const accessToken = jwt.sign({ userID: user.UUID_UD }, JWT_SECRET, { expiresIn: '1d' });

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
               role: user.Role_UD
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

      const hashedPassword = await argon2.hash(req.body.password);

      await prisma.userData.create({
         data: {
            Name_UD: req.body.name,
            Email_UD: req.body.email,
            Password_UD: hashedPassword,
            Role_UD: "USER",
            UpdatedAt_UD: getLocalTime(new Date()),
            CreatedAt_UD: getLocalTime(new Date()),
         }
      });

      return successResponse(res, "Successfully create an account!");

   } catch (e) {
      return badRequestResponse(res, "Internal Server Error", error.message)
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
         }
      });

      return successResponse(res, "Succesfully retrieved data!", userData);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
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

      const updateUser = Object.keys(req.body).reduce((acc, key) => {
         acc[key] = req.body[key];
         return acc;
      }, {});

      await prisma.userData.update({
         where: {
            UUID_UD: id,
         }, data: 
         updateUser,
      });

      return successResponse(res, "User data updated successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message ); 
   }
}

exports.sendOTP = async (req, res) => {
   try {
      await send("achmad.tengku@gmail.com", "TEST DEVELOPMENT 2", "<h1>Hello World!</h1><p>This is a test email sent using Nodemailer.</p>")
      return successResponse(res, "Email sent successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message); 
   }
}