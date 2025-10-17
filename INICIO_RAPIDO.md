# 🚀 Inicio Rápido - Solución de Cookies

## 📌 Problema
✅ Login funciona  
❌ Cookies no se guardan  
❌ Sesión se pierde al recargar  

## 🎯 Solución en 3 Pasos

### 1️⃣ Verificar Variables de Entorno en Render
```
NODE_ENV=production
SECRET_KEY=tu_clave_secreta_aqui
DATABASE_URL=postgresql://...
```

### 2️⃣ Hacer Deploy
```bash
cd backend-proyecto-SI1
git add .
git commit -m "fix: cookies cross-origin"
git push origin main
```

### 3️⃣ Verificar que Funciona
1. Login en https://frontend-proyecto-si-1.vercel.app
2. F12 → Application → Cookies
3. Buscar `access_token` en `api-renacer.onrender.com`
4. Recargar página → sesión debe mantenerse ✅

## 📝 Cambios Clave Aplicados

**Backend (index.js):**
```javascript
// CORS permite cross-origin con credenciales
credentials: true
exposedHeaders: ['Set-Cookie']
```

**Backend (authController.js):**
```javascript
// Cookie configurada para cross-origin
sameSite: "None"  // Cambiado de "Strict"
secure: true      // Obligatorio con None
path: '/'         // Para todas las rutas
```

**Frontend (App.jsx):**
```javascript
// Ya incluye credentials en todos los fetch
credentials: "include"
```

## 🐛 Si No Funciona

1. **Ver logs en Render:** Buscar 🍪 y 🔐
2. **Ver cookies en navegador:** F12 → Application → Cookies
3. **Revisar CHECKLIST.md** para pasos detallados

## 📚 Documentación Completa

- **CHECKLIST.md** - Guía paso a paso completa
- **RESUMEN_CAMBIOS.md** - Comparación detallada antes/después
- **FAQ.md** - Preguntas frecuentes y troubleshooting
- **CONFIGURACION_COOKIES.md** - Detalles técnicos

## ✅ Éxito = Estos 4 Checks

- [x] Cookie aparece en DevTools después del login
- [x] Sesión persiste al recargar (F5)
- [x] Puedes navegar sin perder sesión
- [x] Logout elimina la cookie

---

**¡Listo para producción! 🎉**
