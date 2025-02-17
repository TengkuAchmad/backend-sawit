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

      const files = await file_services.upload("iseuramoe", "models", "keras", model);

      await prisma.modelData.create({
         data: {
            Name_MD: name,
            Url_MD: files[0],
            Type_MD: type,
            FileName_MD: files[1],
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
            FileName_MD: true,
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
            FileName_MD: true,
            CreatedAt_MD: true,
            UpdatedAt_MD: true,
         }
      })
      return successResponse(res, "Data Model Retrieved Successfully", data);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message );
   }
}

exports.findByCategory = async (req, res) => {
   try {
      if (!req.body.category){
         return badRequestResponse(res, "Please fill all required fields!");
      }

      const modelData = await prisma.modelData.findMany({
         where: {
            Type_MD: req.body.category
         }
      });

      return successResponse(res, "All data retrieved", modelData);

   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}

exports.deleteAll = async (req, res) => {
   try {
      const fileDatas = await prisma.modelData.findMany({
         select: {
            FileName_MD: true,
         }
      });

      for (let files of fileDatas) {
         const isDeleted = await file_services.delete('iseuramoe', "models", files.FileName_MD);

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

      const isDeleted = await file_services.delete('iseuramoe', "models", modelData.FileName_MD);
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