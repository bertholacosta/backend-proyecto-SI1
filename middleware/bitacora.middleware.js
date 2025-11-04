import BitacoraService from '../services/bitacora.service.js';

/**
 * Función para limpiar y normalizar la IP, obteniendo la IP real del cliente
 */
const normalizarIP = (req) => {
  // Intentar obtener la IP real en orden de prioridad
  let ip = 
    req.headers['x-real-ip'] || // Nginx
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() || // Proxy (primera IP de la lista)
    req.ip || // Express con trust proxy
    req.connection?.remoteAddress || // Fallback
    req.socket?.remoteAddress || // Fallback
    'IP desconocida';
  
  // Remover el prefijo IPv6 ::ffff: si existe
  if (ip.includes('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  
  // Si es localhost IPv6, convertir a IPv4
  if (ip === '::1') {
    ip = '127.0.0.1';
  }
  
  return ip;
};

/**
 * Middleware para registrar automáticamente acciones en la bitácora
 */
export const registrarAccion = (modulo, accion) => {
  return async (req, res, next) => {
    // Guardar el método send original
    const originalSend = res.send;
    const originalJson = res.json;

    // Obtener IP real del cliente
    const ipOrigen = normalizarIP(req);

    // Interceptar la respuesta
    const interceptResponse = function(data) {
      // Solo registrar si fue exitoso (status 200-299)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        let descripcion = '';
        
        switch(accion) {
          case 'crear':
            descripcion = `Creó ${modulo}`;
            if (req.body) {
              const datos = { ...req.body };
              delete datos.password; // No guardar passwords
              descripcion += `: ${JSON.stringify(datos)}`;
            }
            break;
            
          case 'editar':
            const id = req.params.id || req.params.nro || req.params.ci || 'ID desconocido';
            descripcion = `Editó ${modulo} [ID: ${id}]`;
            if (req.body) {
              const cambios = { ...req.body };
              delete cambios.password;
              descripcion += `: ${JSON.stringify(cambios)}`;
            }
            break;
            
          case 'eliminar':
            const idEliminar = req.params.id || req.params.nro || req.params.ci || 'ID desconocido';
            descripcion = `Eliminó ${modulo} [ID: ${idEliminar}]`;
            break;
            
          default:
            descripcion = `Acción en ${modulo}: ${accion}`;
        }

        // Registrar en bitácora de forma asíncrona (no bloquear la respuesta)
        BitacoraService.registrar({
          usuarioId: req.user.id,
          descripcion,
          ipOrigen
        }).catch(err => {
          console.error('Error al registrar en bitácora:', err);
        });
      }

      // Llamar al método original
      return originalSend.call(this, data);
    };

    // Reemplazar ambos métodos
    res.send = interceptResponse;
    res.json = interceptResponse;

    next();
  };
};

/**
 * Función helper para registrar manualmente en bitácora
 */
export const registrar = async (req, descripcion) => {
  if (!req.user) return;
  
  const ipOrigen = normalizarIP(req);
  
  await BitacoraService.registrar({
    usuarioId: req.user.id,
    descripcion,
    ipOrigen
  });
};
