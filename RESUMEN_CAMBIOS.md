# 🔧 Resumen de Cambios para Solucionar Cookies de Sesión

## 📋 Problema Original
- ✅ El login funciona correctamente
- ❌ Las cookies no se guardan en el navegador
- ❌ Al recargar la página, la sesión se pierde
- ❌ No se puede acceder a rutas protegidas

## 🎯 Causa Raíz
El backend (Render) y frontend (Vercel) están en **dominios diferentes**, y las cookies estaban configuradas con `sameSite: 'Strict'`, lo que **bloquea las cookies cross-origin**.

---

## ✅ Cambios Realizados

### 1️⃣ Backend - `index.js`
**Antes:**
```javascript
app.use(cors({
    origin: ['https://frontend-proyecto-si-1.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
```

**Después:**
```javascript
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://frontend-proyecto-si-1.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
```

**📝 Cambios clave:**
- ✨ Origin como función para validar múltiples dominios
- ✨ Agregado `exposedHeaders: ['Set-Cookie']`
- ✨ Agregado método PATCH

---

### 2️⃣ Backend - `authController.js` (Login)
**Antes:**
```javascript
res.cookie("access_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: "Strict",
  maxAge: 8 * 60 * 60 * 1000,
});
```

**Después:**
```javascript
res.cookie("access_token", token, {
  httpOnly: true,
  secure: true,           // ✨ Siempre true (necesario para sameSite: None)
  sameSite: "None",       // ✨ Cambiado de "Strict" a "None"
  maxAge: 8 * 60 * 60 * 1000,
  path: '/'              // ✨ Agregado
});
```

**📝 Cambios clave:**
- 🔑 `sameSite: "None"` - **Crítico** para cross-origin
- 🔒 `secure: true` - **Obligatorio** con sameSite: None
- 🛣️ `path: '/'` - Asegura que funcione en todas las rutas

---

### 3️⃣ Backend - `authController.js` (Logout)
**Antes:**
```javascript
res.clearCookie("access_token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: "Strict",
});
```

**Después:**
```javascript
res.clearCookie("access_token", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: '/'
});
```

---

### 4️⃣ Backend - `authMiddleware.js` (Logs de Debug)
**Agregado:**
```javascript
console.log('🔐 [Auth Middleware] Verificando autenticación...');
console.log('📨 Cookies recibidas:', req.cookies);
console.log('🌐 Origin:', req.headers.origin);
```

**📝 Propósito:**
- Ayuda a diagnosticar problemas con cookies
- Puedes comentar estos logs después de verificar que funciona

---

## 🚀 Pasos para Desplegar

### Paso 1: Verificar Variables de Entorno
**Render (Backend):**
- ✅ `NODE_ENV=production`
- ✅ `SECRET_KEY=tu_clave_secreta`
- ✅ `DATABASE_URL=tu_conexion_postgresql`

**Vercel (Frontend):**
- ✅ `VITE_API_BASE=https://api-renacer.onrender.com`

### Paso 2: Hacer Commit y Push
```bash
# En el directorio del backend
cd backend-proyecto-SI1
git add .
git commit -m "fix: configurar cookies para cross-origin authentication"
git push origin main
```

### Paso 3: Verificar Deploy
1. **Render** hará deploy automático del backend
2. **Vercel** ya tiene el código correcto del frontend
3. Espera 2-3 minutos para que se complete

---

## 🧪 Cómo Verificar que Funciona

### Test 1: Verificar en el Navegador

1. **Abre la aplicación** en Vercel
2. **Abre DevTools** (F12)
3. **Ve a la pestaña Network**
4. **Inicia sesión**
5. **Busca la petición a `/auth/login`**
6. **Verifica en Response Headers:**
   ```
   Set-Cookie: access_token=...; Path=/; HttpOnly; Secure; SameSite=None
   ```

### Test 2: Verificar Cookies Guardadas

1. **DevTools → Application → Cookies**
2. **Busca** `https://api-renacer.onrender.com`
3. **Deberías ver:**
   - Name: `access_token`
   - Value: (tu token JWT)
   - HttpOnly: ✅
   - Secure: ✅
   - SameSite: None

### Test 3: Verificar Persistencia de Sesión

1. **Inicia sesión** normalmente
2. **Recarga la página** (F5)
3. **La sesión debe mantenerse** ✅
4. **No deberías volver al login** ✅

---

## 🐛 Solución de Problemas

### Problema: "Las cookies aún no se guardan"

**Posibles causas:**
1. ❌ El backend no está en HTTPS → Render siempre usa HTTPS ✅
2. ❌ Variables de entorno incorrectas → Verifica en Render
3. ❌ CORS bloqueando → Revisa los logs del backend

**Solución:**
```bash
# Ver logs del backend en Render
# Dashboard → Tu servicio → Logs
```

Busca en los logs:
```
🍪 Configurando cookie con opciones: ...
🌐 Request Origin: https://frontend-proyecto-si-1.vercel.app
```

### Problema: "Token inválido"

**Causa:** `SECRET_KEY` diferente o no configurada

**Solución:**
1. Ve a Render → Environment
2. Verifica que `SECRET_KEY` tenga un valor
3. Si no existe, agrégala

### Problema: Error CORS

**Verifica en los logs del backend:**
```
Error: Not allowed by CORS
```

**Solución:** Asegúrate de que el origen está en la lista permitida:
```javascript
const allowedOrigins = [
    'https://frontend-proyecto-si-1.vercel.app',  // ✅ Tu dominio de Vercel
    'http://localhost:5173',
    'http://localhost:3000'
];
```

---

## 📊 Comparación Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| sameSite | `Strict` ❌ | `None` ✅ |
| secure | `conditional` | `true` ✅ |
| path | `undefined` | `/` ✅ |
| CORS origin | `array` | `function` ✅ |
| exposedHeaders | ❌ | `['Set-Cookie']` ✅ |
| Logs debug | ❌ | ✅ |

---

## 🎉 Resultado Esperado

Después de estos cambios:
- ✅ Login guarda la cookie en el navegador
- ✅ La sesión persiste al recargar
- ✅ Puedes navegar por la aplicación sin perder la sesión
- ✅ El logout limpia la cookie correctamente

---

## 🔒 Seguridad Mantenida

A pesar de usar `sameSite: None`, la seguridad se mantiene:
- ✅ `httpOnly: true` - JavaScript no puede acceder a la cookie
- ✅ `secure: true` - Solo se envía por HTTPS
- ✅ CORS configurado - Solo dominios permitidos
- ✅ JWT con expiración - Token expira en 8 horas

---

## 📚 Referencias

- [MDN - SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Chrome SameSite Changes](https://www.chromium.org/updates/same-site/)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
