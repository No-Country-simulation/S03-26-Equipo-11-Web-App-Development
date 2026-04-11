# SEO - Next.js CRM

## Meta Tags y Head

### Metadata Base (app/layout.tsx)

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "CRM - Gestión de Relaciones con Clientes",
    template: "%s | CRM",
  },
  description: "Plataforma CRM para gestionar contactos, comunicaciones por email y WhatsApp, y seguimiento del embudo de ventas.",
  keywords: ["CRM", "gestión de clientes", "email marketing", "ventas", "contactos"],
  authors: [{ name: "CRM Team" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://crm.example.com",
    siteName: "CRM",
    title: "CRM - Gestión de Relaciones con Clientes",
    description: "Plataforma CRM para gestionar contactos y comunicaciones.",
  },
};
```

### Metadata por Página

```typescript
// app/(crm)/dashboard/page.tsx
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel de control con métricas y gráficos de ventas.",
};

// app/(crm)/contacts/page.tsx
export const metadata: Metadata = {
  title: "Contactos",
  description: "Gestión de contactos y embudo de ventas.",
};
```

---

## Estructura de Head

### Landing Page

```typescript
export default function HomePage() {
  return (
    <>
      <title>CRM - Gestión de Relaciones con Clientes</title>
      <meta name="description" content="Plataforma CRM moderna..." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content="CRM - Gestión de Relaciones con Clientes" />
      <meta property="og:description" content="Plataforma CRM moderna..." />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="CRM - Gestión de Relaciones con Clientes" />
      <meta name="twitter:description" content="Plataforma CRM moderna..." />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
```

---

## Sitemap (Futuro)

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://crm.example.com";
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/email`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/whatsapp`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reminders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
```

---

## Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/(crm)/"],
    },
    sitemap: "https://crm.example.com/sitemap.xml",
  };
}
```

---

## URL Canónica

```typescript
// Componente para URL canónica
export function CanonicalUrl({ url }: { url: string }) {
  return <link rel="canonical" href={url} />;
}

// Uso
<CanonicalUrl url="https://crm.example.com/contacts" />
```

---

## Mejores Prácticas

### Title Tags
- Longitud ideal: 50-60 caracteres
- Incluir keyword principal al inicio
- Usar separador "|"

### Meta Descriptions
- Longitud ideal: 150-160 caracteres
- Incluir call-to-action
- Keywords relevantes

### Estructura de Headers
- Un solo H1 por página
- H2-H6 para jerarquía lógica
- Keywords en headers importantes

### Imágenes
```typescript
<Image
  src="/dashboard-preview.png"
  alt="Vista previa del dashboard de CRM"
  width={1200}
  height={630}
  priority
/>
```

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
