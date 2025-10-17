# ❓ Preguntas Frecuentes - Autenticación con Cookies

## 🍪 Sobre Cookies

### ¿Por qué usar cookies en lugar de localStorage?
**Cookies (nuestra elección):**
- ✅ `httpOnly` previene ataques XSS (JavaScript no puede acceder)
- ✅ Más seguras para tokens de autenticación
- ✅ Se envían automáticamente en cada petición
- ❌ Requieren configuración CORS correcta

**localStorage:**
- ❌ Vulnerable a ataques XSS
- ❌ JavaScript puede leer el token
- ✅ Más fácil de implementar
- ✅ No requiere configuración especial

### ¿Qué significa cada atributo de la cookie?

```javascript
{
  httpOnly: true,      // JavaScript no puede leer la cookie
  secure: true,        // Solo se envía por HTTPS
  sameSite: "None",    // Permite cross-origin (Vercel ↔ Render)
  maxAge: 28800000,    // Expira en 8 horas (milisegundos)
  path: '/'            // Cookie válida en todas las rutas
}
```

### ¿Por qué sameSite: "None" y no "Strict" o "Lax"?

**sameSite: "Strict"** (más restrictivo)
- ✅ Máxima seguridad contra CSRF
- ❌ NO funciona cross-origin
- ❌ Bloquea cookies entre Vercel y Render

**sameSite: "Lax"** (medio)
- ✅ Balance seguridad/funcionalidad
- ❌ NO funciona bien cross-origin
- ❌ Puede bloquear algunas peticiones

**sameSite: "None"** (menos restrictivo)
- ✅ Funciona cross-origin
- ✅ Necesario para Vercel ↔ Render
- ⚠️ Requiere `secure: true` (HTTPS obligatorio)
- ⚠️ Más vulnerable a CSRF (mitigado con CORS)

### ¿Es seguro usar sameSite: "None"?

**Sí, porque tenemos múltiples capas de seguridad:**
1. ✅ `httpOnly: true` - Previene XSS
2. ✅ `secure: true` - Solo HTTPS
3. ✅ CORS configurado - Solo dominios permitidos
4. ✅ JWT con expiración - Token expira
5. ✅ Middleware de autenticación - Verifica cada petición

---

## 🌐 Sobre CORS

### ¿Qué es CORS?
**Cross-Origin Resource Sharing** - Mecanismo de seguridad del navegador que controla qué dominios pueden acceder a tu API.

**Sin CORS:** Cualquier sitio web podría robar datos de tu API
**Con CORS:** Solo dominios específicos pueden acceder

### ¿Por qué necesito credentials: true?

```javascript
// Backend
cors({
  origin: '...',
  credentials: true  // ← Permite enviar cookies cross-origin
})

// Frontend
fetch(url, {
  credentials: 'include'  // ← Envía cookies en la petición
})
```

Sin `credentials: true`, el navegador **bloquea** las cookies en peticiones cross-origin.

### ¿Por qué la función en origin en lugar de un array?

**Array (antiguo):**
```javascript
origin: ['https://frontend...']
```
- ✅ Simple
- ❌ No permite lógica adicional
- ❌ Difícil agregar condicionales

**Función (nuevo, mejor):**
```javascript
origin: function (origin, callback) {
  if (!origin) return callback(null, true);  // Permite Postman, apps móviles
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}
```
- ✅ Más flexible
- ✅ Permite diferentes entornos (dev, prod)
- ✅ Mejor manejo de errores

---

## 🔐 Sobre JWT (JSON Web Tokens)

### ¿Qué contiene el token JWT?

```javascript
jwt.sign({
  id: user.id,           // ID del usuario en la BD
  usuario: user.usuario, // Nombre de usuario
  email: user.email,     // Email
  isAdmin: isAdmin,      // ¿Es administrador?
  empleado_ci: user.empleado_ci
}, SECRET_KEY, {
  expiresIn: "8h"        // Expira en 8 horas
})
```

### ¿Puedo ver el contenido del JWT?

**Sí**, en [jwt.io](https://jwt.io)
- ⚠️ Cualquiera puede leer el token (está en base64)
- ✅ Pero NO pueden modificarlo sin la SECRET_KEY
- ✅ Por eso nunca guardes info sensible (contraseñas, etc.)

### ¿Qué pasa si alguien roba el token?

**Medidas de seguridad:**
1. ✅ Token expira en 8 horas (límite de daño)
2. ✅ `httpOnly` previene robo por JavaScript
3. ✅ `secure` previene robo en HTTP
4. ✅ HTTPS encripta la comunicación

**Mejor práctica adicional (futuro):**
- Implementar refresh tokens
- Implementar lista negra de tokens
- Implementar logout en todos los dispositivos

---

## 🚀 Sobre Deploy

### ¿Cuánto tarda el deploy?

**Render (Backend):**
- ⏱️ 2-5 minutos normalmente
- ⏱️ 5-10 minutos si instala dependencias

**Vercel (Frontend):**
- ⏱️ 1-2 minutos normalmente
- ⚡ Muy rápido porque es static

### ¿Necesito hacer deploy del frontend también?

**No**, si los cambios fueron solo en el backend.

**Sí**, si modificaste:
- `App.jsx`
- `apiConfig.js`
- Cualquier archivo del frontend

### ¿Cómo sé si el deploy fue exitoso?

**Render:**
1. Dashboard → Tu servicio
2. Estado: "Live" (verde)
3. Logs: Sin errores rojos

**Vercel:**
1. Dashboard → Tu proyecto
2. Deployment status: "Ready"
3. No hay errores en el build

---

## 🐛 Troubleshooting

### La cookie no aparece en DevTools

**Verificar:**
1. ✅ DevTools → Application → Cookies
2. ✅ Buscar el dominio del **backend** (no frontend)
3. ✅ La cookie está en `api-renacer.onrender.com`

**No busques la cookie en:**
❌ `frontend-proyecto-si-1.vercel.app`

### Error: "No hay token de autenticación"

**Posibles causas:**
1. Cookie no se envió → Verificar `credentials: "include"`
2. Cookie expiró → Verificar fecha de expiración
3. Path incorrecto → Verificar `path: '/'`

**Debug:**
```javascript
// En authMiddleware.js
console.log('Cookies:', req.cookies);
```

### Error: "Token inválido"

**Posibles causas:**
1. `SECRET_KEY` diferente entre login y verificación
2. `SECRET_KEY` cambió después del login
3. Token corrupto o modificado

**Solución:**
1. Verificar `SECRET_KEY` en Render
2. Hacer logout y volver a hacer login
3. Generar nueva `SECRET_KEY` si es necesario

### Error CORS: "Access to fetch has been blocked"

**Causas comunes:**
1. Frontend no está en `allowedOrigins`
2. `credentials: true` falta en CORS
3. `credentials: "include"` falta en fetch

**Solución:**
```javascript
// Verificar que coincidan:
// Backend
origin: 'https://frontend-proyecto-si-1.vercel.app'

// Frontend hace fetch desde
https://frontend-proyecto-si-1.vercel.app
```

### La sesión se pierde al recargar

**Verificar:**
1. ✅ Cookie existe en DevTools → Application → Cookies
2. ✅ Cookie no ha expirado (MaxAge)
3. ✅ `credentials: "include"` en fetch de verificación
4. ✅ Ruta `/auth/verificar` funciona

**Debug:**
En `App.jsx`, verificar que existe:
```javascript
useEffect(() => {
  const verificarSesion = async () => {
    const res = await fetch(`${API_BASE}/auth/verificar`, {
      method: "GET",
      credentials: "include",  // ← CRÍTICO
    });
    // ...
  };
  verificarSesion();
}, []);
```

---

## 💡 Best Practices

### ¿Cada cuánto debo rotar la SECRET_KEY?

**Recomendaciones:**
- 🟢 Cada 6-12 meses en producción
- 🟡 Si sospechas de compromiso: **inmediatamente**
- 🔴 Nunca compartas la SECRET_KEY
- 🔴 Nunca la subas a GitHub

**Al cambiar SECRET_KEY:**
1. Todos los usuarios perderán su sesión
2. Deberán volver a hacer login
3. Avisa a los usuarios con anticipación

### ¿Debo aumentar el tiempo de expiración?

**Actual: 8 horas**

**Consideraciones:**
- 🟢 Más conveniente para usuarios
- 🔴 Mayor ventana para ataques si roban el token

**Recomendaciones:**
- ✅ 8 horas: Bueno para apps internas
- ✅ 24 horas: Apps de uso frecuente
- ✅ 1 hora + refresh token: Máxima seguridad

### ¿Debería implementar refresh tokens?

**Sí, para producción seria:**

**Ventajas:**
- ✅ Token de acceso de corta duración (15 min)
- ✅ Refresh token de larga duración (30 días)
- ✅ Si roban access token, expira rápido
- ✅ No obligan al usuario a re-autenticarse seguido

**Implementación futura:**
```javascript
// Access token: 15 minutos
accessToken = jwt.sign({...}, SECRET, { expiresIn: '15m' })

// Refresh token: 30 días (guardado en BD)
refreshToken = jwt.sign({...}, REFRESH_SECRET, { expiresIn: '30d' })
```

---

## 📊 Monitoreo

### ¿Cómo monitorear los logins?

**Ya implementado - Tabla Bitácora:**
```sql
SELECT * FROM bitacora 
WHERE descripcion LIKE '%login%' 
ORDER BY fecha_hora DESC 
LIMIT 20;
```

**Eventos que se registran:**
- ✅ Login exitoso
- ✅ Login fallido (contraseña incorrecta)
- ✅ Usuario bloqueado por intentos
- ✅ Logout

### ¿Cómo ver usuarios bloqueados?

**Endpoint ya creado:**
```
GET /auth/usuarios-bloqueados
```

**Requiere:** Token de administrador

---

## 🔄 Mantenimiento

### ¿Necesito hacer algo periódicamente?

**Mensual:**
- [ ] Revisar logs de errores en Render
- [ ] Verificar usuarios bloqueados sin desbloquear
- [ ] Revisar bitácora de eventos sospechosos

**Semestral:**
- [ ] Considerar cambiar SECRET_KEY
- [ ] Revisar permisos de usuarios
- [ ] Actualizar dependencias

**Anual:**
- [ ] Auditoría de seguridad completa
- [ ] Cambiar SECRET_KEY obligatoriamente
- [ ] Revisar políticas de acceso

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Express Cookie Parser](https://github.com/expressjs/cookie-parser)
- [JWT.io](https://jwt.io)
- [MDN - HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### Tutoriales Relacionados
- [Secure Authentication with Cookies](https://blog.logrocket.com/jwt-authentication-best-practices/)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

---

## ❓ ¿Tienes más preguntas?

Si encuentras un problema no cubierto aquí:
1. Revisa `CHECKLIST.md` - Pasos de verificación
2. Revisa `RESUMEN_CAMBIOS.md` - Comparación antes/después
3. Revisa `CONFIGURACION_COOKIES.md` - Detalles técnicos
4. Revisa los logs del backend en Render
5. Revisa la consola del navegador (DevTools)
