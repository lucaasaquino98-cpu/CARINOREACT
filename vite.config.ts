import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Garante compatibilidade no deploy da Vercel
  build: {
    outDir: "dist",
  },

  // Habilita caminhos relativos corretos em produção
  base: "/",

  // Permite chamadas /api no Vercel (rotas serverless)
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
