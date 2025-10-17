# 🔧 Solución: Cookies de Sesión Cross-Origin

## 📋 Descripción del Problema
Tu aplicación tenía un problema donde:
- ✅ El login funcionaba correctamente
- ❌ Las cookies de sesión no se guardaban
- ❌ Al recargar la página, la sesión se perdía
- ❌ La autenticación fallaba por falta de cookies

**Causa:** Configuración incorrecta de cookies para comunicación cross-origin entre:
- **Frontend:** Vercel (https://frontend-proyecto-si-1.vercel.app)
- **Backend:** Render (https://api-renacer.onrender.com)

## ✅ Solución Implementada

### Cambios Principales

1. **CORS configurado para cross-origin** (`index.js`)
   - Origin como función validadora
   - Credentials habilitado
   - Headers de cookies expuestos

2. **Cookies configuradas para cross-origin** (`authController.js`)
   - `sameSite: "None"` (permite cross-origin)
   - `secure: true` (HTTPS obligatorio)
   - `path: '/'` (todas las rutas)
   - `httpOnly: true` (seguridad XSS)

3. **Logs de debug agregados** (`authMiddleware.js`)
   - Verificar cookies recibidas
   - Verificar origen de peticiones
   - Ayuda en troubleshooting

## 📚 Documentación

### 🚀 Para Empezar Rápido
**→ [INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - 3 pasos esenciales

### ✅ Guía Completa de Implementación
**→ [CHECKLIST.md](CHECKLIST.md)** - Lista de verificación paso a paso

### 📖 Explicación Detallada
**→ [RESUMEN_CAMBIOS.md](RESUMEN_CAMBIOS.md)** - Comparación antes/después con explicaciones

### 🔧 Configuración Técnica
**→ [CONFIGURACION_COOKIES.md](CONFIGURACION_COOKIES.md)** - Detalles de implementación

### ❓ Preguntas y Problemas
**→ [FAQ.md](FAQ.md)** - Preguntas frecuentes y solución de problemas

## 🚀 Deploy Rápido

```bash
# 1. Verificar cambios
git status

# 2. Commit
git add .
git commit -m "fix: configurar cookies para cross-origin authentication"

# 3. Push (deploy automático en Render)
git push origin main

# 4. Verificar deploy en Render Dashboard
# Estado debe ser "Live" (verde)
```

## 🧪 Verificar que Funciona

### Opción 1: Test Manual (Navegador)
1. Abrir https://frontend-proyecto-si-1.vercel.app
2. Login con tus credenciales
3. F12 → Application → Cookies → `api-renacer.onrender.com`
4. Verificar cookie `access_token` con:
   - HttpOnly: ✅
   - Secure: ✅
   - SameSite: None
5. Recargar página → Sesión debe mantenerse

### Opción 2: Test Automatizado (PowerShell)
```powershell
cd backend-proyecto-SI1
.\test-auth.ps1
```

## 📊 Archivos Modificados

### Backend
- ✅ `index.js` - CORS configurado
- ✅ `controllers/Administracion/authController.js` - Cookies cross-origin
- ✅ `middlewares/authMiddleware.js` - Logs de debug

### Frontend
- ℹ️ No requiere cambios (ya tiene `credentials: "include"`)

### Nuevos Archivos (Documentación)
- 📄 `.env.example` - Template de variables de entorno
- 📄 `INICIO_RAPIDO.md` - Guía rápida
- 📄 `CHECKLIST.md` - Lista de verificación completa
- 📄 `RESUMEN_CAMBIOS.md` - Explicación detallada
- 📄 `CONFIGURACION_COOKIES.md` - Detalles técnicos
- 📄 `FAQ.md` - Preguntas frecuentes
- 📄 `test-auth.ps1` - Script de pruebas (Windows)
- 📄 `test-auth.sh` - Script de pruebas (Linux/Mac)

## ⚙️ Variables de Entorno Requeridas

### Render (Backend)
```env
NODE_ENV=production
SECRET_KEY=tu_clave_secreta_super_segura
DATABASE_URL=postgresql://...
```

### Vercel (Frontend)
```env
VITE_API_BASE=https://api-renacer.onrender.com
```

## 🔒 Seguridad

Esta implementación mantiene altos estándares de seguridad:
- ✅ **httpOnly**: JavaScript no puede acceder a la cookie
- ✅ **secure**: Solo se envía por HTTPS
- ✅ **sameSite: None**: Permite cross-origin (necesario para Vercel ↔ Render)
- ✅ **CORS estricto**: Solo dominios permitidos
- ✅ **JWT con expiración**: Token expira en 8 horas
- ✅ **Middleware de auth**: Verifica cada petición

## 🐛 Troubleshooting

### Cookie no se guarda
1. Verificar variables de entorno en Render
2. Ver logs del backend: buscar 🍪 emoji
3. Verificar HTTPS en ambos dominios
4. Revisar [FAQ.md](FAQ.md) sección "Cookie no aparece"

### Sesión se pierde al recargar
1. Verificar cookie existe en DevTools
2. Verificar `credentials: "include"` en fetch
3. Ver logs del backend: buscar 🔐 emoji
4. Revisar [FAQ.md](FAQ.md) sección "Sesión se pierde"

### Error CORS
1. Verificar origen en `allowedOrigins`
2. Ver logs del backend
3. Revisar [FAQ.md](FAQ.md) sección "Error CORS"

## 📞 Soporte

Si encuentras problemas:
1. Revisar [CHECKLIST.md](CHECKLIST.md) - Verificación paso a paso
2. Revisar [FAQ.md](FAQ.md) - Problemas comunes
3. Ver logs en Render Dashboard
4. Ver consola del navegador (F12)

## 🎯 Próximos Pasos (Opcional)

Para mejorar aún más la seguridad:
- [ ] Implementar refresh tokens
- [ ] Implementar lista negra de tokens
- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Monitoreo de sesiones activas
- [ ] Rate limiting en login

Ver [FAQ.md](FAQ.md) sección "Best Practices" para más detalles.

## 📈 Monitoreo

### Logs del Backend (Render)
```
🍪 Configurando cookie con opciones: ...
🔐 [Auth Middleware] Verificando autenticación...
✅ Token válido para usuario: ...
```

### Eventos en Bitácora (Base de Datos)
```sql
SELECT * FROM bitacora 
WHERE descripcion LIKE '%login%' 
ORDER BY fecha_hora DESC;
```

## 🌟 Estado del Proyecto

| Component | Status | Details |
|-----------|--------|---------|
| CORS Config | ✅ Listo | Cross-origin habilitado |
| Cookie Config | ✅ Listo | sameSite: None + secure |
| Auth Middleware | ✅ Listo | Con logs de debug |
| Frontend | ✅ Listo | credentials: include |
| Testing | ✅ Listo | Scripts de prueba creados |
| Documentación | ✅ Listo | Guías completas |

## 📝 Notas Importantes

1. **HTTPS es obligatorio** - `secure: true` requiere HTTPS (Render y Vercel lo tienen por defecto)
2. **SECRET_KEY es crítica** - No la compartas ni la subas a GitHub
3. **Logs de debug** - Puedes comentarlos después de verificar que funciona
4. **Expiración** - Los tokens expiran en 8 horas (configurable)

## 🎉 Resultado Final

Después de aplicar estos cambios:
- ✅ Login guarda la cookie correctamente
- ✅ Sesión persiste al recargar la página
- ✅ Navegación sin perder sesión
- ✅ Logout limpia la cookie
- ✅ Comunicación segura HTTPS
- ✅ Protección contra XSS (httpOnly)
- ✅ Funciona en producción (Vercel + Render)

---

**¿Listo para desplegar?** → [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

**¿Necesitas más detalles?** → [CHECKLIST.md](CHECKLIST.md)

**¿Tienes problemas?** → [FAQ.md](FAQ.md)
