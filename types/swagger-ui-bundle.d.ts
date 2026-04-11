declare module "../../node_modules/swagger-ui-react/swagger-ui-bundle.js" {
  const SwaggerUIBundle: (config: {
    domNode: Element;
    url: string;
    deepLinking?: boolean;
    displayRequestDuration?: boolean;
    docExpansion?: "list" | "full" | "none";
    defaultModelsExpandDepth?: number;
    filter?: boolean | string;
    persistAuthorization?: boolean;
  }) => unknown;

  export default SwaggerUIBundle;
}
