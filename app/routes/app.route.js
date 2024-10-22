// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const app_controllers = require("../controllers/app.controller.js");

// ROUTES
router.get("/app-management/test", app_controllers.test);

router.get("/app-management/test-secure", authenticateToken, app_controllers.testsecure);

router.get("/app-management/get/all", authenticateToken, app_controllers.getAll);

router.get("/app-management/get/latest", authenticateToken, app_controllers.getLatest);

router.post("/app-management/create", authenticateToken, app_controllers.create);

router.delete("/app-management/delete/all", authenticateToken, app_controllers.deleteAll);

router.delete("/app-management/delete/:id", authenticateToken, app_controllers.deleteOne);

module.exports = router;