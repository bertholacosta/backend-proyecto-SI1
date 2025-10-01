#!/bin/bash

# Script de prueba para verificar autenticación con credenciales reales
# Cambiar la URL por tu backend real en Render

BACKEND_URL="https://tu-backend-en-render.onrender.com"
USUARIO="hola123"
CONTRASENA="password"

echo "🧪 Probando autenticación cross-origin"
echo "🔗 Backend: $BACKEND_URL"
echo "👤 Usuario: $USUARIO"
echo ""

# Test 1: Health check
echo "1️⃣ Health check..."
curl -s "$BACKEND_URL/" | jq '.' 2>/dev/null || echo "❌ Error en health check"
echo ""

# Test 2: Debug cookies (antes del login)
echo "2️⃣ Debug cookies (antes del login)..."
curl -s "$BACKEND_URL/auth/debug-cookies" \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  | jq '.' 2>/dev/null || echo "❌ Error en debug"
echo ""

# Test 3: Login
echo "3️⃣ Intentando login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  -d "{\"usuario\":\"$USUARIO\",\"contrasena\":\"$CONTRASENA\"}" \
  -c cookies.txt -D headers.txt)

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Test 4: Debug cookies (después del login)
echo "4️⃣ Debug cookies (después del login)..."
curl -s "$BACKEND_URL/auth/debug-cookies" \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  -b cookies.txt | jq '.' 2>/dev/null || echo "❌ Error en debug post-login"
echo ""

# Test 5: Verificar sesión
echo "5️⃣ Verificando sesión..."
curl -s "$BACKEND_URL/auth/verificar-sesion" \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  -b cookies.txt | jq '.' 2>/dev/null || echo "❌ Error verificando sesión"
echo ""

# Test 6: Obtener usuarios
echo "6️⃣ Obteniendo usuarios..."
curl -s "$BACKEND_URL/usuarios" \
  -H "Origin: https://frontend-proyecto-si-1.vercel.app" \
  -b cookies.txt | jq '.usuarios[0:2]' 2>/dev/null || echo "❌ Error obteniendo usuarios"

# Limpiar archivos temporales
rm -f cookies.txt headers.txt

echo ""
echo "✅ Pruebas completadas"
echo ""
echo "📝 Instrucciones para el frontend:"
echo "1. Todas las peticiones deben incluir: credentials: 'include'"
echo "2. Login guarda cookie automáticamente si credentials: 'include' está presente"
echo "3. Peticiones subsecuentes usan la cookie automáticamente"
echo ""
echo "🔧 Ejemplo de código para el frontend:"
echo "fetch('$BACKEND_URL/usuarios', { credentials: 'include' })"