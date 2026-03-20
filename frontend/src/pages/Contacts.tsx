import { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, Phone, Mail, MessageCircle, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contacts, stageLabels, stageColors, type FunnelStage, type Contact } from "@/data/mockData";
import { exportContactsCSV } from "@/lib/exportUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const stages: FunnelStage[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

function ContactRow({ contact }: { contact: Contact }) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
            {contact.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-medium text-sm">{contact.name}</p>
            <p className="text-xs text-muted-foreground">{contact.company}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{contact.email}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{contact.phone}</td>
      <td className="py-3 px-4">
        <span className={`funnel-badge ${stageColors[contact.stage]}`}>
          {stageLabels[contact.stage]}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1 flex-wrap">
          {contact.tags.map((tag) => (
            <span key={tag} className="funnel-badge bg-secondary text-secondary-foreground">{tag}</span>
          ))}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{contact.lastContact}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MessageCircle className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Mail className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Phone className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function Contacts() {
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState<FunnelStage | "all">("all");

  const filtered = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchesStage = activeStage === "all" || c.stage === activeStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground text-sm mt-1">{contacts.length} contactos en total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportContactsCSV(filtered)}>
            <Download className="w-4 h-4 mr-1.5" />
            CSV
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Nuevo contacto
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nuevo contacto</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Nombre completo" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Teléfono" />
              <Input placeholder="Empresa" />
              <Button className="w-full">Guardar contacto</Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contacto o empresa..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Button
            variant={activeStage === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveStage("all")}
          >
            Todos
          </Button>
          {stages.map((s) => (
            <Button
              key={s}
              variant={activeStage === s ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStage(s)}
            >
              {stageLabels[s]}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Contacto</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Teléfono</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Último contacto</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <ContactRow key={c.id} contact={c} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No se encontraron contactos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
