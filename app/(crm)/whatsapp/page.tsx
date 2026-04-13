"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Send, Loader2, RefreshCw, MessageCircle, Smile, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WhatsAppContact {
  contactId: string;
  name: string;
  phone: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageAt: string;
}

interface WhatsAppMessage {
  id: string;
  contenido: string;
  direccion: "entrante" | "saliente";
  fecha: string;
  leido: boolean;
}

interface ContactsResponse {
  data: WhatsAppContact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface MessagesResponse {
  data: WhatsAppMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function formatTime(ts: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("es-BO", { day: "numeric", month: "short" });
}

function formatDateTime(ts: string) {
  if (!ts) return "";
  const date = new Date(ts);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export default function WhatsAppPage() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.append("search", search);
      const res = await fetch(`/api/whatsapp?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar contactos");
      const data: ContactsResponse = await res.json();
      setContacts(data.data);
      if (data.data.length > 0 && !selectedContact) {
        const firstContact = data.data[0];
        setSelectedContact(firstContact);
        // Fetch messages in parallel with contacts
        fetchMessages(firstContact.contactId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/whatsapp/${contactId}?limit=5`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar mensajes");
      const data: MessagesResponse = await res.json();
      setMessages(data.data);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.contactId);
    }
  }, [selectedContact]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact) return;

    const textToSend = messageText;
    setSending(true);
    setError(null);

    // Optimistic update: show message immediately
    const optimisticMsg: WhatsAppMessage = {
      id: `opt-${Date.now()}`,
      contenido: textToSend,
      direccion: "saliente",
      fecha: new Date().toISOString(),
      leido: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageText("");

    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          to: selectedContact.phone,
          text: textToSend,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar mensaje");
      }

      // Replace optimistic message with real one from server
      fetchMessages(selectedContact.contactId);
      fetchContacts();
    } catch (err) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setSending(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data && typeof data.error === "string" ? data.error : "Error al sincronizar"
        );
      }

      // Show sync results
      const { newMessages, contactsUpdated, errors } = data;
      if (newMessages > 0 || contactsUpdated > 0) {
        setError(`✅ Sync: ${newMessages} mensajes nuevos, ${contactsUpdated} contactos actualizados`);
      } else if (errors && errors.length > 0) {
        setError(`⚠️ Sync completado con advertencias: ${errors.slice(0, 2).join(", ")}`);
      } else {
        setError("ℹ️ Sync: No hay mensajes nuevos");
      }

      fetchContacts();
      if (selectedContact) {
        fetchMessages(selectedContact.contactId);
      }
    } catch (err) {
      console.error("Sync error:", err);
      setError(err instanceof Error ? err.message : "Error al sincronizar");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">WhatsApp</h1>
          <p className="text-muted-foreground text-sm mt-1">Mensajes de WhatsApp</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
          {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Sincronizar
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex h-[calc(100vh-12rem)] rounded-xl border overflow-hidden bg-card">
        {/* Contact list */}
        <div className="w-80 border-r flex flex-col shrink-0">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Conversaciones</span>
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
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No hay conversaciones
              </div>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.contactId}
                  onClick={() => setSelectedContact(c)}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors text-left ${
                    selectedContact?.contactId === c.contactId ? "bg-muted" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-semibold text-green-600 dark:text-green-400 shrink-0">
                    {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-sm truncate">{c.name}</span>
                      {c.lastMessageAt && (
                        <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                          {formatDateTime(c.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {c.lastMessage || c.phone}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {selectedContact ? (
            <>
              {/* Header */}
              <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-semibold text-green-600 dark:text-green-400 shrink-0">
                    {selectedContact.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{selectedContact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedContact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-3 bg-muted/20">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic">
                    No hay mensajes con {selectedContact.name}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.direccion === "saliente" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 break-words shadow-sm ${
                        msg.direccion === "saliente"
                          ? "bg-green-500 text-white"
                          : "bg-background text-foreground border"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.contenido}</p>
                        <p className={`text-[10px] mt-1 ${msg.direccion === "saliente" ? "text-white/70" : "text-muted-foreground"}`}>
                          {formatDateTime(msg.fecha)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-3 bg-background shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-full">
                  <div className="flex items-center gap-1 shrink-0">
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-green-600 hidden sm:flex">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-green-600">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Input
                      placeholder="Escribe un mensaje..."
                      className="h-10 w-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-green-500 text-sm"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      disabled={sending}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-10 w-10 shrink-0 bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors" 
                    disabled={sending || !messageText.trim()}
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecciona una conversación
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
