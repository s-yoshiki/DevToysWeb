/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  experimental: {
    useTypeScriptCli: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
