# UI Components - Next.js CRM

## Componentes Disponibles

### Button

```typescript
import { Button } from "@/components/ui/button";

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | string | "default" | Variante visual |
| `size` | string | "default" | Tamaño del botón |
| `disabled` | boolean | false | Estado deshabilitado |
| `loading` | boolean | false | Estado de carga |

---

### Input

```typescript
import { Input } from "@/components/ui/input";

<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />
<Input error placeholder="With error" />
```

---

### Textarea

```typescript
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Enter description..." />
<Textarea rows={4} placeholder="Custom rows" />
```

---

### Dialog

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    
    {/* Content */}
    <div>Dialog content here</div>
    
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Select

```typescript
import { Select } from "@/components/ui/select";

const options = [
  { value: "new", label: "Nuevo" },
  { value: "contacted", label: "Contactado" },
  { value: "qualified", label: "Calificado" },
];

<Select
  options={options}
  placeholder="Seleccionar..."
  value={value}
  onValueChange={setValue}
/>
```

---

### Tabs

```typescript
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Switch

```typescript
import { Switch } from "@/components/ui/tabs";

<Switch checked={enabled} onCheckedChange={setEnabled} />
```

---

### Label

```typescript
import { Label } from "@/components/ui/tabs";

<Label htmlFor="email">Email</Label>
<input id="email" type="email" />
```

---

## Clases CSS Personalizadas

### Layout

| Clase | Descripción |
|-------|-------------|
| `.sidebar-link` | Estilo para links del sidebar |
| `.kpi-card` | Tarjeta para métricas KPI |
| `.page-container` | Contenedor principal de página |

### Badges

| Clase | Descripción |
|-------|-------------|
| `.funnel-badge` | Badge para etapas del embudo |
| `.priority-badge` | Badge para prioridades |

### Chat

| Clase | Descripción |
|-------|-------------|
| `.chat-bubble-sent` | Burbuja de mensaje enviado |
| `.chat-bubble-received` | Burbuja de mensaje recibido |

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
