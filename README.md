# Restaurant Web App - Sistema de Pago Eficiente

Aplicación web moderna para optimizar el proceso de pago en restaurantes. Permite a los clientes ver el menú, agregar productos al carrito y realizar pagos de forma rápida y eficiente.

## 🚀 Características

- 📱 Menú interactivo con categorías
- 🛒 Carrito de compras en tiempo real
- 💳 Múltiples métodos de pago (Tarjeta, Apple Pay, Google Pay)
- 💰 Sistema de propinas configurable
- 📊 Cálculo automático de impuestos
- 🎨 Interfaz moderna y responsive

## 🛠️ Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar en producción
pnpm start
```

## 🌐 Deployment en Render

Este proyecto está configurado para desplegarse fácilmente en Render.

### Pasos para desplegar:

1. **Conectar con GitHub:**
   - Sube este repositorio a GitHub
   - Asegúrate de que todos los archivos estén commiteados

2. **Crear servicio en Render:**
   - Ve a [Render Dashboard](https://dashboard.render.com)
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona este proyecto

3. **Configuración en Render:**
   - **Name:** restaurant-web-app (o el nombre que prefieras)
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Node Version:** 18.x o superior

4. **Variables de entorno (si las necesitas):**
   - Agrega variables de entorno en la sección "Environment" si tu app las requiere

5. **Deploy:**
   - Click en "Create Web Service"
   - Render construirá y desplegará tu aplicación automáticamente

## 📝 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia el servidor de producción
- `pnpm lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
restaurant-web-app/
├── app/                 # Páginas de Next.js
│   ├── admin/          # Panel de administración
│   ├── cart/           # Página del carrito
│   └── payment/         # Página de pago
├── components/          # Componentes React
├── lib/                 # Utilidades y contextos
└── public/              # Archivos estáticos
```

## 🔧 Configuración

El proyecto usa:
- **Next.js 16** con App Router
- **Tailwind CSS 4** para estilos
- **TypeScript** para type safety
- **Context API** para manejo de estado global

## 📄 Licencia

Este proyecto es privado.


