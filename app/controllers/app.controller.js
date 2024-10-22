// ENVIRONTMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");

// CONSTANTS
const { successResponse }  = require("../responses/responses.js");
const { badRequestResponse}   = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma               = new PrismaClient();

// SERVICES
const { getLocalTime }     = require("../services/time.service.js");

// CONTROLLERS
exports.test = async (req, res) => {
   try {
      return successResponse(res, "API Connected with basic test!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.testsecure = async (req, res) => {
   try {
      const id = req.locals;

      if (id) {
         return successResponse(res, "API Connected with secure test!");
      } else {
         return badRequestResponse(res, "Internal Server Error", error.message );
      }
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.create = async (req, res) => {
   const {version, description, url } = req.body;

   if (!version || !description || !url) {
      return badRequestResponse(res, "Please fill all required fields!");
   }

   try {
      await prisma.appData.create({
         data: {
            Version_AD: version,
            Description_AD: description,
            Url_AD: url,
            UpdatedAt_AD: getLocalTime(new Date()),
            CreatedAt_AD: getLocalTime(new Date()),
         }
      });
      return successResponse(res, "Application version data created successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.getAll = async (req, res) => {
   try {
      const data = await prisma.appData.findMany({
         select: {
            UUID_AD: true,
            Version_AD: true,
            Description_AD: true,
         }
      });
      return successResponse(res, "Data retrieved successfully!", data)
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error");
   }
}

exports.getLatest = async (req, res) => {
   try {
      const data = await prisma.appData.findFirst({
         orderBy: {
            UpdatedAt_AD: 'desc' 
         }
      });
      return successResponse(res, "Latest Version Data Retrieved Succesfully", data);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.deleteAll = async (req, res) => {
   try {
      await prisma.appData.deleteMany({});
      return successResponse(res, "All Application Version is deleted!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error");
   }
}

exports.deleteOne = async (req, res) => {
   const { id } = req.params;

   try {
      await prisma.appData.deleteMany({
         where: {
            UUID_AD: id
         }
      });
      
      return successResponse(res, "Version is deleted successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error");
   }
}