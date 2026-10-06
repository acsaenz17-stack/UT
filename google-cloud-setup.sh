#!/bin/bash
# Script de instalación para Google Cloud Free Tier
# Bot de Justificaciones - Prof. Alejandro Castañeda

echo "🚀 Iniciando instalación del bot de justificaciones..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
echo "✅ Node.js $(node --version) instalado"
echo "✅ npm $(npm --version) instalado"

# Instalar dependencias del sistema para Chromium
echo "📦 Instalando dependencias del sistema..."
sudo apt install -y \
    chromium-browser \
    wget \
    git \
    curl \
    gnupg2 \
    software-properties-common \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxi6 \
    libxtst6 \
    libxrandr2 \
    libxss1 \
    libxkbfile1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnss3 \
    libxfixes3 \
    libgbm1

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Crear directorio del bot
echo "📁 Creando directorio del bot..."
mkdir -p ~/whatsapp-bot
cd ~/whatsapp-bot

# Copiar archivos (asume que están en el directorio actual)
echo "📁 Copiando archivos del bot..."
# Aquí deberías subir tus archivos o clonar desde Git

# Instalar dependencias de Node
echo "📦 Instalando dependencias de Node.js..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "⚠️  Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  EDITA .env CON TUS CREDENCIALES DE GMAIL"
fi

# Configurar PM2 para inicio automático
echo "⚙️  Configurando PM2..."
pm2 startup
pm2 save

echo ""
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "Siguientes pasos:"
echo "1. Edita el archivo .env con tus credenciales:"
echo "   nano .env"
echo ""
echo "2. Inicia el bot:"
echo "   pm2 start index.js --name justificaciones-bot"
echo ""
echo "3. Escanea el código QR con WhatsApp"
echo ""
echo "4. Verifica que esté funcionando:"
echo "   pm2 logs justificaciones-bot"
echo ""
echo "=========================================="
