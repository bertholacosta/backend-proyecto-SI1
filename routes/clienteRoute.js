const router = require("express").Router();
const clienteController = require("../controllers/clienteController.js");
const { verifyToken } = require("../middleware/authMiddleware");
const { clienteValidation } = require("../middleware/validationMiddleware");

// Proteger rutas de clientes con autenticación
router.post("/", verifyToken, clienteValidation, clienteController.createCliente);

router.get("/", verifyToken, clienteController.mostrarClientes);

module.exports = router;