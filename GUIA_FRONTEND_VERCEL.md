# 🎯 Guía Específica para tu Frontend en Vercel

## 📋 Información del Sistema
- **Frontend**: https://frontend-proyecto-si-1.vercel.app/
- **Backend**: [Tu URL de Render] (necesitas actualizarla)
- **Credenciales**: 
  - Usuario: `hola123`
  - Contraseña: `password`

## 🔧 Lo que DEBES cambiar en tu Frontend

### 1. Configurar la URL base del backend
```javascript
// En tu archivo de configuración o constantes
const API_BASE_URL = 'https://tu-backend-en-render.onrender.com'; // ← ACTUALIZAR CON TU URL REAL
```

### 2. Función de login corregida
```javascript
const login = async (usuario, contrasena) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include', // ← MUY IMPORTANTE - AGREGAR ESTO
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                usuario: usuario,    // 'hola123'
                contrasena: contrasena // 'password'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Opcional: guardar también en localStorage como backup
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                usuario: data.usuario,
                email: data.email,
                isAdmin: data.isAdmin
            }));
            
            console.log('✅ Login exitoso:', data);
            return data;
        } else {
            console.error('❌ Error en login:', data);
            throw new Error(data.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('❌ Error de red en login:', error);
        throw error;
    }
};
```

### 3. Función para peticiones autenticadas
```javascript
const authenticatedFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        credentials: 'include', // ← SIEMPRE incluir esto
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Token de backup
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
        
        // Si es 401, limpiar sesión y redirigir
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return null;
        }

        return response;
    } catch (error) {
        console.error('Error en petición autenticada:', error);
        throw error;
    }
};

// Ejemplos de uso:
const getUsuarios = async () => {
    const response = await authenticatedFetch('/usuarios');
    if (response) return response.json();
};

const getClientes = async () => {
    const response = await authenticatedFetch('/clientes');
    if (response) return response.json();
};
```

### 4. Verificar sesión al cargar la app
```javascript
// En tu componente principal o App.jsx
useEffect(() => {
    const verificarSesion = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verificar-sesion`, {
                credentials: 'include' // ← IMPORTANTE
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                console.log('✅ Sesión válida:', userData);
            } else {
                console.log('ℹ️ No hay sesión válida');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error verificando sesión:', error);
        }
    };
    
    verificarSesion();
}, []);
```

### 5. Logout correcto
```javascript
const logout = async () => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include' // ← IMPORTANTE
        });
        console.log('✅ Logout del servidor exitoso');
    } catch (error) {
        console.error('Error en logout del servidor:', error);
    } finally {
        // Limpiar siempre, independientemente de si el servidor responde
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    }
};
```

## 🧪 Cómo Probar

### 1. Usar el archivo de test HTML
1. Abre `test-auth.html` en tu navegador
2. Cambia la URL del backend por tu URL real de Render
3. Las credenciales ya están configuradas (`hola123` / `password`)
4. Ejecuta cada prueba paso a paso

### 2. Verificar en DevTools
Después del login exitoso, ve a:
- **Application → Cookies**: Debes ver una cookie `access_token`
- **Network → Headers**: Verifica que las peticiones incluyen la cookie
- **Console**: No debe haber errores de CORS

### 3. Prueba manual paso a paso
1. **Login** con `hola123` / `password`
2. **Verificar sesión** - debe devolver datos del usuario
3. **Obtener usuarios** - debe funcionar sin error 401
4. **Obtener clientes** - debe funcionar sin error 401

## 🚨 Puntos Críticos

### ⚠️ OBLIGATORIO en TODAS las peticiones:
```javascript
fetch(url, {
    credentials: 'include' // ← SIN ESTO NO FUNCIONA
})
```

### ⚠️ URL correcta del backend:
- Actualiza `API_BASE_URL` con tu URL real de Render
- NO incluyas slash final: `https://tu-backend.onrender.com` ✅
- NO: `https://tu-backend.onrender.com/` ❌

### ⚠️ Headers de CORS:
El backend ya está configurado, pero si hay problemas revisa que el Origin sea exactamente:
`https://frontend-proyecto-si-1.vercel.app`

## 📞 Debug Rápido

Si algo no funciona, prueba esta URL en tu navegador:
```
https://tu-backend-en-render.onrender.com/auth/debug-cookies
```

Debe devolver información sobre cookies y headers recibidos.

---

Una vez que implementes estos cambios en tu frontend, la autenticación cross-origin debería funcionar perfectamente entre Vercel y Render.