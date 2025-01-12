// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient } = require("@prisma/client");

// CONSTANTS
const { successResponse } = require("../responses/responses.js");
const { badRequestResponse } = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma = new PrismaClient();

// SERVICES
const file_services = require("../services/file.service.js");
const { getLocalTime } = require("../services/time.service.js");

// AXIOS INSTANCES
const axios = require("axios");
const FormData = require('form-data');

exports.getScan = async (req, res) => {
   try {
      const token = req.locals.token;
      const { model_id } = req.body;
      const target = req.files;

      if (!model_id || !target) {
         return badRequestResponse(res, "Please provide all required fields!");
      }

      const formData = new FormData();
      formData.append('token', token);
      formData.append('model_id', model_id);
      formData.append('file', target[0].buffer, target[0].originalname);

      const engineResponse = await axios.post('http://128.199.122.162:8000/engine-scan', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
            ...formData.getHeaders(),
         },
      });

      const featureClass = engineResponse.data['result'].replace(/\s+/g, '');
      console.log(featureClass);

      // SEARCH
      const resultData = await prisma.resultIndex.findFirst({
         where: {
            Title_RI: featureClass,
         },
      });

      if (!resultData) {
         return badRequestResponse(res, "No matching resultIndex found!");
      }

      // Initialize response components
      let socialData = [];
      let soilData = null;
      let palmData = null;
      let transmittanData = null;
      let gelombangData = null;

      // Check UUID_RI before querying social data
      if (resultData.UUID_RI) {
         socialData = await prisma.socialResultIndex.findMany({
            where: {
               UUID_RI: resultData.UUID_RI,
            },
         });
      }

      // Check UUID_SORI before querying soil data
      if (resultData.UUID_SORI) {
         soilData = await prisma.soilResultIndex.findFirst({
            where: {
               UUID_SORI: resultData.UUID_SORI,
            },
         });
      }

      // Check UUID_PRI before querying palm data
      if (resultData.UUID_PRI) {
         palmData = await prisma.palmResultIndex.findFirst({
            where: {
               UUID_PRI: resultData.UUID_PRI,
            },
         });
      }

      // Check UUID_TRI before querying transmittan data
      if (resultData.UUID_TRI) {
         transmittanData = await prisma.transmittanResultIndex.findFirst({
            where: {
               UUID_TRI: resultData.UUID_TRI,
            },
         });
      }

      // Check UUID_GRI before querying gelombang data
      if (resultData.UUID_GRI) {
         gelombangData = await prisma.gelombangResultIndex.findFirst({
            where: {
               UUID_GRI: resultData.UUID_GRI,
            },
         });
      }

      const response = {
         data: [
            {
               sample: featureClass,
               socialData: socialData.map((social) => ({
                  longitude: social.Longitude_SRI,
                  latitude: social.Latitude_SRI,
                  kabupaten: social.Kabupaten_SRI,
                  desa: social.Desa_SRI,
                  kecamatan: social.Kecamatan_SRI,
               })),
            },
            {
               Umur: soilData?.Umur_SRI,
               Lereng: soilData?.Lereng_SORI,
               Drainase: soilData?.Drainase_SORI,
               Genangan: soilData?.Genangan_SORI,
               Topografi: soilData?.Topografi_SORI,
               BahayaErosi: soilData?.BahayaErosi_SORI,
               BatuanPer: soilData?.BatuanPer_SORI,
               BatuanSin: soilData?.BatuanSin_SORI,
               Ketinggian: soilData?.Ketinggian_SORI,
            },
            {
               Sampel: palmData?.Sampel_PRI,
               ALB: palmData?.ALB_PRI,
               Rendemen: palmData?.Rendemen_PRI,
               Densitas: palmData?.Densitas_PRI,
            },
            {
               TransmitanMin: transmittanData?.Min_TRI,
               TransmitanMax: transmittanData?.Max_TRI,
            },
            {
               GelombangMin: gelombangData?.Min_GRI,
               GelombangMax: gelombangData?.Max_GRI,
            },
         ],
      };

      const modelData = await prisma.modelData.findFirst({
         where: {
            UUID_MD: model_id,
         },
         select: {
            CountDetected_MD: true,
         },
      });

      await prisma.modelData.update({
         data: {
            CountDetected_MD: (modelData?.CountDetected_MD ?? 0) + 1,
            UpdatedAt_MD: getLocalTime(new Date()),
         },
         where: {
            UUID_MD: model_id,
         },
      });

      const fileUrl = await file_services.upload("eseuramoe/images", "png", target);

      await prisma.resultData.create({
         data: {
            UUID_MD: model_id,
            Photo_RD: fileUrl,
            UUID_RI: resultData.UUID_RI,
            UUID_WD: null,
         },
      });

      return successResponse(res, "Scan completed successfully!", response);
   } catch (error) {
      console.error("Error during scan:", error);
      return badRequestResponse(res, "Internal Server Error", error.message);
   }
}; 