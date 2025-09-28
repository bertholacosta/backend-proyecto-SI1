const router = require("express").Router();
const empleadoController = require("../controllers/empleadoController.js");  

router.post("/", empleadoController.createEmpleado);

router.get("/", empleadoController.mostrarEmpleados);

module.exports = router;