"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Search, Plus, Send, FileText, Tag, Inbox, ArrowLeft, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { contacts, emailMessages, emailTemplates, type EmailTemplate } from "@/lib/data-source";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EmailMessage = {
  id: string;
  contactId: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  sent: boolean;
  labels: string[];
  from?: string;
  messageId?: string;
  html?: string;
};

interface ReceivedEmailData {
  from: string;
  to?: string;
  subject: string;
  date?: string;
  seen: boolean;
  messageId?: string;
  body?: string;
  html?: string;
}

const initialSentEmails = Object.values(emailMessages)
  .flat()
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function EmailRow({ email, onClick }: { email: EmailMessage; onClick: (email: EmailMessage) => void }) {
  const contact = contacts.find((c) => c.id === email.contactId);
  const displayName = email.sent 
    ? `Para: ${contact?.name || email.from || "Desconocido"}` 
    : (contact?.name || email.from || "Desconocido");
  const initials = contact?.name 
    ? contact.name.split(" ").map((n) => n[0]).join("") 
    : (email.from ? email.from[0].toUpperCase() : "?");
  
  return (
    <button
      onClick={() => onClick(email)}
      className={`w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b ${!email.read && !email.sent ? "bg-primary/5" : ""}`}
    >
      <div className="w-9 h-9 rounded-full bg-email/15 flex items-center justify-center text-sm font-semibold text-email shrink-0 mt-0.5">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className={`text-sm truncate ${!email.read && !email.sent ? "font-semibold" : "font-medium"}`}>
            {displayName}
          </span>
          <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{formatDate(email.timestamp)}</span>
        </div>
        <p className={`text-sm truncate ${!email.read && !email.sent ? "font-medium" : ""}`}>{email.subject}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{email.body}</p>
        <div className="flex gap-1 mt-1.5">
          {email.labels.map((l) => (
            <span key={l} className="funnel-badge bg-secondary text-secondary-foreground text-[10px]">
              <Tag className="w-2.5 h-2.5 mr-0.5" />
              {l}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function EmailPage() {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeTo, setComposeTo] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [errors, setErrors] = useState<{ to?: string; subject?: string }>({});
  const [toast, setToast] = useState<{ open: boolean; type: "success" | "error"; message: string }>({ open: false, type: "success", message: "" });
  const [sentEmails, setSentEmails] = useState<EmailMessage[]>(initialSentEmails);
  const [receivedEmails, setReceivedEmails] = useState<ReceivedEmailData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingEmailBody, setLoadingEmailBody] = useState(false);
  const [emailOffset, setEmailOffset] = useState(0);
  const [hasMoreEmails, setHasMoreEmails] = useState(true);
  const EMAIL_LIMIT = 20;

  const allEmailsWithReceived: EmailMessage[] = [
    ...sentEmails,
    ...receivedEmails.map((r, i) => ({
      id: r.messageId ? `received-${r.messageId}` : `received-${i}-${r.date || "unknown"}`,
      contactId: "",
      subject: r.subject,
      body: r.body || "",
      timestamp: r.date || new Date().toISOString(),
      read: r.seen,
      sent: false,
      labels: [],
      from: r.from,
      messageId: r.messageId,
      html: r.html,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const fetchReceivedEmails = async (offset: number, replace: boolean) => {
    setIsLoadingInbox(true);
    try {
      const url = `/api/email/receive?limit=${EMAIL_LIMIT}&offset=${offset}`;
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      if (!data.emails) {
        return;
      }

      setReceivedEmails((prev) => {
        if (replace) {
          return data.emails;
        }

        const merged = [...prev];
        for (const email of data.emails as ReceivedEmailData[]) {
          const exists = email.messageId
            ? merged.some((item) => item.messageId === email.messageId)
            : merged.some((item) => item.subject === email.subject && item.date === email.date && item.from === email.from);

          if (!exists) {
            merged.push(email);
          }
        }
        return merged;
      });
      setHasMoreEmails(data.emails.length === EMAIL_LIMIT);
    } catch (err) {
      console.error("Error fetching received emails:", err);
    } finally {
      setIsLoadingInbox(false);
    }
  };

  useEffect(() => {
    void fetchReceivedEmails(emailOffset, emailOffset === 0);
  }, [emailOffset]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, search]);

  const filteredEmails = allEmailsWithReceived.filter(
    (e) => e.subject.toLowerCase().includes(search.toLowerCase()) || e.body.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmails.length / pageSize);
  const paginatedEmails = filteredEmails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const refreshInbox = async () => {
    setCurrentPage(1);
    if (emailOffset !== 0) {
      setEmailOffset(0);
      return;
    }

    await fetchReceivedEmails(0, true);
  };

  const validateForm = (): boolean => {
    const newErrors: { to?: string; subject?: string } = {};
    if (!composeTo.trim()) {
      newErrors.to = "El correo es requerido";
    } else if (!EMAIL_REGEX.test(composeTo.trim())) {
      newErrors.to = "Correo inválido";
    }
    if (!composeSubject.trim()) {
      newErrors.subject = "El asunto es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    const toEmail = extractEmail(composeTo);
    if (!toEmail.trim()) {
      setToast({ open: true, type: "error", message: "El correo es requerido" });
      return;
    }
    if (!EMAIL_REGEX.test(toEmail.trim())) {
      setToast({ open: true, type: "error", message: "Correo inválido" });
      return;
    }
    if (!composeSubject.trim()) {
      setToast({ open: true, type: "error", message: "El asunto es requerido" });
      return;
    }

    setIsLoading(true);
    try {
      const toEmail = extractEmail(composeTo);
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toEmail.trim(), subject: composeSubject.trim(), text: composeBody }),
      });
      const data = await res.json();

      if (res.ok && data.status !== "failed") {
        const sentEmail: EmailMessage = {
          id: data.messageId ? `sent-${data.messageId}` : `sent-${Date.now()}`,
          contactId: "",
          subject: composeSubject.trim(),
          body: composeBody,
          timestamp: new Date().toISOString(),
          read: true,
          sent: true,
          labels: ["Enviado"],
          from: toEmail.trim(),
          messageId: data.messageId,
        };

        setSentEmails((prev) =>
          [sentEmail, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
        setSelectedEmail(sentEmail);
        setShowCompose(false);
        setIsReplyMode(false);
        setToast({ open: true, type: "success", message: "Correo enviado" });
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
        setErrors({});
      } else {
        setToast({ open: true, type: "error", message: data.error || "Error al enviar correo" });
      }
    } catch {
      setToast({ open: true, type: "error", message: "Error de conexión" });
    } finally {
      setIsLoading(false);
    }
  };

  const applyTemplate = (t: EmailTemplate) => {
    setComposeBody((prev) => prev + (prev ? "\n\n" : "") + t.body);
    setShowTemplates(false);
  };

  const extractEmail = (from: string): string => {
    const match = from.match(/<([^>]+)>/);
    return match ? match[1] : from;
  };

  const handleReply = (email: EmailMessage) => {
    const senderEmail = email.from || "";
    const originalSubject = email.subject.startsWith("Re: ") ? email.subject : `Re: ${email.subject}`;
    const quotedBody = email.body 
      ? `\n\n--- Mensaje original ---\n${email.body}`
      : "";
    
    setComposeTo(senderEmail);
    setComposeSubject(originalSubject);
    setComposeBody(quotedBody);
    setShowCompose(true);
    setIsReplyMode(true);
  };

  const selectedContact = selectedEmail ? contacts.find((c) => c.id === selectedEmail.contactId) : null;
  const selectedEmailPerson = selectedEmail
    ? selectedContact?.name || selectedEmail.from || "Desconocido"
    : "Desconocido";

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-xl border overflow-hidden bg-card">
      {/* Email list */}
      <div className="w-96 border-r flex flex-col shrink-0">
        <div className="p-3 border-b space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-email" />
              <span className="font-semibold text-sm">Bandeja de entrada</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={refreshInbox} disabled={isLoadingInbox}>
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInbox ? "animate-spin" : ""}`} />
              </Button>
              <Button size="sm" onClick={() => { setShowCompose(true); setIsReplyMode(false); setComposeTo(""); setComposeSubject(""); setComposeBody(""); setErrors({}); }}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Nuevo
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Buscar emails..." className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {paginatedEmails.map((e) => (
            <EmailRow key={e.id} email={e} onClick={async (email) => { 
              if (!email.sent && email.messageId && !email.body && !email.html) {
                setLoadingEmailBody(true);
                try {
                  const res = await fetch("/api/email/receiveOne", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messageId: email.messageId }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (data.email?.[0]) {
                      const fullEmail = data.email[0];
                      const updatedEmail: EmailMessage = {
                        ...email,
                        body: fullEmail.text || "",
                        html: fullEmail.html,
                      };
                      setReceivedEmails((prev) => prev.map((r) => 
                        r.messageId === email.messageId ? { ...r, body: fullEmail.text || "", html: fullEmail.html } : r
                      ));
                      setSelectedEmail(updatedEmail);
                      setShowCompose(false);
                      return;
                    }
                  }
                } catch (err) {
                  console.error("Error fetching email body:", err);
                } finally {
                  setLoadingEmailBody(false);
                }
              }
              setSelectedEmail(e); 
              setShowCompose(false); 
            }} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="p-2 border-t flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Mostrar:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="h-7 text-xs border rounded px-1 bg-background"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{currentPage}/{totalPages}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                <ChevronsLeft className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <ChevronRight className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                <ChevronsRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
        {hasMoreEmails && (
          <div className="p-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => setEmailOffset(prev => prev + EMAIL_LIMIT)}
              disabled={isLoadingInbox}
            >
              {isLoadingInbox ? "Cargando más..." : "Cargar más correos"}
            </Button>
          </div>
        )}
      </div>

      {/* Detail / Compose */}
      <div className="flex-1 flex flex-col">
        {showCompose ? (
          <div className="flex-1 flex flex-col p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">{isReplyMode ? "Responder correo" : "Nuevo correo"}</h2>
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Plantillas
                  </Button>
                </DialogTrigger>
                <DialogContent description="Elige una plantilla para usar en tu correo">
                  <DialogHeader>
                    <DialogTitle>Seleccionar plantilla</DialogTitle>
                    <DialogDescription className="sr-only">
                      Elige una plantilla para usar en tu correo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 pt-2">
                    {emailTemplates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => applyTemplate(t)}
                        className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.subject}</p>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3 flex-1 flex flex-col">
              <div>
                {isReplyMode ? (
                  <>
                    <Input 
                      placeholder="Para:" 
                      value={extractEmail(composeTo)} 
                      disabled 
                      className="bg-muted/50 cursor-not-allowed" 
                    />
                  </>
                ) : (
                  <>
                    <Input placeholder="Para:" value={composeTo} onChange={(e) => { setComposeTo(e.target.value); if (errors.to) setErrors((p) => ({ ...p, to: undefined })); }} className={errors.to ? "border-destructive ring-1 ring-destructive" : ""} />
                    {errors.to && <p className="text-xs text-destructive mt-1">{errors.to}</p>}
                  </>
                )}
              </div>
              <div>
                <Input placeholder="Asunto" value={composeSubject} onChange={(e) => { setComposeSubject(e.target.value); if (errors.subject) setErrors((p) => ({ ...p, subject: undefined })); }} className={errors.subject ? "border-destructive ring-1 ring-destructive" : ""} />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
              </div>
              <Textarea
                placeholder="Escribe tu mensaje..."
                className="flex-1 min-h-[200px] resize-none"
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
              />
              <div className="flex justify-end">
                <Button type="button" onClick={(e) => { e.preventDefault(); handleSend(); }} disabled={isLoading}>
                  <Send className="w-4 h-4 mr-1.5" />
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className="flex-1 flex flex-col">
            <div className="border-b p-4">
              <Button variant="ghost" size="sm" className="mb-2" onClick={() => setSelectedEmail(null)}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Volver
              </Button>
              <h2 className="font-semibold text-lg">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{selectedEmail.sent ? `Para: ${selectedEmailPerson}` : `De: ${selectedEmailPerson}`}</span>
                <span>·</span>
                <span>{formatDate(selectedEmail.timestamp)}</span>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-auto">
              {loadingEmailBody ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
                </div>
              ) : selectedEmail.html ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap email-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEmail.html || "") }} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
              )}
            </div>
            <div className="border-t p-3 flex justify-center">
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleReply(selectedEmail)}>↩️ Responder</Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Selecciona un correo para verlo</p>
            </div>
          </div>
        )}
      </div>
      <Toast open={toast.open} onOpenChange={(open) => setToast((t) => ({ ...t, open }))}>
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-destructive text-destructive-foreground"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      </Toast>
    </div>
  );
}
