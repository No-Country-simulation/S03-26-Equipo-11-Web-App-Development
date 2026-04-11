"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Toast({ open, onOpenChange, children, className }: ToastProps) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onOpenChange(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4", className)}>
      {children}
    </div>
  );
}

export interface ToastViewportProps {
  className?: string;
}

export function ToastViewport({ className }: ToastViewportProps) {
  return <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm", className)} />;
}
