# Configuración Frontend para Autenticación Cross-Origin

## Problema de Sesiones Cross-Origin

Cuando el frontend está en Vercel (https://frontend-proyecto-si-1.vercel.app) y el backend en Render (https://tu-backend.onrender.com), las cookies no se guardan automáticamente debido a las políticas de cross-origin.

## Solución Implementada

### Backend (Ya configurado)
- ✅ Cookies con `sameSite: 'None'` en producción
- ✅ `secure: true` para HTTPS
- ✅ CORS con `credentials: true`

### Frontend (DEBES CONFIGURAR)

#### 1. Todas las peticiones deben incluir `credentials: 'include'`

```javascript
// ❌ INCORRECTO - No incluye credentials
fetch('https://tu-backend.onrender.com/usuarios')

// ✅ CORRECTO - Incluye credentials para cookies
fetch('https://tu-backend.onrender.com/usuarios', {
    credentials: 'include'
})
```

#### 2. Configuración de Axios (si lo usas)

```javascript
// Configuración global de Axios
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tu-backend.onrender.com',
    withCredentials: true, // Permite cookies cross-origin
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
```

#### 3. Ejemplo completo de login

```javascript
// Login con manejo dual: cookies + localStorage
const login = async (usuario, contrasena) => {
    try {
        const response = await fetch('https://tu-backend.onrender.com/auth/login', {
            method: 'POST',
            credentials: 'include', // MUY IMPORTANTE
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Guardar token también en localStorage como backup
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                usuario: data.usuario,
                email: data.email,
                isAdmin: data.isAdmin
            }));
            
            return data;
        } else {
            throw new Error(data.error || 'Error en login');
        }
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};
```

#### 4. Peticiones autenticadas con doble verificación

```javascript
// Función para hacer peticiones autenticadas
const makeAuthenticatedRequest = async (url, options = {}) => {
    // Configurar headers por defecto
    const defaultOptions = {
        credentials: 'include', // Para cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Agregar token del localStorage como backup
    const token = localStorage.getItem('token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, defaultOptions);
        
        // Si la respuesta es 401, limpiar sesión
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirigir al login
            window.location.href = '/login';
            return null;
        }

        return response;
    } catch (error) {
        console.error('Error en petición autenticada:', error);
        throw error;
    }
};

// Uso:
const getUsuarios = async () => {
    const response = await makeAuthenticatedRequest(
        'https://tu-backend.onrender.com/usuarios'
    );
    
    if (response) {
        return await response.json();
    }
};
```

#### 5. Verificar sesión al cargar la app

```javascript
// Al iniciar la aplicación
const checkSession = async () => {
    try {
        const response = await fetch('https://tu-backend.onrender.com/auth/verificar-sesion', {
            credentials: 'include'
        });

        if (response.ok) {
            const userData = await response.json();
            // Actualizar estado de usuario
            setUser(userData);
        } else {
            // Limpiar sesión inválida
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
    }
};

// Llamar al cargar la app
useEffect(() => {
    checkSession();
}, []);
```

#### 6. Logout correcto

```javascript
const logout = async () => {
    try {
        await fetch('https://tu-backend.onrender.com/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error en logout:', error);
    } finally {
        // Limpiar todo independientemente
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir al login
        window.location.href = '/login';
    }
};
```

## Variables de entorno en Vercel

Agrega en tu dashboard de Vercel:

```env
VITE_API_URL=https://tu-backend.onrender.com
VITE_NODE_ENV=production
```

Y úsalas en tu código:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Debugging

Si sigues teniendo problemas, revisa:

1. **Consola del navegador**: Errores de CORS o cookies
2. **Network tab**: Ver si las cookies se están enviando
3. **Application tab**: Ver si las cookies se están guardando
4. **Logs del backend**: Ver qué está recibiendo el servidor

## Prueba Rápida

Después de hacer login, ve a las DevTools → Application → Cookies y deberías ver una cookie llamada `access_token` para tu dominio del backend.