// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const result_controllers = require("../controllers/result.controller.js");

// ROUTES
router.get("/result-management/find/all", authenticateToken, result_controllers.getAll);

router.get("/result-management/find/names", authenticateToken, result_controllers.getAllNames);

router.post("/result-management/create", authenticateToken, result_controllers.create);

router.delete("/result-management/delete/one", authenticateToken, result_controllers.deleteOne);

module.exports = router;