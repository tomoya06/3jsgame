import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://www.jianshu.com/p/d600dbb0cdf8
// https://vitejs.dev/config/
export default ({ mode }) => {
  const base = mode === "github" ? "/3jsgame/" : "";
  return defineConfig({
    plugins: [react()],
    publicDir: "public",
    base,
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
  });
};
