// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const workspace_controllers = require("../controllers/workspace.controller.js");

// ROUTES
router.get("/workspace-management/get/all", authenticateToken, workspace_controllers.getAll);

router.get("/workspace-management/get/one/:id", authenticateToken, workspace_controllers.getOne);

router.get("/workspace-management/get/by-user", authenticateToken, workspace_controllers.getByUser);

router.post("/workspace-management/create", authenticateToken, workspace_controllers.create);

router.post("/workspace-management/assign", authenticateToken, workspace_controllers.assignToWorkspace);

router.delete("/workspace-management/delete/all", authenticateToken, workspace_controllers.deleteAll);

router.delete("/workspace-management/delete/one/:id", authenticateToken, workspace_controllers.deleteOne);

router.delete("/workspace-management/delete/by-user", authenticateToken, workspace_controllers.deleteByUser);


module.exports = router;