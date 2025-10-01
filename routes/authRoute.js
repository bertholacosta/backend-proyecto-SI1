const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");  

router.post("/login", authController.login); 

router.post("/logout", authMiddleware, authController.logout);

router.get("/verificar", authMiddleware, authController.verificarSesion);

module.exports = router;