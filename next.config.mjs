/** @type {import('next').NextConfig} */
const appEnv = process.env.APP_ENV || "development";
import loadEnv from "./env-loader.js";
loadEnv(appEnv);
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig = {
  env: {
    APP_ENV: process.env.APP_ENV,
        DOMAIN: "english.jagran.com",

  },
    images: {
    domains: ["imgeng.jagran.com"],
    unoptimized: true,
    minimumCacheTTL: 10,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgeng.jagran.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      { protocol: "https", hostname: "i.ytimg.com", port: "", pathname: "/**" },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.omnycontent.com",
        port: "",
        pathname: "/**",
      },

    ],
  },
  async rewrites() {
    return {
      afterFiles: [],
      beforeFiles: [],
    };
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
// const nextConfig = {
//   env: {
//     APP_ENV: process.env.APP_ENV,
//   },
//   async rewrites() {
//     return {
//       afterFiles: [],
//       beforeFiles: [],
//     };
//   },
// };

// export default nextConfig;
