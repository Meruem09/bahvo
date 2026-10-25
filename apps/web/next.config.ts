import type { NextConfig } from "next";

const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  transpilePackages: ["@bahvo/registry", "@bahvo/ui"],
  async headers() {
    return [
      // Content-hashed by the registry build, so they can be cached forever.
      { source: "/css/:path*", headers: immutable },
      { source: "/thumbs/:path*", headers: immutable },
      {
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
