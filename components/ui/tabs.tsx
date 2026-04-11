"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

type TabsValue = string;

type WithClassName = {
  className?: string;
};

type TabsInjectedProps = {
  activeValue?: TabsValue;
  onValueChange?: (value: TabsValue) => void;
};

type TabsProps = WithClassName & {
  defaultValue: TabsValue;
  children: React.ReactNode;
};

type TabsListProps = {
  children: React.ReactNode;
} & TabsInjectedProps;

type TabsTriggerProps = {
  value: TabsValue;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
};

type TabsContentProps = WithClassName & {
  value: TabsValue;
  children: React.ReactNode;
} & TabsInjectedProps;

function isReactElementWithProps<P>(child: React.ReactNode): child is React.ReactElement<P> {
  return React.isValidElement(child);
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className={cn("space-y-4", className)}>
      {React.Children.map(children, (child) => {
        if (isReactElementWithProps<TabsInjectedProps>(child)) {
          return React.cloneElement(child, {
            activeValue: value,
            onValueChange: setValue,
          });
        }

        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeValue, onValueChange }: TabsListProps) {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      {React.Children.map(children, (child) => {
        if (isReactElementWithProps<TabsTriggerProps>(child)) {
          const childValue = child.props.value;

          return React.cloneElement(child, {
            isActive: childValue === activeValue,
            onClick: () => onValueChange?.(childValue),
          });
        }

        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ children, isActive, onClick }: TabsTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeValue, children, className }: TabsContentProps) {
  if (value !== activeValue) {
    return null;
  }

  return <div className={cn("mt-2", className)}>{children}</div>;
}

export function Switch({ defaultChecked, className }: { defaultChecked?: boolean; className?: string }) {
  const [checked, setChecked] = useState(defaultChecked ?? false);

  return (
    <button
      type="button"
      onClick={() => setChecked((current) => !current)}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
      {children}
    </label>
  );
}
