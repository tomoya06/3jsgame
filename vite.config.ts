import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const base = mode === "github" ? "/3jsgame/" : "";

  return defineConfig({
    base,
  });
};
