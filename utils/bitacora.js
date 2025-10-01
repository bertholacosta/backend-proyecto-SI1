const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

function getClientIp(req) {
  const xfwd = req.headers["x-forwarded-for"];
  if (xfwd) {
    return xfwd.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}


const bitacora = async ({ req, res, descripcion, usuario_id = null }) => {
    const ip = getClientIp(req);
    try {
        // Determinar el usuario_id
        let finalUsuarioId = usuario_id;
        if (!finalUsuarioId && req.user) {
            // Si req.user tiene el campo usuario, necesitamos buscar el ID
            if (req.user.usuario) {
                const user = await prisma.usuario.findUnique({
                    where: { usuario: req.user.usuario },
                    select: { id: true }
                });
                finalUsuarioId = user ? user.id : null;
            } else if (req.user.id) {
                finalUsuarioId = req.user.id;
            }
        }

        const newBitacora = await prisma.bitacora.create({
            data: {
                usuario_id: finalUsuarioId || null, // Permitir NULL para eventos anónimos
                descripcion,
                ip_origen: ip || null
            },
        });
        
        console.log('Bitácora creada exitosamente:', {
            id_bitacora: newBitacora.id_bitacora,
            usuario_id: finalUsuarioId,
            descripcion,
            ip_origen: ip,
            fecha_hora: newBitacora.fecha_hora
        });
        return newBitacora;
    } catch (error) {
        console.error("Error al crear bitacora", error);
        // En caso de error, no fallar el proceso principal
        return null;
    }   
};

module.exports = {
  bitacora,
};