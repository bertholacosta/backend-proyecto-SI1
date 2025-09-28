const router = require("express").Router();
const clienteController = require("../controllers/clienteController.js");  

router.post("/", clienteController.createCliente);

router.get("/", clienteController.mostrarClientes);

module.exports = router;