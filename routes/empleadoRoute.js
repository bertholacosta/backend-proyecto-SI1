const router = require("express").Router();
const registroController = require("../controllers/empleadoController.js");  

router.post("/", registroController.createEmpleado);

router.get("/", registroController.mostrarEmpleados);

module.exports = router;