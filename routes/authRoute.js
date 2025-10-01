const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");  

// Rutas públicas
router.post("/login", authController.login); 

// Ruta para verificar si hay cookies (debugging)
router.get("/debug-cookies", (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers,
        hasAuthCookie: !!req.cookies.access_token,
        authHeader: req.headers.authorization,
        timestamp: new Date().toISOString()
    });
});

// Rutas protegidas
router.post("/logout", authMiddleware, authController.logout);
router.get("/verificar", authMiddleware, authController.verificarSesion);
router.get("/verificar-sesion", authMiddleware, authController.verificarSesion); // Alias más claro

module.exports = router;