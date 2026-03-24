# Startup CRM - Frontend

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📋 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run build:dev` | Compila en modo desarrollo |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Previsualiza la build |
| `npm run test` | Ejecuta tests |
| `npm run test:watch` | Ejecuta tests en modo watch |

## 🛠️ Stack

| Tecnología | Versión |
|------------|---------|
| React | 18.3.1 |
| TypeScript | 5.8.3 |
| Vite | 5.4.19 |
| TailwindCSS | 3.4.17 |
| shadcn/ui | - |
| TanStack Query | 5.83.0 |
| React Router DOM | 6.30.1 |
| Recharts | 2.15.4 |

## 📁 Estructura

```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   ├── CRMLayout.tsx
│   └── reminders/
├── pages/            # Vistas de la aplicación
├── hooks/           # Custom hooks
├── lib/             # Utilitarios
├── data/            # Datos mock
└── App.tsx          # Router principal
```

## 🎨 Personalización

Los colores del proyecto están configurados en `tailwind.config.ts` y los estilos globales en `src/index.css`.

## ✅ Validación

```bash
# Lint y typecheck
npm run lint

# Tests
npm run test
```