const Validaciones = require("../utils/validaciones");

// Middleware para validar datos de entrada
const validateRequest = (validationRules) => {
  return (req, res, next) => {
    try {
      const errors = [];
      
      // Aplicar reglas de validación
      for (const [field, validationFn] of Object.entries(validationRules)) {
        const value = req.body[field];
        
        try {
          if (typeof validationFn === 'function') {
            validationFn(value);
          } else if (Array.isArray(validationFn)) {
            // Múltiples validaciones para un campo
            validationFn.forEach(fn => fn(value));
          }
        } catch (error) {
          errors.push({
            field,
            message: error.message
          });
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Errores de validación',
          details: errors
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Error en validación',
        message: error.message
      });
    }
  };
};

// Validaciones específicas para diferentes entidades
const userValidation = validateRequest({
  usuario: Validaciones.usuario,
  contrasena: Validaciones.contrasena,
  email: Validaciones.email
});

const loginValidation = validateRequest({
  usuario: Validaciones.usuario,
  contrasena: Validaciones.contrasena
});

const clienteValidation = validateRequest({
  nombre: Validaciones.nombre,
  telefono: Validaciones.telefono,
  email: Validaciones.email
});

const empleadoValidation = validateRequest({
  nombre: Validaciones.nombre,
  telefono: Validaciones.telefono,
  email: Validaciones.email
});

// Middleware para sanitizar datos
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Eliminar espacios en blanco al inicio y final
        obj[key] = obj[key].trim();
        
        // Escapar caracteres HTML básicos
        obj[key] = obj[key]
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

module.exports = {
  validateRequest,
  userValidation,
  loginValidation,
  clienteValidation,
  empleadoValidation,
  sanitizeInput
};