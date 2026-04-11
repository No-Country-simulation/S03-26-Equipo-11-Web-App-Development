import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* No experimental options yet to keep it stable */
  transpilePackages: ["swagger-ui-react"]
};

export default nextConfig;
