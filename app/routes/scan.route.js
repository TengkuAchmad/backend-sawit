// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const scan_controllers = require("../controllers/scan.controller.js");

// ROUTES

router.get("/scan-management/get/result", authenticateToken, scan_controllers.getScan);

module.exports = router;