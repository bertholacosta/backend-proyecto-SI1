const router = require("express").Router();
const registroController = require("../controllers/usuarioController.js");  

router.post("/", registroController.createUsuario);

router.get("/", registroController.mostrarUsuarios);

module.exports = router;