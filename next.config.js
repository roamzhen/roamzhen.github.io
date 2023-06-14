/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const withTM = require('next-transpile-modules')(['three'])
const withTMObj = withTM();

module.exports = {
  ...nextConfig, ...withTM
}
