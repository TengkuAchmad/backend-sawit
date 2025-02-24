// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const fs = require('fs');
const path = require('path');


// CONSTANTS
const { JWT_SECRET } = process.env;
const { successResponse } = require("../responses/responses.js");
const { errorResponse } = require("../responses/responses.js");
const { notFoundResponse } = require("../responses/responses.js");
const { badRequestResponse } = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma = new PrismaClient();

// SERVICES
const { getLocalTime } = require("../services/time.service.js");
const file_services = require("../services/file.service");
const { sendEmail } = require("../services/smtp.service");


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
         return errorResponse(res, "Invalid email or password!");
      }
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message)
   }
}

exports.register = async (req, res) => {
   try {
      if (!req.body.name || !req.body.email || !req.body.password) {
         return errorResponse(res, "Please provide all fields!");
      }

      let photo = "default";

      if (req.body.photo) {
         photo = req.body.photo;
      }

      const hashedPassword = await argon2.hash(req.body.password);

      const userID = uuidv4();

      await prisma.userData.create({
         data: {
            UUID_UD: userID,
            Name_UD: req.body.name,
            Email_UD: req.body.email,
            Password_UD: hashedPassword,
            Role_UD: "USER",
            PhotoUrl_UD: photo,
            UpdatedAt_UD: getLocalTime(new Date()),
            CreatedAt_UD: getLocalTime(new Date()),
         }
      });

      await prisma.workspaceData.create({
         data: {
            UUID_WD: uuidv4(),
            UUID_UD: userID,
            Name_WD: "Example Workspace",
            UpdatedAt_WD: getLocalTime(new Date()),
            CreatedAt_WD: getLocalTime(new Date()),
         }
      })

      return successResponse(res, "Successfully create an account!");

   } catch (e) {
      return badRequestResponse(res, "Internal Server Error", e)
   }
}

exports.registerAdmin = async (req, res) => {
   try {
      if (!req.body.name || !req.body.email || !req.body.password) {
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
            Role_UD: "ADMIN",
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
            PhotoName_UD: true,
            OTP_UD: true,
            LoggedAt_UD: true,
            UpdatedAt_UD: true,
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
            UUID_UD: id,
         }, select: {
            UUID_UD: true,
            Name_UD: true,
            Email_UD: true,
            Role_UD: true,
            PhotoUrl_UD: true,
            PhotoName_UD: true,
         }
      });

      return successResponse(res, "Succesfully retrieved data!", userData);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.getAllAdmin = async (req, res) => {
   try {
      const userData = await prisma.userData.findMany({
         where: {
            Role_UD: "ADMIN"
         },
         select: {
            UUID_UD: true,
            Name_UD: true,
            Email_UD: true,
            PhotoUrl_UD: true,
            PhotoName_UD: true,
            OTP_UD: true,
            LoggedAt_UD: true,
            UpdatedAt_UD: true,
         }
      });

      return successResponse(res, "Sucessfully retrieved data", userData);

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.getOneAdmin = async (req, res) => {
   try {
      const { id } = req.params;

      const userData = await prisma.userData.findUnique({
         where: {
            UUID_UD: id,
            Role_UD: "ADMIN",
         }, select: {
            UUID_UD: true,
            Name_UD: true,
            Email_UD: true,
            Role_UD: true,
            PhotoUrl_UD: true,
            PhotoName_UD: true,
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
      const userDatas = await prisma.userData.findMany({
         select : {
            PhotoUrl_UD: true,
            PhotoName_UD: true,
         }, where : {
            Role_UD: "USER"
         }
      });

      for (let users of userDatas) {

         if (users.PhotoUrl_UD != "default"){

            const isDeleted = await file_services.delete("iseuramoe", "avatars", users.PhotoName_UD);

            if (!isDeleted) {
               return badRequestResponse(res, "Internal Server Error")
            }

         }
   
      }

      await prisma.workspaceData.deleteMany({});

      await prisma.userData.deleteMany({
         where: {
            Role_UD: "USER",
         }
      });

      return successResponse(res, "Deleted all user data!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.deleteOne = async (req, res) => {
   try {
      const { id } = req.params;

      const userDatas = await prisma.userData.findFirst({
         where: {
            UUID_UD: id,
         }
      });

      if (userDatas.PhotoUrl_UD != 'default'){
         await file_services.delete("iseuramoe", "avatars", userDatas.PhotoName_UD);
      }
      
      await prisma.workspaceData.deleteMany({
         where: {
            UUID_UD: id
         }
      });
      
      await prisma.userData.deleteMany({
         where: {
            UUID_UD: id
         }
      });

      return successResponse(res, "Deleted successfully");

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message)
   }
}

exports.deleteAllAdmin = async (req, res) => {
   try {
      const adminDatas = await prisma.userData.findMany({
         select : {
            PhotoUrl_UD: true,
            PhotoName_UD: true,
         }, where : {
            Role_UD: "ADMIN"
         }
      });

      for (let admins of adminDatas) {

         if (admins.PhotoUrl_UD != 'default') {

            const isDeleted = await file_services.delete('iseuramoe', "avatars", admins.PhotoName_UD);

            if (!isDeleted) {
               return badRequestResponse(res, "Internal Server Error")
            }

         }
      
      }

      await prisma.workspaceData.deleteMany({});
      await prisma.userData.deleteMany({
         where: {
            Role_UD: "ADMIN",
         }
      });
      return successResponse(res, "Deleted all admin data!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.deleteOneAdmin = async (req, res) => {
   try {
      const { id } = req.params;

      const adminData = await prisma.userData.findFirst({
         where: {
            UUID_UD: id,
         }
      });

      if (adminData.PhotoUrl_UD != 'default'){
         await file_services.delete("iseuramoe", "avatars", adminData.PhotoName_UD);
      }
      
      await prisma.workspaceData.deleteMany({
         where: {
            UUID_UD: id
         }
      });
      
      await prisma.userData.deleteMany({
         where: {
            UUID_UD: id
         }
      });

      return successResponse(res, "Admin data deleted asuccessfully");

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message)
   }
}

exports.updateOne = async (req, res) => {
   try {
      const { id } = req.params;

      const { name } = req.body;

      const image = req.files;

      if (!name || !image) {
         return badRequestResponse(res, "Please provide all fields required!");
      }

      const userData = await prisma.userData.findFirst({
         where: {
            UUID_UD: id,
         }
      });

      if (userData.PhotoUrl_UD !== "default" && !userData.PhotoUrl_UD.startsWith('https://lh3.googleusercontent.com')) {
         await file_services.delete("iseuramoe", "avatars", userData.PhotoName_UD);
      }

      const files = await file_services.upload("iseuramoe", "avatars", "png", image);

      await prisma.userData.update({
         where: {
            UUID_UD: id,
         }, data: {
            Name_UD: name,
            PhotoUrl_UD: files[0],
            PhotoName_UD: files[1],
            UpdatedAt_UD: getLocalTime(new Date()),
         }
      });


      return successResponse(res, "User data updated successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.updatePass = async (req, res) => {
   try {
      const { id } = req.params;
      const { password } = req.body;

      if (!id || !password) {
         return badRequestResponse(res, "Please provide all required fields!");
      }
      const hashedPassword = await argon2.hash(req.body.password);

      await prisma.userData.update({
         where: {
            UUID_UD: id,
         },
         data: {
            Password_UD: hashedPassword,
            UpdatedAt_UD: getLocalTime(new Date()),
         }
      });

      return successResponse(res, "Password successfully updated!");
   } catch (e) {
      return badRequestResponse(res, "Internal Server Error", e);
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
            where: {
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

         const sentEmail = await sendEmail(res, email, "One-Time Password", htmlTemplate);

         return successResponse(res, "Email sent successfully!");

      } else {
         return notFoundResponse(res, "Email is not registered");
      }

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.verifyOTP = async (req, res) => {
   try {
      const { otp, email } = req.body;

      if (!otp || !email) {
         return badRequestResponse(res, "Please fill all required fields!");
      }

      const otpData = await prisma.userData.findFirst({
         where: {
            Email_UD: email
         }, select: {
            UUID_UD: true,
            OTP_UD: true,
         }
      });

      if (otp === otpData.OTP_UD) {
         await prisma.userData.update({
            data: {
               OTP_UD: null,
            },
            where: {
               UUID_UD: otpData.UUID_UD,
            },
         });
         
         var response = {
            "id" : otpData.UUID_UD,
         };

         return successResponse(res, "OTP Verified!", response);
      } else {
         return badRequestResponse(res, "OTP Not Match!");
      }


   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error);
   }
}