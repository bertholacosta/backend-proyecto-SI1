# 🔧 Solución para Problemas de Sesión Cross-Origin

## 📋 Resumen del Problema
- ✅ Login funciona correctamente
- ✅ Verificación de roles funciona  
- ❌ No se guardan las cookies entre Vercel (frontend) y Render (backend)
- ❌ Al acceder a usuarios/clientes sale error por falta de autenticación

## 🎯 Soluciones Implementadas en el Backend

### 1. Configuración de Cookies Cross-Origin
```javascript
// En authController.js - Login
res.cookie("access_token", token, {
    httpOnly: true,
    secure: true, // HTTPS en producción
    sameSite: 'None', // Permite cross-origin
    maxAge: 3600000 // 1 hora
});
```

### 2. CORS Configurado para Cross-Origin
```javascript
// En index.js
credentials: true, // MUY IMPORTANTE para cookies
allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', ...],
exposedHeaders: ['Set-Cookie']
```

### 3. Autenticación Dual (Cookies + Headers)
- Prioridad: Cookies
- Fallback: Authorization Bearer token

## 🚀 Lo que DEBES hacer en tu Frontend

### ⚠️ CRÍTICO: Todas las peticiones deben incluir `credentials: 'include'`

```javascript
// ❌ ESTO NO FUNCIONA
fetch('https://tu-backend.onrender.com/usuarios')

// ✅ ESTO SÍ FUNCIONA  
fetch('https://tu-backend.onrender.com/usuarios', {
    credentials: 'include' // <- ESTO ES OBLIGATORIO
})
```

### 1. Modificar tu función de login
```javascript
const login = async (usuario, contrasena) => {
    const response = await fetch('https://tu-backend.onrender.com/auth/login', {
        method: 'POST',
        credentials: 'include', // <- AGREGAR ESTO
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
    });

    const data = await response.json();
    
    if (response.ok) {
        // Guardar token también como backup
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
    }
    
    return data;
};
```

### 2. Crear función para peticiones autenticadas
```javascript
const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    return fetch(url, {
        ...options,
        credentials: 'include', // <- SIEMPRE incluir esto
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    });
};

// Usar así:
const getUsuarios = async () => {
    const response = await authenticatedFetch('https://tu-backend.onrender.com/usuarios');
    return response.json();
};
```

### 3. Verificar sesión al cargar la app
```javascript
useEffect(() => {
    const checkSession = async () => {
        try {
            const response = await authenticatedFetch(
                'https://tu-backend.onrender.com/auth/verificar-sesion'
            );
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Limpiar sesión inválida
                localStorage.clear();
                navigate('/login');
            }
        } catch (error) {
            console.error('Error verificando sesión:', error);
        }
    };
    
    checkSession();
}, []);
```

## 🧪 Cómo Probar

### 1. Usar el archivo de test
Abre `test-auth.html` en tu navegador, cambia la URL por tu backend de Render y prueba cada paso.

### 2. Verificar en DevTools
Después del login, ve a:
- **Application tab → Cookies**: Debes ver `access_token`
- **Network tab**: Verifica que las peticiones incluyen cookies
- **Console**: Revisa errores de CORS

### 3. Test manual con curl
```bash
# 1. Login
curl -X POST https://tu-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"123456"}' \
  -c cookies.txt

# 2. Usar la cookie para obtener usuarios
curl https://tu-backend.onrender.com/usuarios \
  -b cookies.txt
```

## 📝 Variables de Entorno en Render
Asegúrate de tener configuradas:
```
NODE_ENV=production
SECRET_KEY=tu-clave-super-secreta
DATABASE_URL=postgresql://...
```

## 🔍 Debugging
Si sigue sin funcionar:

1. **Ve a los logs de Render** para ver qué está recibiendo el backend
2. **Usa la ruta de debug**: `GET /auth/debug-cookies` 
3. **Revisa la consola del navegador** para errores de CORS
4. **Verifica que tu URL de backend sea correcta** (sin slash final)

## ✅ Checklist Final
- [ ] Todas las peticiones del frontend incluyen `credentials: 'include'`
- [ ] Token también se guarda en localStorage como backup
- [ ] Backend desplegado con los nuevos cambios en Render
- [ ] Variables de entorno configuradas en Render
- [ ] URL del backend correcta en el frontend (sin slash final)
- [ ] Verificar cookies en DevTools después del login

Una vez que implementes `credentials: 'include'` en todas tus peticiones del frontend, el problema de sesión debería resolverse.