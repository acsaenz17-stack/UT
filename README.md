# 🤖 Bot de Justificaciones - WhatsApp

Bot de WhatsApp automatizado para justificar ausencias de estudiantes.

**Prof. M.N. Alejandro Castañeda Sáenz**  
Tutor SCM11, SCM41 y NTM41

## 📋 Descripción

Este bot permite a los estudiantes justificar sus ausencias de manera automática a través de WhatsApp. El bot:

1. Guía al estudiante paso a paso
2. Recolecta: grupo, materia, nombre, matrícula, fecha y motivo
3. Envía automáticamente un correo al profesor de la materia
4. Confirma el envío al estudiante

## 🚀 Instalación en Google Cloud Free Tier

### Paso 1: Crear VM en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (si no tienes uno)
3. Ve a **Compute Engine** → **VM instances**
4. Click en **Create Instance**
5. Configuración recomendada:
   - **Name:** whatsapp-bot-justificaciones
   - **Region:** us-central1 (Iowa) - free tier eligible
   - **Zone:** us-central1-a
   - **Machine type:** e2-micro (2 vCPU, 1 GB RAM) - free tier
   - **Boot disk:** Ubuntu 22.04 LTS
   - **Firewall:** Allow HTTP traffic

6. Click en **Create**

### Paso 2: Conectarse a la VM

1. En la lista de VMs, click en **SSH** junto a tu instancia
2. Se abrirá una terminal en el navegador

### Paso 3: Instalar Node.js

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### Paso 4: Instalar dependencias del sistema

```bash
# Instalar Chrome/Chromium para Puppeteer
sudo apt install -y chromium-browser

# Instalar otras dependencias
sudo apt install -y wget git curl gnupg2 software-properties-common
```

### Paso 5: Subir el código

```bash
# Crear directorio
mkdir whatsapp-bot
cd whatsapp-bot

# Subir archivos (puedes usar git o SCP)
# Opción A: Con Git
git clone <tu-repositorio> .

# Opción B: Con nano (copiar y pegar)
nano package.json
# (pega el contenido y guarda con Ctrl+X, Y, Enter)
```

### Paso 6: Instalar dependencias de Node

```bash
# Instalar dependencias
npm install

# Si hay errores con Puppeteer, instalar dependencias adicionales
sudo apt install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxi6 libxtst6 libxrandr2 libxss1 libxkbfile1 libasound2 libatk-bridge2.0-0 libdrm2 libgtk-3-0 libnss3 libxfixes3 libgbm1
```

### Paso 7: Configurar variables de entorno

```bash
# Crear archivo .env
nano .env

# Agregar:
GMAIL_USER=tu_correo@gmail.com
GMAIL_PASS=tu_app_password
BOT_NAME=Bot Justificaciones SCM
PORT=3000

# Guardar con Ctrl+X, Y, Enter
```

### ⚠️ Importante: App Password de Gmail

Para obtener tu App Password:

1. Ve a [myaccount.google.com](https://myaccount.google.com/)
2. Seguridad → Verificación en 2 pasos (debe estar activada)
3. Contraseñas de aplicaciones
4. Generar nueva contraseña para "Mail"
5. Copia la contraseña de 16 caracteres

### Paso 8: Ejecutar el bot

```bash
# Modo desarrollo (con logs detallados)
npm start

# O con nodemon (auto-reload)
npm run dev
```

### Paso 9: Escanear código QR

1. La primera vez que ejecutes el bot, mostrará un QR en la consola
2. Abre WhatsApp en tu teléfono
3. Ve a **Dispositivos vinculados** → **Vincular dispositivo**
4. Escanea el QR

### Paso 10: Mantener el bot ejecutándose (PM2)

```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar el bot con PM2
pm2 start index.js --name justificaciones-bot

# Hacer que inicie al reiniciar
pm2 startup
pm2 save

# Ver logs
pm2 logs justificaciones-bot

# Reiniciar bot
pm2 restart justificaciones-bot

# Detener bot
pm2 stop justificaciones-bot
```

## 📱 Uso del Bot

### Para estudiantes:

1. Guarda el número de WhatsApp del bot
2. Envía un mensaje diciendo: **inicio**
3. Sigue las instrucciones paso a paso
4. Confirma los datos
5. ¡Listo! El correo se envía automáticamente

### Comandos:

- `inicio` - Comenzar una justificación
- `ayuda` - Mostrar ayuda
- `cancelar` - Cancelar proceso actual

## 🔧 Configuración

### config.js

Aquí puedes modificar:
- Materias y correos por grupo
- Mensajes del bot
- Grupos válidos

### .env

Variables de entorno:
- `GMAIL_USER` - Tu correo de Gmail
- `GMAIL_PASS` - App password de Gmail
- `PORT` - Puerto del servidor (default: 3000)

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
pm2 logs justificaciones-bot
```

### Ver estado del bot

```bash
pm2 status
```

### Ver uso de recursos

```bash
pm2 monit
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

### Error: "Authentication failed" en Gmail

- Verifica que el App Password sea correcto
- Asegúrate de tener 2FA activado en Gmail

### El bot no responde

```bash
pm2 restart justificaciones-bot
pm2 logs justificaciones-bot
```

### QR no aparece

```bash
# Eliminar sesión cacheada
rm -rf .wa_session/
npm start
```

## 📁 Estructura de archivos

```
whatsapp-bot-justificaciones/
├── index.js           # Archivo principal
├── config.js          # Configuración y base de datos
├── emailService.js    # Servicio de envío de emails
├── botState.js        # Manejo de estado de conversaciones
├── logger.js          # Sistema de logs
├── package.json       # Dependencias
├── .env               # Variables de entorno (no subir a Git)
├── .env.example       # Ejemplo de .env
├── .gitignore         # Archivos a ignorar en Git
└── README.md          # Esta documentación
```

## 🔐 Seguridad

- Los datos de los estudiantes solo se almacenan temporalmente en memoria
- No se guarda información personal en disco
- El archivo `.env` nunca debe subirse a Git
- Usa un número de WhatsApp dedicado para el bot

## 📝 Licencia

MIT License - Prof. Alejandro Castañeda

## 🆘 Soporte

Para reportar errores o sugerencias, contacta al Prof. Alejandro Castañeda.
