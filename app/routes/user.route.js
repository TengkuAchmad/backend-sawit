// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const user_controllers = require("../controllers/user.controller.js");

// ROUTES
router.post("/user-management/auth", user_controllers.auth);

router.post("/user-management/register", user_controllers.register);

router.post("/user-management/get/by-email", user_controllers.getByEmail);

router.get("/user-management/get/all", authenticateToken, user_controllers.getAll);

router.get("/user-management/get/:id", authenticateToken, user_controllers.getOne);

router.get("/user-management/send/otp", authenticateToken, user_controllers.sendOTP);

router.delete("/user-management/delete/all", authenticateToken, user_controllers.deleteAll);

router.delete("/user-management/delete/:id", authenticateToken,  user_controllers.deleteOne);

router.put("/user-management/update/:id", authenticateToken, user_controllers.updateOne);

module.exports = router;