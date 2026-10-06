# 📋 Instrucciones de Instalación - Google Cloud Free Tier

## Paso 1: Crear cuenta en Google Cloud

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Si es tu primera vez, acepta los términos del free tier
4. **Importante:** Google Cloud Free Tier incluye 720 horas/mes de e2-micro (suficiente para 1 VM 24/7)

## Paso 2: Crear proyecto

1. Click en el selector de proyectos (parte superior)
2. Click en **NEW PROJECT**
3. Nombre: `whatsapp-bot-justificaciones`
4. Click en **CREATE**

## Paso 3: Habilitar Compute Engine

1. En el menú lateral, ve a **Compute Engine** → **VM instances**
2. Si es tu primera vez, click en **ENABLE**
3. Espera a que se habilite el servicio (1-2 minutos)

## Paso 4: Crear VM

1. Click en **CREATE INSTANCE**
2. Configura:

### Configuración básica:
- **Name:** `whatsapp-bot`
- **Region:** `us-central1 (Iowa)` ← Free tier eligible
- **Zone:** `us-central1-a`

### Machine type:
- Click en **E2** → **e2-micro** (2 vCPU, 1 GB RAM) ← Free tier

### Boot disk:
- Click en **CHANGE**
- Selecciona: **Ubuntu 22.04 LTS**
- Tamaño: 10 GB (suficiente)

### Firewall:
- ✅ **Allow HTTP traffic**
- ✅ **Allow HTTPS traffic** (opcional)

3. Click en **CREATE**
4. Espera 2-3 minutos a que se cree la VM

## Paso 5: Conectarse a la VM

1. En la lista de VMs, busca tu instancia
2. Click en **SSH** (se abrirá una terminal en el navegador)

## Paso 6: Instalar el bot

### Opción A: Subir archivos manualmente

```bash
# Crear directorio
mkdir whatsapp-bot
cd whatsapp-bot

# Crear archivos con nano
nano package.json
# (pega el contenido de package.json, Ctrl+X, Y, Enter)

nano config.js
# (pega el contenido, guarda)

# Repite para cada archivo...
```

### Opción B: Usar Git (recomendado)

```bash
# En tu computadora local, crea un repo en GitHub
# Sube todos los archivos
# Luego en la VM:

git clone https://github.com/tu-usuario/whatsapp-bot.git
cd whatsapp-bot
```

### Opción C: Copiar y pegar (si son pocos archivos)

```bash
# Crear directorio
mkdir whatsapp-bot
cd whatsapp-bot

# Copiar cada archivo individualmente
# Usa nano o vim
```

## Paso 7: Instalar dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Chromium y dependencias
sudo apt install -y chromium-browser

# Instalar dependencias adicionales
sudo apt install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxi6 libxtst6 libxrandr2 libxss1 libxkbfile1 libasound2 libatk-bridge2.0-0 libdrm2 libgtk-3-0 libnss3 libxfixes3 libgbm1

# Instalar PM2
sudo npm install -g pm2

# Instalar dependencias del bot
npm install
```

## Paso 8: Configurar .env

```bash
# Crear/editar .env
nano .env

# Agregar:
GMAIL_USER=acsaenz17@gmail.com
GMAIL_PASS=TU_APP_PASSWORD_AQUI
BOT_NAME=Bot Justificaciones SCM
PORT=3000

# Guardar: Ctrl+X, Y, Enter
```

### ⚠️ IMPORTANTE: Obtener App Password de Gmail

1. Ve a [myaccount.google.com](https://myaccount.google.com/)
2. Click en **Seguridad**
3. En "Cómo inicias sesión en Google", activa **Verificación en 2 pasos** (si no está activa)
4. Regresa a Seguridad → **Contraseñas de aplicaciones**
5. En "App", selecciona **Mail**
6. En "Dispositivo", selecciona **Other (Custom name)**
7. Ponle: `WhatsApp Bot`
8. Click en **GENERATE**
9. Copia la contraseña de 16 caracteres
10. Pégala en el archivo .env en `GMAIL_PASS`

## Paso 9: Ejecutar el bot

```bash
# Probar que funciona
npm start

# Deberías ver el código QR en la consola
# Escanear con WhatsApp:
# - Abre WhatsApp en tu teléfono
# - Dispositivos vinculados → Vincular dispositivo
# - Escanea el QR
```

## Paso 10: Configurar PM2 (para que siempre esté corriendo)

```bash
# Detener el bot (Ctrl+C si está corriendo)

# Iniciar con PM2
pm2 start index.js --name justificaciones-bot

# Configurar para que inicie al reiniciar
pm2 startup
# (copia y ejecuta el comando que te muestre)

pm2 save

# Ver logs
pm2 logs justificaciones-bot

# Ver estado
pm2 status
```

## Paso 11: Probar el bot

1. Desde tu teléfono, envía un mensaje al número del bot
2. Escribe: `inicio`
3. Sigue el proceso
4. Verifica que llegue el email

## Paso 12: Configurar firewall (si es necesario)

Si quieres acceder vía HTTP:

```bash
# En Google Cloud Console
# Ve a VPC network → Firewall
# Crea una regla para permitir el puerto 3000
```

## 🔧 Comandos útiles de PM2

```bash
# Ver logs en tiempo real
pm2 logs justificaciones-bot --lines 100

# Reiniciar el bot
pm2 restart justificaciones-bot

# Detener el bot
pm2 stop justificaciones-bot

# Iniciar el bot
pm2 start justificaciones-bot

# Ver uso de recursos
pm2 monit

# Ver información detallada
pm2 show justificaciones-bot
```

## 🛠️ Solución de problemas

### Error: "Cannot find module"

```bash
npm install
```

### Error: "Failed to launch browser"

```bash
sudo apt install -y chromium-browser
```

### El bot no responde

```bash
pm2 restart justificaciones-bot
pm2 logs justificaciones-bot
```

### QR no aparece

```bash
# Eliminar sesión cacheada
rm -rf .wa_session/
pm2 restart justificaciones-bot
```

### Ver si Node está corriendo

```bash
pm2 status
```

## ✅ ¡Listo!

Tu bot debería estar funcionando 24/7 en Google Cloud Free Tier.

**Costo:** $0/mes (dentro del free tier)

## 📊 Monitoreo

Puedes ver el estado de tu VM en:
- Google Cloud Console → Compute Engine → VM instances

Y los logs del bot:
```bash
pm2 logs justificaciones-bot
```

---

**Prof. M.N. Alejandro Castañeda Sáenz**  
Tutor SCM11, SCM41 y NTM41
