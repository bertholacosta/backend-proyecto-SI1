const router = require("express").Router();
const usuarioController = require("../controllers/usuarioController.js");
const { verifyToken } = require("../middleware/authMiddleware");
const { userValidation } = require("../middleware/validationMiddleware");

// Crear usuario público (registro)
router.post("/", userValidation, usuarioController.createUsuario);

// Proteger rutas administrativas con autenticación
router.get("/", verifyToken, usuarioController.mostrarUsuarios);

router.post("/createadmin", verifyToken, userValidation, usuarioController.createAdmin);

router.post('/deleteadmin', verifyToken, usuarioController.removeAdmin);

module.exports = router;