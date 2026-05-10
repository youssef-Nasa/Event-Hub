@echo off
echo ========================================
echo EventHub Microservices - Startup Script
echo ========================================
echo.
echo Starting Eureka Server...
cd /d "c:\Users\adoot\Downloads\EventHubBackend (4)\spring-boot-microservices\eureka-server"
start "Eureka Server" cmd /k "java SimpleEurekaServer"
echo Eureka Server started on port 8761
timeout /t 3 /nobreak >nul

echo.
echo Starting API Gateway...
cd /d "c:\Users\adoot\Downloads\EventHubBackend (4)\spring-boot-microservices\api-gateway"
start "API Gateway" cmd /k "java SimpleGateway"
echo API Gateway started on port 8080
timeout /t 3 /nobreak >nul

echo.
echo Starting React Frontend...
cd /d "c:\Users\adoot\Downloads\EventHubBackend (4)\EventHubBackend"
start "React Frontend" cmd /k "npm start"
echo React Frontend starting on port 3000
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo All services started successfully!
echo ========================================
echo.
echo Services:
echo - Eureka Server: http://localhost:8761
echo - API Gateway:   http://localhost:8080
echo - React App:     http://localhost:3000
echo.
echo For mobile access, use your IP address:
echo - Eureka Server: http://YOUR_IP:8761
echo - API Gateway:   http://YOUR_IP:8080
echo.
echo Press any key to check service status...
pause >nul

echo.
echo Checking service status...
netstat -an | findstr ":876"
netstat -an | findstr ":808"
netstat -an | findstr ":3000"

echo.
echo Press any key to exit...
pause >nul
