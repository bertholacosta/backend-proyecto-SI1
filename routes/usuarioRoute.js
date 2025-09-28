const router = require("express").Router();
const usuarioController = require("../controllers/usuarioController.js");  

router.post("/", usuarioController.createUsuario);

router.get("/", usuarioController.mostrarUsuarios);

router.post("/createadmin", usuarioController.createAdmin);

router.post('/deleteadmin', usuarioController.removeAdmin);

module.exports = router;