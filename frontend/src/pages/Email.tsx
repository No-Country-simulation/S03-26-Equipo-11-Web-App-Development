import { useState } from "react";
import { Search, Plus, Send, FileText, Tag, Inbox, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { contacts, emailMessages, emailTemplates, type EmailMessage, type EmailTemplate } from "@/data/mockData";

const allEmails = Object.values(emailMessages).flat().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function EmailRow({ email, onClick }: { email: EmailMessage; onClick: () => void }) {
  const contact = contacts.find((c) => c.id === email.contactId);
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b ${!email.read && !email.sent ? "bg-primary/5" : ""}`}
    >
      <div className="w-9 h-9 rounded-full bg-email/15 flex items-center justify-center text-sm font-semibold text-email shrink-0 mt-0.5">
        {contact?.name.split(" ").map((n) => n[0]).join("") || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className={`text-sm truncate ${!email.read && !email.sent ? "font-semibold" : "font-medium"}`}>
            {email.sent ? `Para: ${contact?.name}` : contact?.name}
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposBody] = useState("");
  const [composeTo, setComposeTo] = useState("");
  const [search, setSearch] = useState("");

  const filteredEmails = allEmails.filter(
    (e) => e.subject.toLowerCase().includes(search.toLowerCase()) || e.body.toLowerCase().includes(search.toLowerCase())
  );

  const applyTemplate = (t: EmailTemplate) => {
    setComposeSubject(t.subject);
    setComposBody(t.body);
    setShowTemplates(false);
  };

  const selectedContact = selectedEmail ? contacts.find((c) => c.id === selectedEmail.contactId) : null;

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
            <Button size="sm" onClick={() => setShowCompose(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nuevo
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Buscar emails..." className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredEmails.map((e) => (
            <EmailRow key={e.id} email={e} onClick={() => { setSelectedEmail(e); setShowCompose(false); }} />
          ))}
        </div>
      </div>

      {/* Detail / Compose */}
      <div className="flex-1 flex flex-col">
        {showCompose ? (
          <div className="flex-1 flex flex-col p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Nuevo correo</h2>
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Plantillas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Seleccionar plantilla</DialogTitle>
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
              <Input placeholder="Para:" value={composeTo} onChange={(e) => setComposeTo(e.target.value)} />
              <Input placeholder="Asunto" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} />
              <Textarea
                placeholder="Escribe tu mensaje..."
                className="flex-1 min-h-[200px] resize-none"
                value={composeBody}
                onChange={(e) => setComposBody(e.target.value)}
              />
              <div className="flex justify-end">
                <Button>
                  <Send className="w-4 h-4 mr-1.5" />
                  Enviar
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
                <span>{selectedEmail.sent ? `Para: ${selectedContact?.name}` : `De: ${selectedContact?.name}`}</span>
                <span>·</span>
                <span>{formatDate(selectedEmail.timestamp)}</span>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-auto">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
            </div>
            <div className="border-t p-3 flex gap-2">
              <Button variant="outline" size="sm">Responder</Button>
              <Button variant="outline" size="sm">Reenviar</Button>
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
    </div>
  );
}
