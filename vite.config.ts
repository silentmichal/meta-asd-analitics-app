import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // 👇 TUTAJ DODAŁEM NOWY FRAGMENT
  preview: {
    host: true, // Pozwala na dostęp z zewnątrz kontenera (działa jak --host 0.0.0.0)
    port: 3000, // Port zgodny z ustawieniami w Coolify
    allowedHosts: ["meta-ads.157.180.26.69.sslip.io"], // Twoja domena
  },
  // 👆 KONIEC NOWEGO FRAGMENTU
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
