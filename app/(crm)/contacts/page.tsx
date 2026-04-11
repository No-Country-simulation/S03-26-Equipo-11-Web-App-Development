"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Plus, Mail, MessageCircle, Loader2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FunnelStage, ContactWithParsedTags as Contact, ContactsListResponse } from "@/lib/db/contacts-schema";

const stages: FunnelStage[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

const stageLabels: Record<FunnelStage, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
};

const stageColors: Record<FunnelStage, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  qualified: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  proposal: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  won: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function ContactRow({ contact, onEdit, onDelete }: { contact: Contact; onEdit: (c: Contact) => void; onDelete: (id: string) => void }) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">
        <div>
          <p className="font-medium text-sm">{contact.name}</p>
          <p className="text-xs text-muted-foreground">{contact.company || "-"}</p>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{contact.email}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{contact.phone || "-"}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stageColors[contact.stage]}`}>
          {stageLabels[contact.stage]}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1 flex-wrap">
          {contact.tags && contact.tags.length > 0 ? (
            contact.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">{tag}</span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{contact.lastContact || "-"}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:text-green-600" 
            title="Enviar WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:text-blue-600" 
            title="Enviar Email"
          >
            <Mail className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onEdit(contact)} 
            title="Editar contacto"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" 
            onClick={() => onDelete(contact.id)} 
            title="Eliminar contacto"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr>
      <td className="py-3 px-4"><div className="space-y-1"><div className="h-4 w-32 bg-muted rounded animate-pulse"></div><div className="h-3 w-24 bg-muted rounded animate-pulse"></div></div></td>
      <td className="py-3 px-4"><div className="h-4 w-40 bg-muted rounded animate-pulse"></div></td>
      <td className="py-3 px-4"><div className="h-4 w-28 bg-muted rounded animate-pulse"></div></td>
      <td className="py-3 px-4"><div className="h-5 w-16 bg-muted rounded animate-pulse"></div></td>
      <td className="py-3 px-4"><div className="flex gap-1"><div className="h-5 w-12 bg-muted rounded animate-pulse"></div><div className="h-5 w-12 bg-muted rounded animate-pulse"></div></div></td>
      <td className="py-3 px-4"><div className="h-4 w-24 bg-muted rounded animate-pulse"></div></td>
      <td className="py-3 px-4"><div className="flex gap-2"><div className="h-8 w-8 bg-muted rounded animate-pulse"></div><div className="h-8 w-8 bg-muted rounded animate-pulse"></div><div className="h-8 w-8 bg-muted rounded animate-pulse"></div><div className="h-8 w-8 bg-muted rounded animate-pulse"></div></div></td>
    </tr>
  );
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState<FunnelStage | "all">("all");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  
  // Edit states
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [editServerError, setEditServerError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  
  // Delete states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = async (page: number, limit: number, stage?: string, searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (stage && stage !== "all") params.append("stage", stage);
      if (searchTerm) params.append("search", searchTerm);
      const res = await fetch(`/api/contacts?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar contactos");
      const data: ContactsListResponse = await res.json();
      setContacts(data.data);
      setPagination({ page: data.pagination.page, limit: data.pagination.limit, total: data.pagination.total, totalPages: data.pagination.totalPages });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const isInitialMount = React.useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchContacts(pagination.page, pagination.limit, activeStage, search);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchContacts(1, pagination.limit, activeStage, search);
  }, [activeStage, pagination.limit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts(1, pagination.limit, activeStage, search);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchContacts(newPage, pagination.limit, activeStage, search);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((p) => ({ ...p, limit: newLimit, page: 1 }));
  };

  const validateField = (field: string, value: string): string | null => {
    if (field === "name") {
      if (!value || value.length < 3) return "Nombre debe tener al menos 3 caracteres";
      if (!/^[a-zA-Z\s]{3,}$/.test(value)) return "Nombre inválido (solo letras)";
    }
    if (field === "email") {
      if (!value) return "Email es requerido";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
    }
    if (field === "phone") {
      if (value && !/^\+?[\d\s]{7,20}$/.test(value)) return "Teléfono inválido";
    }
    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: error || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errors: Record<string, string> = {};
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (phoneError) errors.phone = phoneError;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          stage: "new",
        }),
      });
      if (res.status === 409) {
        setServerError("Ya existe un contacto con ese email");
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        if (res.status === 400) {
          const data = await res.json();
          setServerError(data.error || "Error de validación");
        } else {
          setServerError("Error del servidor");
        }
        setSubmitting(false);
        return;
      }
      setFormOpen(false);
      setFormData({ name: "", email: "", phone: "", company: "" });
      setFormErrors({});
      fetchContacts(pagination.page, pagination.limit, activeStage, search);
    } catch {
      setServerError("Error del servidor");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit functions
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
    });
    setEditFormErrors({});
    setEditServerError(null);
    setEditFormOpen(true);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setEditFormErrors((prev) => ({ ...prev, [field]: error || "" }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditServerError(null);
    const errors: Record<string, string> = {};
    const nameError = validateField("name", editFormData.name);
    const emailError = validateField("email", editFormData.email);
    const phoneError = validateField("phone", editFormData.phone);
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (phoneError) errors.phone = phoneError;
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/contacts/${editingContact!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone || null,
          company: editFormData.company || null,
        }),
      });
      if (res.status === 409) {
        setEditServerError("Ya existe un contacto con ese email");
        setEditSubmitting(false);
        return;
      }
      if (!res.ok) {
        if (res.status === 400) {
          const data = await res.json();
          setEditServerError(data.error || "Error de validación");
        } else {
          setEditServerError("Error del servidor");
        }
        setEditSubmitting(false);
        return;
      }
      setEditFormOpen(false);
      setEditingContact(null);
      setEditFormData({ name: "", email: "", phone: "", company: "" });
      setEditFormErrors({});
      fetchContacts(pagination.page, pagination.limit, activeStage, search);
    } catch {
      setEditServerError("Error del servidor");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Delete functions
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contacts/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setDeleteConfirmOpen(false);
        setDeleting(false);
        return;
      }
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      fetchContacts(pagination.page, pagination.limit, activeStage, search);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground text-sm mt-1">{pagination.total} contactos en total</p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo contacto
            </Button>
          </DialogTrigger>
          <DialogContent description="Ingresa los datos del nuevo contacto">
            <DialogHeader>
              <DialogTitle>Agregar nuevo contacto</DialogTitle>
              <DialogDescription className="sr-only">
                Ingresa los datos del nuevo contacto.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <Input
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={(e) => handleInputChange("name", e.target.value)}
                  disabled={submitting}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={(e) => handleInputChange("email", e.target.value)}
                  disabled={submitting}
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <Input
                  placeholder="Teléfono (opcional)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onBlur={(e) => handleInputChange("phone", e.target.value)}
                  disabled={submitting}
                />
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
              </div>
              <Input
                placeholder="Empresa (opcional)"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                disabled={submitting}
              />
              {serverError && <p className="text-sm text-red-500">{serverError}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar contacto"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 flex-wrap">
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
            type="button"
            variant={activeStage === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveStage("all")}
          >
            Todos
          </Button>
          {stages.map((s) => (
            <Button
              key={s}
              type="button"
              variant={activeStage === s ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStage(s)}
            >
              {stageLabels[s]}
            </Button>
          ))}
        </div>
      </form>

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
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-red-500">
                  {error}
                  <Button variant="link" onClick={() => fetchContacts(pagination.page, pagination.limit, activeStage, search)}>Reintentar</Button>
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No se encontraron contactos
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <ContactRow key={c.id} contact={c} onEdit={handleEdit} onDelete={handleDeleteClick} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar:</span>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              {[10, 20, 30, 50, 100].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm px-3">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editFormOpen} onOpenChange={setEditFormOpen}>
        <DialogContent description="Edita los datos del contacto">
          <DialogHeader>
            <DialogTitle>Modificar contacto</DialogTitle>
            <DialogDescription className="sr-only">
              Edita los datos del contacto.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-3 pt-2">
            <div>
              <Input
                placeholder="Nombre completo"
                value={editFormData.name}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
                onBlur={(e) => handleEditInputChange("name", e.target.value)}
                disabled={editSubmitting}
              />
              {editFormErrors.name && <p className="text-xs text-red-500 mt-1">{editFormErrors.name}</p>}
            </div>
            <div>
              <Input
                placeholder="Email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditInputChange("email", e.target.value)}
                onBlur={(e) => handleEditInputChange("email", e.target.value)}
                disabled={editSubmitting}
              />
              {editFormErrors.email && <p className="text-xs text-red-500 mt-1">{editFormErrors.email}</p>}
            </div>
            <div>
              <Input
                placeholder="Teléfono (opcional)"
                value={editFormData.phone}
                onChange={(e) => handleEditInputChange("phone", e.target.value)}
                onBlur={(e) => handleEditInputChange("phone", e.target.value)}
                disabled={editSubmitting}
              />
              {editFormErrors.phone && <p className="text-xs text-red-500 mt-1">{editFormErrors.phone}</p>}
            </div>
            <Input
              placeholder="Empresa (opcional)"
              value={editFormData.company}
              onChange={(e) => setEditFormData((prev) => ({ ...prev, company: e.target.value }))}
              disabled={editSubmitting}
            />
            {editServerError && <p className="text-sm text-red-500">{editServerError}</p>}
            <Button type="submit" className="w-full" disabled={editSubmitting}>
              {editSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Modificar contacto"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription className="sr-only">
              ¿Estás seguro de que deseas eliminar este contacto?
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            ¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
