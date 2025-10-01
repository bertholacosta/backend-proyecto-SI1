#!/bin/bash

# Script de prueba para verificar el funcionamiento del backend

# URL base de tu backend en Render (cambiar por tu URL real)
BASE_URL="https://tu-backend.onrender.com"

echo "🚀 Probando el backend en $BASE_URL"
echo ""

# Test 1: Health check
echo "1️⃣ Probando health check..."
curl -s "$BASE_URL/" | jq '.' || echo "❌ Error en health check"
echo ""

# Test 2: Login (necesitarás credenciales válidas)
echo "2️⃣ Probando login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "contrasena": "123456"
  }'  \
  -c cookies.txt)

echo $LOGIN_RESPONSE | jq '.' || echo "❌ Error en login"
echo ""

# Test 3: Obtener usuarios (con autenticación)
echo "3️⃣ Probando obtener usuarios..."
curl -s "$BASE_URL/usuarios" \
  -H "Content-Type: application/json" \
  -b cookies.txt | jq '.' || echo "❌ Error al obtener usuarios"

# Limpiar archivos temporales
rm -f cookies.txt

echo ""
echo "✅ Pruebas completadas"