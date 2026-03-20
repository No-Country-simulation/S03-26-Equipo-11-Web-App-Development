import { useState } from "react";
import { Search, Send, Paperclip, Smile, Phone, Video, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contacts, whatsappMessages, type Contact } from "@/data/mockData";

const whatsappContacts = contacts.filter((c) => whatsappMessages[c.id]);

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

export default function WhatsApp() {
  const [selected, setSelected] = useState<Contact>(whatsappContacts[0]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const messages = whatsappMessages[selected.id] || [];
  const filteredContacts = whatsappContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-xl border overflow-hidden bg-card">
      {/* Contact list */}
      <div className="w-80 border-r flex flex-col shrink-0">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-whatsapp flex items-center justify-center">
              <span className="text-whatsapp-foreground text-xs font-bold">W</span>
            </div>
            <span className="font-semibold text-sm">WhatsApp</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar chat..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredContacts.map((c) => {
            const lastMsg = whatsappMessages[c.id]?.slice(-1)[0];
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors text-left ${
                  selected.id === c.id ? "bg-muted" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-whatsapp/15 flex items-center justify-center text-sm font-semibold text-whatsapp shrink-0">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-sm truncate">{c.name}</span>
                    {lastMsg && (
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                        {formatTime(lastMsg.timestamp)}
                      </span>
                    )}
                  </div>
                  {lastMsg && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.text}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-whatsapp/15 flex items-center justify-center text-sm font-semibold text-whatsapp">
              {selected.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="font-medium text-sm">{selected.name}</p>
              <p className="text-xs text-muted-foreground">{selected.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-2 bg-muted/20">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
              <div className={msg.sent ? "chat-bubble-sent" : "chat-bubble-received"}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.sent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Smile className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Escribe un mensaje..."
            className="h-9"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button size="icon" className="h-9 w-9 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
