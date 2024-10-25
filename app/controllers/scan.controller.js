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
const file_services        = require("../services/file.service.js");
const { getLocalTime }     = require("../services/time.service.js");

exports.getScan = async (req, res) => {
   try {
      const response = {
         "data" : [
            {
               "sample": "AB_301",
               "longitude": "96.729998",
               "latitude": "3.843658",
               "kabupaten": "Aceh Barat Daya",
               "Desa": "Blang Dalam",
               "Kecamatan" : "Babah Rot"
            },
            {
               "Umur": "3-5",
               "Lereng" : "<8",
               "Drainase" : "Baik, sedang",
               "Genangan" : "f0",
               "Topografi": "Datar, landai",
               "BahayaErosi" : "Rendah, sedang",
               "BatuanPer": "<5",
               "BatuanSin": "<5",
               "Ketinggian" : "<200",               
            },
            {
               "Sampel": "AB 30",
               "ALB": "2.5",
               "Rendemen": "52.77",
               "Densitas": "0.99762",
            },
            {
               "TransmitanMin": "8.505528",
               "TransmitanMax": "82.769336"
            },
            {
               "GelombangMin": "399.264912",
               "GelombangMax": "1500.618848"
            }
         ]
      }
      return successResponse(res, "Scan completed succesfully!", response);
   } catch (error) {
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}