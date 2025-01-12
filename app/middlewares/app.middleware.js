// ENVIRONTMENTS
require('dotenv').config();

// LIBRARIES
const jwt                        = require("jsonwebtoken");

const { PrismaClient }           = require ("@prisma/client");

// CONSTANTSA
const { JWT_SECRET }             = process.env;

// RESPONSES
const { badRequestResponse }     = require('../responses/responses.js');
const { expiredTokenResponse }   = require('../responses/responses.js');
const { invalidTokenResponse }   = require("../responses/responses.js");

// PRISMA
const prisma                     = new PrismaClient();

// MIDDLEWARE FOR TOKENS
const authenticateToken = async (req, res, next) => {
   const authHeader  = req.headers['authorization'];

   let token         = null;

   if (authHeader) {
      token = authHeader.split(' ')[1];
   }

   if (!authHeader) {
      return badRequestResponse(res, "Unauthorized!");
   }

   try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const isUserExist = await prisma.userData.findFirst({
         where: {
            UUID_UD: decoded.userID
         }
      });

      if (isUserExist) {
         const currentTime = Math.floor(new Date().getTime() / 1000);

         const tokenIssuedAt = decoded.iat;

         const expiryTime = 60 * 60 *24 * 7;

         if (currentTime - tokenIssuedAt > expiryTime ){
            return expiredTokenResponse(res, "Token expired!");
         }

         req.locals = { user: decoded.userID, token };

         return next()

      } else {
         return invalidTokenResponse(res, "Invalid token!");
      }
   } catch (error) {
      return invalidTokenResponse(res, "Invalid token!");
   }
} 

module.exports = { authenticateToken };