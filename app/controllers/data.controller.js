// ENVIRONMENTS
require('dotenv').config();

// LIBRARIES
const { PrismaClient }     = require("@prisma/client");

// CONSTANTS
const { successResponse, notFoundResponse }  = require("../responses/responses.js");
const { badRequestResponse}   = require("../responses/responses.js");

// PRISMA INSTANCE
const prisma               = new PrismaClient();

// SERVICES
const { getLocalTime }     = require("../services/time.service.js");

exports.getDashboard = async (req, res) => {
    try {
        var resultCount = 0;
        var modelCount = 0;
        var detectedCount = 0;

        resultCount = await prisma.resultIndex.count({});

        modelCount = await prisma.modelData.count({});

        dataCount = await prisma.modelData.findFirst({
            select: {
                CountDetected_MD: true,
            }
        });

        detectedCount = dataCount?.CountDetected_MD ?? 0;
        
        var response = {
            "resultCount": resultCount ?? 0,
            "modelCount": modelCount ?? 0,
            "detectedCount": detectedCount ?? 0,
            "timestamp": getLocalTime(new Date())
        };

        return successResponse(res, "Data fetched successfully!", response);
    } catch (e) {
        return badRequestResponse(res, "Internal Server Error", e.message);
    }
}

exports.getResultData = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id){
            return badRequestResponse(res, "Please fill all required fields!");
        }

        const resultData = await prisma.resultData.findMany({
            where: {
                UUID_WD: id,
            }
        });

        if (resultData.length == 0){
            return notFoundResponse(res, "No data result found in this workspace");
        }

        const resultsData = await prisma.resultData.findMany({
            where: {
                UUID_WD: id,
            },
            select: {
                UUID_RD: true,
                UUID_RI: true,
                Photo_RD: true,
                Confidence_RD: true,
                ModelData: {
                    select: {
                        Name_MD: true
                    }
                },
                ResultIndex: {
                    select: {
                        Title_RI: true,
                        SoilResultIndex: {
                            select: {
                                Lereng_SORI: true,
                                Drainase_SORI: true,
                                Topografi_SORI: true,
                                BahayaErosi_SORI: true,
                                BatuanPer_SORI: true,
                                BatuanSin_SORI: true,
                                Ketinggian_SORI: true,
                                Genangan_SORI: true,
                            }
                        },
                        PalmResultIndex: {
                            select: {
                                ALB_PRI: true,
                                Rendemen_PRI: true,
                                Densitas_PRI: true,
                                Sampel_PRI: true,
                            },
                        },
                        TransmittanResultIndex: {
                            select: {
                                Min_TRI: true,
                                Max_TRI: true
                            }
                        },
                        GelombangResultIndex: {
                            select: {
                                Max_GRI: true,
                                Min_GRI: true,
                            }
                        },
                        SocialResultIndex: {
                            select: {
                                Umur_SRI: true,
                                Kecamatan_SRI: true,
                                Kabupaten_SRI: true,
                                Latitude_SRI: true,
                                Longitude_SRI: true,
                            }
                        }
                    },
                },
            }
        });

        return successResponse(res, "All data retrieved successfully!", resultsData);


    } catch (e) {
        return badRequestResponse(res, "Internal Server Error", e.message);
    }
}