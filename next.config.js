/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    HASH_KEY: process.env.NEXT_PUBLIC_HASH_KEY,
  },
};

module.exports = nextConfig;
