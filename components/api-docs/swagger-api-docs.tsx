"use client";

import { useEffect, useRef } from "react";
import "swagger-ui-react/swagger-ui.css";

type SwaggerUIBundle = (config: {
  domNode: Element;
  url: string;
  deepLinking?: boolean;
  displayRequestDuration?: boolean;
  docExpansion?: "list" | "full" | "none";
  defaultModelsExpandDepth?: number;
  filter?: boolean | string;
  persistAuthorization?: boolean;
}) => unknown;

export function SwaggerApiDocs() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.replaceChildren();

    let cancelled = false;

    // swagger-ui ships this bundle without TS types; we only need the runtime export here.
    // @ts-expect-error untyped JS bundle loaded on the client
    void import("../../node_modules/swagger-ui-react/swagger-ui-bundle.js").then((module) => {
      if (cancelled) {
        return;
      }

      const SwaggerUIBundle = (module.default ?? module) as SwaggerUIBundle;

      SwaggerUIBundle({
        domNode: container,
        url: "/openapi.json",
        deepLinking: true,
        displayRequestDuration: true,
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
        filter: true,
        persistAuthorization: true,
      });
    });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div ref={containerRef} />
    </div>
  );
}
