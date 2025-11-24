#!/bin/bash

# Script de configuración automática para Green Music
# Este script ayuda a configurar el proyecto paso a paso

echo "🎵 Green Music - Script de Configuración"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar prerequisitos
echo "📋 Verificando prerequisitos..."
echo ""

if ! command_exists node; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "   Instala Node.js desde: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm instalado: $NPM_VERSION${NC}"
fi

if ! command_exists psql; then
    echo -e "${YELLOW}⚠️  PostgreSQL no encontrado en PATH${NC}"
    echo "   Asegúrate de tener PostgreSQL instalado"
else
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✅ PostgreSQL encontrado: $PSQL_VERSION${NC}"
fi

if ! command_exists git; then
    echo -e "${YELLOW}⚠️  Git no encontrado${NC}"
else
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git encontrado: $GIT_VERSION${NC}"
fi

echo ""
echo "=========================================="
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
echo ""

echo "Backend..."
cd backend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No se encontró package.json en backend/${NC}"
    exit 1
fi
npm install
cd ..

echo ""
echo "Admin Panel..."
cd admin
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No se encontró package.json en admin/${NC}"
    exit 1
fi
npm install
cd ..

echo ""
echo "Mobile App..."
cd mobile
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No se encontró package.json en mobile/${NC}"
    exit 1
fi
npm install
cd ..

echo ""
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Crear archivos .env si no existen
echo "⚙️  Configurando archivos de entorno..."
echo ""

if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${YELLOW}📝 Creado backend/.env desde .env.example${NC}"
        echo "   ⚠️  IMPORTANTE: Edita backend/.env con tus credenciales"
    else
        echo -e "${RED}❌ No se encontró backend/.env.example${NC}"
    fi
else
    echo -e "${GREEN}✅ backend/.env ya existe${NC}"
fi

if [ ! -f "admin/.env.local" ]; then
    if [ -f "admin/.env.example" ]; then
        cp admin/.env.example admin/.env.local
        echo -e "${YELLOW}📝 Creado admin/.env.local desde .env.example${NC}"
        echo "   ⚠️  IMPORTANTE: Edita admin/.env.local con tus credenciales"
    else
        echo -e "${RED}❌ No se encontró admin/.env.example${NC}"
    fi
else
    echo -e "${GREEN}✅ admin/.env.local ya existe${NC}"
fi

if [ ! -f "mobile/.env" ]; then
    if [ -f "mobile/.env.example" ]; then
        cp mobile/.env.example mobile/.env
        echo -e "${YELLOW}📝 Creado mobile/.env desde .env.example${NC}"
        echo "   ⚠️  IMPORTANTE: Edita mobile/.env con tus credenciales"
    else
        echo -e "${RED}❌ No se encontró mobile/.env.example${NC}"
    fi
else
    echo -e "${GREEN}✅ mobile/.env ya existe${NC}"
fi

echo ""
echo "=========================================="
echo ""
echo -e "${GREEN}🎉 Configuración inicial completada!${NC}"
echo ""
echo "📚 Próximos pasos:"
echo "   1. Configura Firebase (ver GUIA_INTEGRACION_COMPLETA.md)"
echo "   2. Crea la base de datos PostgreSQL"
echo "   3. Edita los archivos .env con tus credenciales"
echo "   4. Ejecuta el script SQL: psql -U postgres -d green_music -f docs/MODELO_BD.sql"
echo "   5. Inicia los servicios:"
echo "      - Backend: cd backend && npm run start:dev"
echo "      - Admin: cd admin && npm run dev"
echo "      - Mobile: cd mobile && npm start"
echo ""
echo "📖 Lee GUIA_INTEGRACION_COMPLETA.md para más detalles"

