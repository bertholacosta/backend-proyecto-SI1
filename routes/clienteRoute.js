const router = require("express").Router();
const clienteController = require("../controllers/clienteController.js");
const { verifyToken } = require("../middleware/authMiddleware");
const { clienteValidation } = require("../middleware/validationMiddleware");

// Rutas de clientes - todas protegidas con autenticación
router.post("/", verifyToken, clienteValidation, clienteController.createCliente);
router.get("/", verifyToken, clienteController.mostrarClientes);
router.get("/:id", verifyToken, clienteController.obtenerCliente);
router.put("/:id", verifyToken, clienteController.actualizarCliente);
router.delete("/:id", verifyToken, clienteController.eliminarCliente);

module.exports = router;