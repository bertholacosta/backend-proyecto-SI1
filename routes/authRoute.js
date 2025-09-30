const router = require("express").Router();
const authController = require("../controllers/authController");
const { loginValidation } = require("../middleware/validationMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", loginValidation, authController.login); 

router.post("/logout", verifyToken, authController.logout);

// Ruta para verificar sesión actual
router.get("/verify", verifyToken, authController.verifySession);

module.exports = router;