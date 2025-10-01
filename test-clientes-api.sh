#!/bin/bash

# Script de prueba para API de Clientes
# Este script prueba todas las funciones CRUD

echo "=== PRUEBAS API DE CLIENTES ==="
echo ""

BASE_URL="http://localhost:3000"
COOKIE_JAR="test-cookies.txt"

# Función para hacer login (necesario para las pruebas)
login() {
    echo "1. Iniciando sesión..."
    curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"usuario":"admin","contrasena":"admin123"}' \
        -c "$COOKIE_JAR" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Login exitoso"
    else
        echo "❌ Error en login"
        exit 1
    fi
    echo ""
}

# Función para crear cliente de prueba
create_test_client() {
    echo "2. Creando cliente de prueba..."
    RESPONSE=$(curl -s -X POST "$BASE_URL/clientes" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_JAR" \
        -d '{
            "ci": 12345678,
            "nombre": "Cliente de Prueba",
            "telefono": "70123456",
            "direccion": "Av. Test 123"
        }')
    
    echo "$RESPONSE" | grep -q "Cliente creado exitosamente"
    if [ $? -eq 0 ]; then
        echo "✅ Cliente creado exitosamente"
        echo "$RESPONSE"
    else
        echo "❌ Error al crear cliente"
        echo "$RESPONSE"
    fi
    echo ""
}

# Función para obtener todos los clientes
get_all_clients() {
    echo "3. Obteniendo todos los clientes..."
    RESPONSE=$(curl -s -X GET "$BASE_URL/clientes" \
        -b "$COOKIE_JAR")
    
    echo "$RESPONSE" | grep -q "Clientes obtenidos exitosamente"
    if [ $? -eq 0 ]; then
        echo "✅ Clientes obtenidos exitosamente"
        echo "$RESPONSE" | head -c 200
        echo "..."
    else
        echo "❌ Error al obtener clientes"
        echo "$RESPONSE"
    fi
    echo ""
}

# Función para obtener cliente específico
get_client_by_id() {
    echo "4. Obteniendo cliente por CI..."
    RESPONSE=$(curl -s -X GET "$BASE_URL/clientes/12345678" \
        -b "$COOKIE_JAR")
    
    echo "$RESPONSE" | grep -q "Cliente encontrado"
    if [ $? -eq 0 ]; then
        echo "✅ Cliente encontrado"
        echo "$RESPONSE"
    else
        echo "❌ Error al obtener cliente"
        echo "$RESPONSE"
    fi
    echo ""
}

# Función para buscar clientes
search_clients() {
    echo "5. Buscando clientes..."
    RESPONSE=$(curl -s -X GET "$BASE_URL/clientes/search?q=Prueba" \
        -b "$COOKIE_JAR")
    
    echo "$RESPONSE" | grep -q "Búsqueda completada"
    if [ $? -eq 0 ]; then
        echo "✅ Búsqueda completada"
        echo "$RESPONSE"
    else
        echo "❌ Error en búsqueda"
        echo "$RESPONSE"
    fi
    echo ""
}

# Función para actualizar cliente
update_client() {
    echo "6. Actualizando cliente..."
    RESPONSE=$(curl -s -X PUT "$BASE_URL/clientes/12345678" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_JAR" \
        -d '{
            "nombre": "Cliente Actualizado",
            "telefono": "70987654"
        }')
    
    echo "$RESPONSE" | grep -q "Cliente actualizado exitosamente"
    if [ $? -eq 0 ]; then
        echo "✅ Cliente actualizado exitosamente"
        echo "$RESPONSE"
    else
        echo "❌ Error al actualizar cliente"
        echo "$RESPONSE"
    fi
    echo ""
}

# Función para eliminar cliente
delete_client() {
    echo "7. Eliminando cliente..."
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/clientes/12345678" \
        -b "$COOKIE_JAR")
    
    echo "$RESPONSE" | grep -q "Cliente eliminado exitosamente"
    if [ $? -eq 0 ]; then
        echo "✅ Cliente eliminado exitosamente"
        echo "$RESPONSE"
    else
        echo "❌ Error al eliminar cliente"
        echo "$RESPONSE"
    fi
    echo ""
}

# Función de limpieza
cleanup() {
    echo "8. Limpieza..."
    rm -f "$COOKIE_JAR"
    echo "✅ Limpieza completada"
    echo ""
}

# Ejecutar todas las pruebas
main() {
    echo "Verificando que el servidor esté ejecutándose en $BASE_URL..."
    curl -s "$BASE_URL/clientes" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "❌ Servidor no disponible. Asegúrate de que esté ejecutándose."
        exit 1
    fi
    
    login
    create_test_client
    get_all_clients
    get_client_by_id
    search_clients
    update_client
    delete_client
    cleanup
    
    echo "=== PRUEBAS COMPLETADAS ==="
}

# Ejecutar pruebas
main