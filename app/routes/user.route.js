// LIBRARIES
const router = require("express").Router();

// MIDDLEWARES
const { authenticateToken } = require("../middlewares/app.middleware.js");

// CONTROLLER
const user_controllers = require("../controllers/user.controller.js");

// ROUTES
router.post("/user-management/auth", user_controllers.auth);

router.post("/user-management/register", user_controllers.register);

router.post("/user-management/register/admin", user_controllers.registerAdmin);

router.post("/user-management/find/email", user_controllers.getByEmail);

router.get("/user-management/get/all", authenticateToken, user_controllers.getAll);

router.get("/user-management/get/:id", authenticateToken, user_controllers.getOne);

router.get("/user-management/get/admin/all", authenticateToken, user_controllers.getAllAdmin);

router.get("/user-management/get/admin/:id", authenticateToken, user_controllers.getOneAdmin);

router.post("/user-management/send/otp", user_controllers.sendOTP);

router.post("/user-management/verify/otp", user_controllers.verifyOTP);

router.delete("/user-management/delete/admin/all", authenticateToken, user_controllers.deleteAllAdmin);

router.delete("/user-management/delete/admin/:id", authenticateToken,  user_controllers.deleteOneAdmin);

router.delete("/user-management/delete/all", authenticateToken, user_controllers.deleteAll);

router.delete("/user-management/delete/:id", authenticateToken,  user_controllers.deleteOne);

router.put("/user-management/update/:id", authenticateToken, user_controllers.updateOne);

router.put("/user-management/update/pass/:id", user_controllers.updatePass);

module.exports = router;