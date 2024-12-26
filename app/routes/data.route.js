// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const data_controllers = require("../controllers/data.controller.js");

// ROUTES
router.get("/data-management/get/dashboard", authenticateToken, data_controllers.get);


module.exports = router;