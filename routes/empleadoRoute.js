const router = require("express").Router();
const empleadoController = require("../controllers/empleadoController.js");
const { verifyToken } = require("../middleware/authMiddleware");
const { empleadoValidation } = require("../middleware/validationMiddleware");

// Proteger rutas de empleados con autenticación
router.post("/", verifyToken, empleadoValidation, empleadoController.createEmpleado);

router.get("/", verifyToken, empleadoController.mostrarEmpleados);

module.exports = router;