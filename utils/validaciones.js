
class Validaciones {
  static empleado_ci(empleado_ci) {
    // Validaciones de username ( opcional usar zod)
    const numero = Number(empleado_ci);
    if (!Number.isInteger(numero))         
      throw new Error(
        "empleado_ci debe ser un número entero"
      );
  }
  static nombre(nombre) {
    // Validaciones de nombre ( opcional usar zod)
    if (typeof nombre !== "string" || nombre.trim().length < 3)
      throw new Error("Nombre debe ser una cadena con al menos 3 caracteres");
  }
  static usuario(usuario) {
    // Validaciones de username ( opcional usar zod)
    if (typeof usuario !== "string" || usuario.trim().length < 3)
      throw new Error("Username debe ser una cadena con al menos 3 caracteres");
  }
  static contrasena(contrasena) {
    // Validaciones de password ( opcional usar zod)
    if (typeof contrasena !== "string" || contrasena.length < 6)
      throw new Error("contrasena debe ser una cadena con al menos 6 caracteres");
  }
  static email(email) {
    // Validaciones de email ( opcional usar zod)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email))
      throw new Error("Email debe ser un email valido");
  }
  static ci(CI) {
    const numero = Number(CI);
    if (!Number.isInteger(numero))
      throw new Error(`CI debe ser un entero, received: ${CI} (${typeof CI})`);
  }
  static telefono(telefono) {
    const numero = Number(telefono);
    if (!Number.isInteger(numero))
      throw new Error(
        `Telefono debe ser un entero, received: ${telefono} (${typeof telefono})`
      );
  }
  static direccion(direccion) {
    if (typeof direccion !== "string" || direccion.trim().length < 3)
      throw new Error("Direccion debe ser una cadena con al menos 3 caracteres");
  }
}

module.exports = Validaciones;
