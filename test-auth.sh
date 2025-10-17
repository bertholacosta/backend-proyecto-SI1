#!/bin/bash

# Script de prueba para verificar autenticación con cookies
# Uso: ./test-auth.sh

API_BASE="https://api-renacer.onrender.com"
FRONTEND_ORIGIN="https://frontend-proyecto-si-1.vercel.app"

echo "🧪 Iniciando pruebas de autenticación..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Login y obtener cookie
echo "📝 Test 1: Login con cookies"
echo "----------------------------"

RESPONSE=$(curl -s -i -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -d '{"usuario":"admin","contrasena":"admin123"}')

# Extraer cookie
COOKIE=$(echo "$RESPONSE" | grep -i "set-cookie" | grep "access_token" | sed 's/.*access_token=\([^;]*\).*/\1/')

if [ -z "$COOKIE" ]; then
    echo -e "${RED}❌ FALLO: No se recibió cookie${NC}"
    echo "$RESPONSE"
    exit 1
else
    echo -e "${GREEN}✅ Cookie recibida${NC}"
    
    # Verificar atributos de la cookie
    echo ""
    echo "🔍 Verificando atributos de la cookie:"
    
    if echo "$RESPONSE" | grep -q "HttpOnly"; then
        echo -e "${GREEN}  ✅ HttpOnly presente${NC}"
    else
        echo -e "${RED}  ❌ HttpOnly falta${NC}"
    fi
    
    if echo "$RESPONSE" | grep -q "Secure"; then
        echo -e "${GREEN}  ✅ Secure presente${NC}"
    else
        echo -e "${RED}  ❌ Secure falta${NC}"
    fi
    
    if echo "$RESPONSE" | grep -q "SameSite=None"; then
        echo -e "${GREEN}  ✅ SameSite=None presente${NC}"
    else
        echo -e "${RED}  ❌ SameSite=None falta${NC}"
    fi
    
    if echo "$RESPONSE" | grep -q "Path=/"; then
        echo -e "${GREEN}  ✅ Path=/ presente${NC}"
    else
        echo -e "${RED}  ❌ Path=/ falta${NC}"
    fi
fi

echo ""
echo "----------------------------"
echo ""

# Test 2: Verificar sesión con cookie
echo "📝 Test 2: Verificar sesión"
echo "----------------------------"

VERIFY_RESPONSE=$(curl -s -X GET "$API_BASE/auth/verificar" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Cookie: access_token=$COOKIE" \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$VERIFY_RESPONSE" | grep "HTTP_CODE" | sed 's/.*HTTP_CODE:\([0-9]*\)/\1/')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Sesión verificada exitosamente${NC}"
    echo "$VERIFY_RESPONSE" | grep -v "HTTP_CODE"
else
    echo -e "${RED}❌ FALLO: No se pudo verificar la sesión (HTTP $HTTP_CODE)${NC}"
    echo "$VERIFY_RESPONSE" | grep -v "HTTP_CODE"
    exit 1
fi

echo ""
echo "----------------------------"
echo ""

# Test 3: Logout
echo "📝 Test 3: Logout"
echo "----------------------------"

LOGOUT_RESPONSE=$(curl -s -X POST "$API_BASE/auth/logout" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Cookie: access_token=$COOKIE" \
  -w "\nHTTP_CODE:%{http_code}")

LOGOUT_CODE=$(echo "$LOGOUT_RESPONSE" | grep "HTTP_CODE" | sed 's/.*HTTP_CODE:\([0-9]*\)/\1/')

if [ "$LOGOUT_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Logout exitoso${NC}"
else
    echo -e "${RED}❌ FALLO: Logout falló (HTTP $LOGOUT_CODE)${NC}"
fi

echo ""
echo "----------------------------"
echo ""
echo "🎉 Pruebas completadas"
