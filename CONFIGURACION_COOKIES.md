# Configuración de Cookies para Autenticación Cross-Origin

## Problema Identificado
Las cookies de sesión no se guardaban porque el backend y frontend están en dominios diferentes:
- **Frontend**: Vercel (https://frontend-proyecto-si-1.vercel.app)
- **Backend**: Render (https://api-renacer.onrender.com)

## Cambios Realizados

### 1. Backend - index.js
✅ **CORS configurado** para permitir credenciales cross-origin:
- Agregado `origin` como función para validar múltiples dominios
- Agregado `credentials: true` 
- Agregado `exposedHeaders: ['Set-Cookie']`

### 2. Backend - authController.js
✅ **Configuración de cookies** para cross-origin:
- `sameSite: "None"` (cambiado de "Strict")
- `secure: true` (obligatorio con sameSite: None)
- `httpOnly: true` (mantiene la seguridad)
- `path: '/'` (asegura que la cookie funcione en todas las rutas)

### 3. Frontend - App.jsx
✅ **Fetch con credenciales**:
- Todas las llamadas fetch incluyen `credentials: "include"`
- Esto permite enviar y recibir cookies cross-origin

## Variables de Entorno Necesarias

### Backend (.env)
```env
NODE_ENV=production
SECRET_KEY=tu_clave_secreta_super_segura
DATABASE_URL=tu_conexion_postgresql
```

### Frontend (Vercel)
```env
VITE_API_BASE=https://api-renacer.onrender.com
```

## Desplegar los Cambios

### 1. Backend (Render)
1. Asegúrate de que las variables de entorno estén configuradas en Render
2. Haz commit y push de los cambios
3. Render hará el deploy automáticamente

### 2. Frontend (Vercel)
No requiere cambios adicionales, ya que el código fetch ya incluye `credentials: "include"`

## Verificar que Funciona

### Test 1: Login
```bash
curl -X POST https://api-renacer.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  -d '{"usuario":"test","contrasena":"test123"}' \
  --verbose
```

Deberías ver en la respuesta:
```
Set-Cookie: access_token=...; Path=/; HttpOnly; Secure; SameSite=None
```

### Test 2: Verificar Sesión
```bash
curl -X GET https://api-renacer.onrender.com/auth/verificar \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  -H "Cookie: access_token=TU_TOKEN_AQUI" \
  --verbose
```

## Consideraciones de Seguridad

✅ **httpOnly: true** - La cookie no es accesible desde JavaScript
✅ **secure: true** - Solo se envía por HTTPS
✅ **sameSite: None** - Permite cross-origin (necesario para Vercel ↔ Render)
✅ **maxAge** - La cookie expira después de 8 horas

## Solución de Problemas

### Problema: Las cookies aún no se guardan
1. Verifica que ambos dominios usen HTTPS (no HTTP)
2. Verifica que `credentials: "include"` esté en todas las llamadas fetch
3. Verifica las variables de entorno en Render
4. Revisa la consola del navegador (Application → Cookies)

### Problema: Error "Blocked by CORS"
1. Verifica que el origen del frontend esté en la lista permitida del backend
2. Verifica que el backend incluya `credentials: true` en CORS

### Problema: Cookie no se envía en requests subsecuentes
1. Verifica que el dominio de la cookie sea correcto (no debe tener domain específico para cross-origin)
2. Verifica que `path: '/'` esté configurado

## Logs para Debug

Puedes agregar estos logs temporales en el backend para debug:

```javascript
// En authController.js - login
console.log('🍪 Cookie configurada:', {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  maxAge: 8 * 60 * 60 * 1000,
  path: '/'
});

// En authMiddleware.js
console.log('📨 Cookies recibidas:', req.cookies);
console.log('🔑 Token extraído:', req.cookies.access_token ? 'SÍ' : 'NO');
```
