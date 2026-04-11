# System Design - UI/UX - Startup CRM

## Vision de Diseno

El diseno de Startup CRM prioriza la **simplicidad y eficiencia**, con una interfaz limpia que permite a los usuarios gestionar sus contactos y comunicaciones sin friccion. La paleta de colores y tipografia estan pensadas para longas jornadas de trabajo con cansancio visual minimo.

---

## Sistema de Diseno

### Principios de Diseno

1. **Minimalismo funcional** - Cada elemento tiene un proposito
2. **Jerarquia clara** - La informacion importante se destaca visualmente
3. **Consistencia** - Patrones de diseno uniformes en toda la app
4. **Accesibilidad** - Contraste adecuado, tamanos legibles
5. **Feedback inmediato** - Estados visuales claros en interacciones

---

## Paleta de Colores

### Colores Principales

| Nombre | Hex | HSL | Uso |
|--------|-----|-----|-----|
| **Primary** | `#0D9488` | 168, 77%, 33% | Acciones principales, CTAs |
| **Primary Dark** | `#0F766E` | 171, 77%, 28% | Hover states |
| **Secondary** | `#64748B` | 215, 16%, 47% | Texto secundario |

### Colores de Estado

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Success** | `#10B981` | Estados exitosos, etapa "Ganado" |
| **Warning** | `#F59E0B` | Alertas, etapa "Contactado" |
| **Error** | `#EF4444` | Errores, etapa "Perdido" |
| **Info** | `#3B82F6` | Informacion, etapa "Nuevo" |

### Colores del Embudo de Ventas

| Etapa | Hex | Descripcion |
|-------|-----|-------------|
| **Nuevo** | `#3B82F6` | Azul - Leads nuevos |
| **Contactado** | `#F59E0B` | Amber - Leads contactados |
| **Calificado** | `#0D9488` | Teal - Prospectos cualificados |
| **Propuesta** | `#8B5CF6` | Purple - Propuesta enviada |
| **Ganado** | `#10B981` | Emerald - Negociacion exitosa |
| **Perdido** | `#EF4444` | Red - Negociacion perdida |

### Colores de Canal

| Canal | Hex | Descripcion |
|-------|-----|-------------|
| **WhatsApp** | `#25D366` | Verde oficial de WhatsApp |
| **Email** | `#3B82F6` | Azul - Correo electronico |

### Escala de Grises

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Background** | `#FFFFFF` | Fondo principal (light) |
| **Background Alt** | `#F8FAFC` | Fondo secundario |
| **Border** | `#E2E8F0` | Bordes sutiles |
| **Muted** | `#94A3B8` | Texto terciario |
| **Text** | `#1E293B` | Texto principal |
| **Text Inverse** | `#FFFFFF` | Texto sobre fondos oscuros |

---

## Tipografia

### Familia Tipografica

**DM Sans** - Usada en toda la aplicacion para consistencia.

```css
font-family: "DM Sans", system-ui, sans-serif;
```

### Escala Tipografica

| Nivel | Tamanio | Weight | Line Height | Uso |
|-------|---------|--------|-------------|-----|
| **H1** | 32px / 2rem | 700 | 1.2 | Titulos de pagina |
| **H2** | 24px / 1.5rem | 600 | 1.3 | Secciones principales |
| **H3** | 20px / 1.25rem | 600 | 1.4 | Subsecciones |
| **H4** | 16px / 1rem | 600 | 1.4 | Titulos de componentes |
| **Body** | 14px / 0.875rem | 400 | 1.5 | Texto general |
| **Small** | 12px / 0.75rem | 400 | 1.5 | Texto auxiliar |
| **Caption** | 11px / 0.6875rem | 500 | 1.4 | Labels, badges |

### Peso Tipografico

| Weight | Valor | Uso |
|--------|-------|-----|
| Light | 300 | Texto decorativo |
| Regular | 400 | Texto general |
| Medium | 500 | Labels, emphasis |
| Semibold | 600 | Titulos, headers |
| Bold | 700 | Titulos principales |

---

## Espaciado

### Sistema de Espaciado (8px Grid)

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Separacion minima |
| `space-2` | 8px | Entre elementos relacionados |
| `space-3` | 12px | Entre elementos |
| `space-4` | 16px | Padding de componentes |
| `space-5` | 20px | Secciones pequenas |
| `space-6` | 24px | Secciones |
| `space-8` | 32px | Secciones grandes |
| `space-10` | 40px | Separacion entre secciones |
| `space-12` | 48px | Espaciado hero |

### Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 4px | Inputs, badges |
| `radius-md` | 8px | Botones, cards pequenas |
| `radius-lg` | 12px | Cards, modals |
| `radius-xl` | 16px | Contenedores grandes |
| `radius-full` | 9999px | Pills, avatares circulares |

---

## Sombras (Shadows)

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Elevacion minima |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, popovers |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Overlays |

---

## Componentes UI

### Botones

#### Variantes

| Variante | Descripcion | Uso |
|----------|-------------|-----|
| **Primary** | Fondo primary, texto blanco | CTAs principales |
| **Secondary** | Borde, fondo transparente | Acciones secundarias |
| **Destructive** | Fondo rojo | Eliminacion |
| **Ghost** | Sin borde ni fondo | Acciones menores |
| **Link** | Texto con underline | Links inline |

#### Tamanos

| Tamanio | Padding | Font Size |
|---------|---------|-----------|
| **sm** | 6px 12px | 12px |
| **md** | 8px 16px | 14px |
| **lg** | 12px 24px | 16px |
| **icon** | 8px | 16px |

### Cards

```
+------------------+
|    Header        |  Padding: 16px
+------------------+
|                  |  Padding: 16px
|    Content       |  Min-height: 100px
|                  |
+------------------+
|    Footer        |  Padding: 12px 16px
+------------------+

Border: 1px solid --color-border
Radius: 12px (radius-lg)
Shadow: shadow-sm (default), shadow-md (hover)
```

### Inputs

```
+---------------------------+
| Label                    |  Font: caption, color: muted
+---------------------------+
|                           |  Padding: 10px 12px
|  Input text              |  Border: 1px solid --color-border
|                           |  Radius: 8px (radius-sm)
+---------------------------+
| Helper text / Error       |  Font: small, color: error
+---------------------------+
```

### Badges/Pills

```
+---------+
| Label   |  Padding: 2px 8px
+---------+  Radius: 9999px (radius-full)
           Font: caption
```

---

## Layout del Dashboard

### Estructura de Pagina

```
+------------------------------------------------------------------+
|  Sidebar (240px)           |  Header (64px)                      |
|  +----------------------+  |  +----------------------------------+ |
|  | Logo                 |  |  | Titulo de Pagina    [Search] [U] | |
|  +----------------------+  |  +----------------------------------+ |
|  | Nav Items            |  +----------------------------------+ |
|  | - Dashboard          |  |                                  | |
|  | - Contactos          |  |  Content Area                    | |
|  | - Email              |  |  +----------------------------+  | |
|  | - WhatsApp           |  |  | KPI Cards Row              |  | |
|  | - Recordatorios      |  |  +----------------------------+  | |
|  | - Configuracion      |  |  | KPI | KPI | KPI | KPI       |  | |
|  +----------------------+  |  +----------------------------+  | |
|  | User Profile         |  |  |                            |  | |
|  +----------------------+  |  | Charts Row                 |  | |
|                            |  | +----------+ +----------+  |  | |
|                            |  | | Funnel   | | Channel  |  |  | |
|                            |  | | Chart    | | Dist     |  |  | |
|                            |  | +----------+ +----------+  |  | |
|                            |  +----------------------------------+ |
+------------------------------------------------------------------+
```

### Responsive Breakpoints

| Breakpoint | Ancho | Layout |
|------------|-------|--------|
| **Mobile** | < 640px | Sidebar colapsado, stack vertical |
| **Tablet** | 640px - 1024px | Sidebar colapsable, 2 columnas |
| **Desktop** | > 1024px | Sidebar expandido, 4 columnas |

---

## Patrones de Interaccion

### Estados de Hover

- **Botones**: Oscurecer 10% el fondo
- **Links**: Subrayar
- **Cards**: Elevar sombra a shadow-md
- **Rows de tabla**: Fondo sutil highlight

### Estados de Focus

- **Inputs**: Borde primary de 2px
- **Botones**: Outline offset
- **Todos**: Focus-visible ring

### Estados de Loading

- Spinner centrado o skeleton loaders
- Reducir opacidad a 60%
- Deshabilitar interaccion

### Estados de Error

- Borde rojo en inputs
- Mensaje de error debajo del campo
- Toast de notificacion para errores

---

## Iconografia

### Libreria

**Lucide React** - Iconos de linea, 24px default

### Tamanos Estandar

| Tamanio | Uso |
|---------|-----|
| 16px | Inline con texto |
| 20px | Navegacion, acciones |
| 24px | Default, headers |
| 32px | Estados vacios |
| 48px | Iconos grandes, empty states |

---

## Animaciones

### Transiciones

| Tipo | Duracion | Easing |
|------|----------|--------|
| **Fast** | 150ms | ease-out |
| **Normal** | 200ms | ease-out |
| **Slow** | 300ms | ease-in-out |

### Animaciones de Entrada

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

**Volver a**: [Indice de Arquitectura](../architecture.md)
