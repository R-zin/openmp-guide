import type { NextConfig } from "next";

// Determine basePath:
// 1. Explicit env var NEXT_PUBLIC_BASE_PATH
// 2. Or GitHub Actions repository name (e.g., /openmp-guide)
// 3. Or empty string for local development
const getBasePath = (): string => {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
    return repo ? `/${repo}` : "";
  }
  return "";
};

const basePath = getBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
