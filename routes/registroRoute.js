const router = require("express").Router();
const registroController = require("../controllers/registroController.js");  

router.post("/usuario", registroController.createUsuario);

router.post("/cliente", registroController.createCliente);

router.get("/clientes", registroController.mostrarClientes);

router.post("/empleado", registroController.createEmpleado);

router.get("/empleados", registroController.mostrarEmpleados);

module.exports = router;