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
const { getLocalTime }     = require("../services/time.service.js");


exports.get = async (req, res) => {
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