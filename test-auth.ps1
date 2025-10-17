# Script de PowerShell para probar autenticación con cookies
# Uso: .\test-auth.ps1

$API_BASE = "https://api-renacer.onrender.com"
$FRONTEND_ORIGIN = "https://frontend-proyecto-si-1.vercel.app"

Write-Host "🧪 Iniciando pruebas de autenticación..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Login y obtener cookie
Write-Host "📝 Test 1: Login con cookies" -ForegroundColor Yellow
Write-Host "----------------------------"

$loginBody = @{
    usuario = "admin"
    contrasena = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$API_BASE/auth/login" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Origin" = $FRONTEND_ORIGIN
        } `
        -Body $loginBody `
        -SessionVariable session

    if ($loginResponse.StatusCode -eq 200) {
        Write-Host "✅ Login exitoso" -ForegroundColor Green
        
        # Mostrar cookies
        Write-Host ""
        Write-Host "🍪 Cookies recibidas:" -ForegroundColor Cyan
        $session.Cookies.GetCookies($API_BASE) | ForEach-Object {
            Write-Host "  Name: $($_.Name)" -ForegroundColor White
            Write-Host "  Value: $($_.Value.Substring(0, [Math]::Min(20, $_.Value.Length)))..." -ForegroundColor White
            Write-Host "  HttpOnly: $($_.HttpOnly)" -ForegroundColor $(if ($_.HttpOnly) { "Green" } else { "Red" })
            Write-Host "  Secure: $($_.Secure)" -ForegroundColor $(if ($_.Secure) { "Green" } else { "Red" })
            Write-Host ""
        }
        
        # Test 2: Verificar sesión
        Write-Host "📝 Test 2: Verificar sesión" -ForegroundColor Yellow
        Write-Host "----------------------------"
        
        $verifyResponse = Invoke-WebRequest -Uri "$API_BASE/auth/verificar" `
            -Method GET `
            -Headers @{
                "Origin" = $FRONTEND_ORIGIN
            } `
            -WebSession $session
        
        if ($verifyResponse.StatusCode -eq 200) {
            Write-Host "✅ Sesión verificada exitosamente" -ForegroundColor Green
            $verifyData = $verifyResponse.Content | ConvertFrom-Json
            Write-Host "  Usuario: $($verifyData.usuario)" -ForegroundColor White
            Write-Host "  Email: $($verifyData.email)" -ForegroundColor White
            Write-Host "  Admin: $($verifyData.isAdmin)" -ForegroundColor White
        } else {
            Write-Host "❌ FALLO: No se pudo verificar la sesión" -ForegroundColor Red
        }
        
        Write-Host ""
        
        # Test 3: Logout
        Write-Host "📝 Test 3: Logout" -ForegroundColor Yellow
        Write-Host "----------------------------"
        
        $logoutResponse = Invoke-WebRequest -Uri "$API_BASE/auth/logout" `
            -Method POST `
            -Headers @{
                "Origin" = $FRONTEND_ORIGIN
            } `
            -WebSession $session
        
        if ($logoutResponse.StatusCode -eq 200) {
            Write-Host "✅ Logout exitoso" -ForegroundColor Green
        } else {
            Write-Host "❌ FALLO: Logout falló" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ FALLO: Login falló con código $($loginResponse.StatusCode)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Respuesta del servidor: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "----------------------------"
Write-Host "🎉 Pruebas completadas" -ForegroundColor Cyan
