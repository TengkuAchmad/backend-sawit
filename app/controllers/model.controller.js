// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");

// CONSTANTS
const { successResponse }  = require("../responses/responses.js");
const { badRequestResponse}   = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma               = new PrismaClient();

// SERVICES
const file_services        = require("../services/file.service.js");
const { getLocalTime }     = require("../services/time.service.js");

// ESSENTIALS FUNCTION

exports.create = async (req, res) => {
   try {
      const { name, type } = req.body;

      const model = req.files;

      if (!name || !model) {
         return badRequestResponse(res, "Please provide all the required fields!");
      }

      const fileUrl = await file_services.upload("eseuramoe/models", "keras", model);

      await prisma.modelData.create({
         data: {
            Name_MD: name,
            Url_MD: fileUrl,
            Type_MD: type,
            UpdatedAt_MD: getLocalTime(new Date()),
            CreatedAt_MD: getLocalTime(new Date())
         }
      });

      return successResponse(res, "Model successfully uploaded!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.findAll = async (req, res) => {
   try {
      const data = await prisma.modelData.findMany({
         select: {
            UUID_MD: true,
            Name_MD: true,
            Url_MD: true,
            Type_MD: true,
            CreatedAt_MD: true,
            UpdatedAt_MD: true,
         }
      });
      
      return successResponse(res, "Data Model Retrieved Successfully", data);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.findOne = async (req, res) => {
   try {
      const { id } = req.params;

      const data = await prisma.modelData.findUnique({
         where: {
            UUID_MD: id
         }, 
         select: {
            UUID_MD: true,
            Name_MD: true,
            Url_MD: true,
            Type_MD: true,
            CreatedAt_MD: true,
            UpdatedAt_MD: true,
         }
      })
      return successResponse(res, "Data Model Retrieved Successfully", data);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.deleteAll = async (req, res) => {
   try {
      const fileDatas = await prisma.modelData.findMany({
         select: {
            Url_MD: true,
         }
      });

      for (let file_url of fileDatas) {
         const isDeleted = await file_services.delete(file_url.Url_MD);

         if (!isDeleted) {
            return badRequestResponse(res, "Internal Server Error")
         }
      }
      
      await prisma.modelData.deleteMany({});

      return successResponse(res, "All Model Data Deleted!");

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.deleteOne = async (req, res) => {
   try {
      const { id } = req.params;

      const modelData = await prisma.modelData.findFirst({
         where: {
            UUID_MD: id,
         }
      });

      const isDeleted = await file_services.delete(modelData.Url_MD);
      if (!isDeleted) {
         return badRequestResponse(res, "Internal Server Error");
      }

      await prisma.modelData.delete({
         where: {
            UUID_MD : id,
         }
      });
      
      return successResponse(res, "Model deleted successfully!");
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}