# ✅ Checklist de Implementación - Solución de Cookies

## Pre-requisitos
- [ ] Tienes acceso al dashboard de Render
- [ ] Tienes acceso al dashboard de Vercel
- [ ] Tienes acceso al repositorio de GitHub

---

## Paso 1: Verificar Variables de Entorno

### Backend (Render)
1. [ ] Ir a [Render Dashboard](https://dashboard.render.com/)
2. [ ] Seleccionar tu servicio backend
3. [ ] Ir a "Environment"
4. [ ] Verificar que existan estas variables:
   - [ ] `NODE_ENV` = `production`
   - [ ] `SECRET_KEY` = (una clave secreta fuerte)
   - [ ] `DATABASE_URL` = (tu conexión PostgreSQL)
5. [ ] Si falta `NODE_ENV`, agregala con valor `production`
6. [ ] Si `SECRET_KEY` no existe o es débil, genera una nueva:
   ```bash
   # En tu terminal local
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
7. [ ] Copia el resultado y pégalo como valor de `SECRET_KEY`

### Frontend (Vercel)
1. [ ] Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Seleccionar tu proyecto frontend
3. [ ] Ir a "Settings" → "Environment Variables"
4. [ ] Verificar que exista:
   - [ ] `VITE_API_BASE` = `https://api-renacer.onrender.com`
5. [ ] Si no existe, agrégala

---

## Paso 2: Aplicar Cambios en el Código

### Cambios ya realizados (verificar):
- [ ] `backend-proyecto-SI1/index.js` - CORS configurado ✅
- [ ] `backend-proyecto-SI1/controllers/Administracion/authController.js` - Cookies con sameSite: None ✅
- [ ] `backend-proyecto-SI1/middlewares/authMiddleware.js` - Logs de debug ✅
- [ ] Frontend ya tiene `credentials: "include"` ✅

---

## Paso 3: Deploy del Backend

### Opción A: Push automático (recomendado)
```bash
cd backend-proyecto-SI1
git status                    # Ver archivos modificados
git add .                     # Agregar todos los cambios
git commit -m "fix: configurar cookies para cross-origin authentication"
git push origin main          # Hacer push
```

- [ ] Hacer commit y push
- [ ] Ir a Render Dashboard
- [ ] Verificar que el deploy se inicie automáticamente
- [ ] Esperar a que el deploy termine (2-5 minutos)
- [ ] Verificar que el estado sea "Live" (verde)

### Opción B: Deploy manual
- [ ] Ir a Render Dashboard
- [ ] Click en "Manual Deploy" → "Deploy latest commit"
- [ ] Esperar a que termine

---

## Paso 4: Verificar los Logs del Backend

1. [ ] En Render Dashboard, ir a "Logs"
2. [ ] Buscar líneas como:
   ```
   Server is running on port 3000
   ```
3. [ ] No debería haber errores en rojo

---

## Paso 5: Probar la Aplicación

### Test Manual en el Navegador
1. [ ] Abrir https://frontend-proyecto-si-1.vercel.app
2. [ ] Abrir DevTools (F12)
3. [ ] Ir a la pestaña "Network"
4. [ ] Iniciar sesión con tus credenciales
5. [ ] Buscar la petición a `/auth/login`
6. [ ] Verificar en "Response Headers":
   ```
   Set-Cookie: access_token=...; Path=/; HttpOnly; Secure; SameSite=None
   ```
7. [ ] Ir a DevTools → "Application" → "Cookies"
8. [ ] Buscar `https://api-renacer.onrender.com`
9. [ ] Verificar que exista la cookie `access_token`:
   - [ ] HttpOnly: ✅
   - [ ] Secure: ✅
   - [ ] SameSite: None
   - [ ] Path: /

### Test de Persistencia
1. [ ] Con sesión iniciada, recargar la página (F5)
2. [ ] Verificar que NO vuelvas al login
3. [ ] Verificar que puedas navegar por la aplicación
4. [ ] Cerrar la pestaña y volver a abrir
5. [ ] Verificar que la sesión se mantenga (si no pasaron 8 horas)

### Test de Logout
1. [ ] Hacer clic en "Cerrar Sesión"
2. [ ] Verificar que vuelvas al login
3. [ ] DevTools → Application → Cookies
4. [ ] Verificar que la cookie `access_token` haya desaparecido

### Test Automatizado (Opcional)
En Windows PowerShell:
```powershell
cd backend-proyecto-SI1
.\test-auth.ps1
```

Verificar que todos los tests pasen con ✅

---

## Paso 6: Revisar Logs del Backend (Debug)

1. [ ] Ir a Render → Logs
2. [ ] Hacer un login desde el frontend
3. [ ] Buscar en los logs:
   ```
   🍪 Configurando cookie con opciones: ...
   🌐 Request Origin: https://frontend-proyecto-si-1.vercel.app
   ```
4. [ ] Navegar a otra página en el frontend
5. [ ] Buscar en los logs:
   ```
   🔐 [Auth Middleware] Verificando autenticación...
   📨 Cookies recibidas: { access_token: '...' }
   ✅ Token válido para usuario: ...
   ```

---

## Paso 7: Limpieza (Opcional)

Una vez que todo funcione correctamente, puedes remover los logs de debug:

### En `authMiddleware.js`:
```javascript
// Comentar o eliminar estas líneas:
console.log('🔐 [Auth Middleware] Verificando autenticación...');
console.log('📨 Cookies recibidas:', req.cookies);
console.log('🌐 Origin:', req.headers.origin);
console.log('✅ Token encontrado, verificando...');
console.log('✅ Token válido para usuario:', decoded.usuario);
console.log('❌ Token inválido:', error.message);
```

### En `authController.js` (login):
```javascript
// Comentar o eliminar estas líneas:
console.log('🍪 Configurando cookie con opciones:', cookieOptions);
console.log('🌐 Request Origin:', req.headers.origin);
```

- [ ] Comentar logs de debug
- [ ] Hacer commit y push
- [ ] Verificar que sigue funcionando

---

## Problemas Comunes y Soluciones

### ❌ Problema: Cookie no aparece en DevTools
**Posibles causas:**
- Backend no está en HTTPS
- Variables de entorno incorrectas
- CORS bloqueando la respuesta

**Solución:**
1. Verificar que Render use HTTPS (debería ser por defecto)
2. Revisar variables de entorno en Render
3. Ver logs del backend

### ❌ Problema: "No hay token de autenticación"
**Causa:** La cookie no se envía en las peticiones subsecuentes

**Solución:**
1. Verificar que `credentials: "include"` esté en el fetch
2. Verificar que el dominio de la cookie sea correcto
3. Ver DevTools → Network → Headers de la petición

### ❌ Problema: Error CORS
**Causa:** El origen no está permitido

**Solución:**
1. Verificar que el frontend esté en la lista `allowedOrigins`
2. Ver logs del backend para el error exacto

### ❌ Problema: "Token inválido"
**Causa:** `SECRET_KEY` diferente o no configurada

**Solución:**
1. Verificar `SECRET_KEY` en Render
2. Asegurarse de que no tenga espacios ni caracteres raros

---

## ✅ Checklist Final

- [ ] Variables de entorno configuradas en Render
- [ ] Variables de entorno configuradas en Vercel
- [ ] Cambios committed y pushed a GitHub
- [ ] Backend deployed en Render (estado: Live)
- [ ] Login funciona y guarda cookie
- [ ] Sesión persiste al recargar
- [ ] Puedo navegar sin perder sesión
- [ ] Logout limpia la cookie correctamente
- [ ] Logs de debug funcionan (opcional)

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs del backend en Render
2. Revisa la consola del navegador (F12)
3. Verifica las cookies en DevTools → Application
4. Compara con los ejemplos en `RESUMEN_CAMBIOS.md`

---

## 🎉 ¡Éxito!

Si todos los checkboxes están marcados, tu aplicación ahora debería:
- ✅ Guardar cookies de sesión correctamente
- ✅ Mantener la sesión al recargar
- ✅ Funcionar en producción (Vercel + Render)
- ✅ Ser segura (HttpOnly, Secure, HTTPS)
