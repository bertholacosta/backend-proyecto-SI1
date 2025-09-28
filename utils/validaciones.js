class Validaciones {
  static empleado_ci(empleado_ci) {
    // Validaciones de username ( opcional usar zod)
    const numero = Number(empleado_ci);
    if (!Number.isInteger(numero))
      throw new Error(
        "empleado_ci must be a integer with at least 3 characters"
      );
  }
  static nombre(nombre) {
    // Validaciones de nombre ( opcional usar zod)
    if (typeof nombre !== "string" || nombre.trim().length < 3)
      throw new Error("Nombre must be a string with at least 3 characters");
  }
  static usuario(usuario) {
    // Validaciones de username ( opcional usar zod)
    if (typeof usuario !== "string" || usuario.trim().length < 3)
      throw new Error("Username must be a string with at least 3 characters");
  }
  static contrasena(contrasena) {
    // Validaciones de password ( opcional usar zod)
    if (typeof contrasena !== "string" || contrasena.length < 6)
      throw new Error("contrasena must be a string with at least 6 characters");
  }
  static email(email) {
    // Validaciones de email ( opcional usar zod)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email))
      throw new Error("Email must be a valid email address");
  }
  static ci(CI) {
    const numero = Number(CI);
    if (!Number.isInteger(numero))
      throw new Error(`CI must be an integer, received: ${CI} (${typeof CI})`);
  }
  static telefono(telefono) {
    const numero = Number(telefono);
    if (!Number.isInteger(numero))
      throw new Error(
        `Telefono must be an integer, received: ${telefono} (${typeof telefono})`
      );
  }
  static direccion(direccion) {
    if (typeof direccion !== "string" || direccion.trim().length < 3)
      throw new Error("Direccion must be a string with at least 3 characters");
  }
}

module.exports = Validaciones;
