/**
 * Genera una contraseña aleatoria segura
 * @param {number} length - Longitud de la contraseña (por defecto 12)
 * @returns {string} - Contraseña generada
 */
const generarContrasena = (length = 12) => {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const simbolos = '!@#$%&*-_+=';
  
  const todosCaracteres = mayusculas + minusculas + numeros + simbolos;
  
  let contrasena = '';
  
  // Asegurar que tenga al menos uno de cada tipo
  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];
  
  // Completar el resto de la longitud
  for (let i = contrasena.length; i < length; i++) {
    contrasena += todosCaracteres[Math.floor(Math.random() * todosCaracteres.length)];
  }
  
  // Mezclar la contraseña
  contrasena = contrasena.split('').sort(() => Math.random() - 0.5).join('');
  
  return contrasena;
};

module.exports = { generarContrasena };
