import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const base = mode === "github" ? "/3jsgame/" : "";

  return defineConfig({
    base,
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `[name].[hash].js`,
          chunkFileNames: `[name].[hash].js`,
          assetFileNames: (chunk) => {
            if (chunk.name?.endsWith(".bin") || chunk.name?.endsWith(".gltf")) {
              return `assets/[name].[ext]`;
            }
            return `assets/[name].[hash].[ext]`;
          },
        },
      },
    },
  });
};
