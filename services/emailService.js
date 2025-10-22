const nodemailer = require('nodemailer');

// Configuración del transportador de correo con soporte para múltiples puertos
// Render y otros servicios de hosting suelen bloquear el puerto 587
const createTransporter = () => {
  const useSSL = process.env.EMAIL_PORT === '465' || process.env.EMAIL_USE_SSL === 'true';
  const port = parseInt(process.env.EMAIL_PORT || (useSSL ? '465' : '587'));
  
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: useSSL, // true para puerto 465 (SSL), false para 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    // Configuración robusta para entornos de producción
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 10000,
    socketTimeout: 15000,
    // Importante para servicios de hosting
    requireTLS: !useSSL,
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  };

  console.log(`📧 Configurando email: ${config.host}:${config.port} (SSL: ${config.secure})`);
  return nodemailer.createTransport(config);
};

/**
 * Envía un correo con la nueva contraseña generada
 * @param {string} email - Correo del destinatario
 * @param {string} usuario - Nombre de usuario
 * @param {string} nuevaContrasena - Nueva contraseña generada
 * @returns {Promise<boolean>} - true si se envió correctamente
 */
const enviarNuevaContrasena = async (email, usuario, nuevaContrasena) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Taller Motos Renacer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperación de Contraseña - Sistema Taller Motos Renacer',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              background-color: white;
            }
            .password-box {
              background-color: #f0f0f0;
              padding: 15px;
              margin: 20px 0;
              border-left: 4px solid #4CAF50;
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              letter-spacing: 2px;
            }
            .warning {
              color: #ff6b6b;
              font-size: 14px;
              margin-top: 20px;
              padding: 10px;
              background-color: #fff3cd;
              border-left: 4px solid #ff6b6b;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Recuperación de Contraseña</h2>
            </div>
            <div class="content">
              <p>Hola <strong>${usuario}</strong>,</p>
              <p>Has solicitado recuperar tu contraseña en el Sistema de Taller Motos Renacer.</p>
              <p>Tu nueva contraseña temporal es:</p>
              <div class="password-box">
                ${nuevaContrasena}
              </div>
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Esta es una contraseña temporal generada automáticamente</li>
                  <li>Se recomienda cambiarla después de iniciar sesión</li>
                  <li>No compartas esta contraseña con nadie</li>
                  <li>Si no solicitaste este cambio, contacta al administrador inmediatamente</li>
                </ul>
              </div>
              <p style="margin-top: 20px;">Puedes iniciar sesión con tu usuario y esta nueva contraseña en el sistema.</p>
              <p>Gracias,<br><strong>Equipo Taller Motos Renacer</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Correo enviado exitosamente:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw new Error(`No se pudo enviar el correo: ${error.message}`);
  }
};

/**
 * Verifica que el servicio de email esté configurado correctamente
 * @returns {Promise<boolean>}
 */
const verificarConfiguracion = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Variables de entorno EMAIL_USER y EMAIL_PASSWORD no configuradas');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Servicio de email configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error.message);
    return false;
  }
};

module.exports = {
  enviarNuevaContrasena,
  verificarConfiguracion
};
