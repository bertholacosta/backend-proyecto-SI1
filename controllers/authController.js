const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const Validaciones = require("../utils/validaciones");
const jwt = require("jsonwebtoken");

// Login usuario

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    Validaciones.usuario(usuario);
    Validaciones.contrasena(contrasena);

    const user = await prisma.usuario.findUnique({
      where: { usuario },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario no existe" });
    }

    const isValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { usuario: user.usuario, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const { contrasena: _, ...userWithoutPassword } = user;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });
    return res
      .status(200)

      .json({
        usuario: userWithoutPassword.usuario,
        email: userWithoutPassword.email,
        token: token,
      });
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    return res
      .status(400)
      .json({
        error: error.message || "Un error ocurrió mientras iniciabas sesión.",
      });
  }
};

const logout = async (req, res) => {

  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true, 
      sameSite: "Strict",
    });
    res.redirect('/login');
    return res.status(200).json({ message: "Logout exitoso" });

  } catch (error) {
    console.error("Error al iniciar sesión", error);
    return res
      .status(400)
      .json({
        error: error.message || "Un error ocurrió mientras iniciabas sesión.",
      });
  }
};

module.exports = { login
  , logout
 };
