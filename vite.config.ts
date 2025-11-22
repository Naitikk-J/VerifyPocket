import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { run } from "vite-plugin-run";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env.MONGODB_URI': JSON.stringify('mongodb+srv://Naitik:Naitik%4015@cluster0.ctcnkti.mongodb.net/?appName=Cluster0')
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && run({
      input: ["src/server.ts"],
      map: {
        "src/server.ts": "dist/server.js"
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        client: "index.html",
        server: "src/server.ts"
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "server") {
            return "server/main.js";
          }
          return "[name]-[hash].js";
        }
      }
    }
  }
}));
