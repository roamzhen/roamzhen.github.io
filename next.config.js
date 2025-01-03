/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export"
}

const withTM = require('next-transpile-modules')(['three'])
const withTMObj = withTM();

module.exports = {
  ...nextConfig, ...withTM
}
