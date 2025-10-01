const router = require("express").Router();
const registroController = require("../controllers/registroController.js");  

router.post("/usuario", registroController.createUsuario);

// Rutas legacy - redirigir a las nuevas rutas de clientes
router.post("/cliente", (req, res) => {
  res.status(301).json({ 
    message: "Esta ruta ha sido movida. Use POST /clientes en su lugar",
    newUrl: "/clientes"
  });
});

router.get("/clientes", (req, res) => {
  res.status(301).json({ 
    message: "Esta ruta ha sido movida. Use GET /clientes en su lugar",
    newUrl: "/clientes"
  });
});

router.post("/empleado", registroController.createEmpleado);

router.get("/empleados", registroController.mostrarEmpleados);

module.exports = router;