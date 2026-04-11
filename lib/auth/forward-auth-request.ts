function resolveOrigin(request: Request): string {
  const configuredUrl = process.env.BETTER_AUTH_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
}

export function forwardAuthRequest(request: Request, pathname: string): Request {
  const targetUrl = new URL(pathname, request.url);
  const headers = new Headers(request.headers);

  if (!headers.get("origin")) {
    headers.set("origin", resolveOrigin(request));
  }

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    body: request.body,
    duplex: "half",
  };

  return new Request(targetUrl, init);
}
