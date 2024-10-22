// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const model_controllers = require("../controllers/model.controller.js");

// ROUTES
router.post("/model-management/create", authenticateToken, model_controllers.create);

router.get("/model-management/get/all", authenticateToken, model_controllers.findAll);

router.get("/model-management/get/:id", authenticateToken, model_controllers.findOne);

router.delete("/model-management/delete/all", authenticateToken, model_controllers.deleteAll);

router.delete("/model-management/delete/:id", authenticateToken, model_controllers.deleteOne);

module.exports = router;