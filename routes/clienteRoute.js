const router = require("express").Router();
const registroController = require("../controllers/clienteController.js");  

router.post("/", registroController.createCliente);

router.get("/", registroController.mostrarClientes);

module.exports = router;