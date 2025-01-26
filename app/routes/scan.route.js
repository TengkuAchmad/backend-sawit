// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const scan_controllers = require("../controllers/scan.controller.js");

// ROUTES

router.post("/scan-management/perform/rapid", authenticateToken, scan_controllers.performRapid);

router.post("/scan-management/perform/lab", authenticateToken, scan_controllers.performLab);

module.exports = router;