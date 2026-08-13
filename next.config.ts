import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lokální prohlížeč a integrovaný náhled mohou používat různý hostname.
  // Bez obou hodnot Next.js zablokuje HMR a stránka může kombinovat nový markup
  // se starým CSS bundlem.
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
