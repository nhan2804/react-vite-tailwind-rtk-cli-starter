import eslint from "@rbnlffl/rollup-plugin-eslint";
import react from "@vitejs/plugin-react";

import { resolve } from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
/**
 * @type {import('vite').UserConfig}
 */
const config = ({ command }) => ({
  plugins: [
    react(),
    eslint({
      extensions: ["js", "jsx", "ts", "tsx"],
      filterInclude: ["**/*.{js,ts,jsx,tsx}"],
      throwOnError: true,
    }),
  ],
  base: command === "serve" ? "" : "/",
  build: {
    manifest: true,
  },
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@pages": resolve(__dirname, "./src/pages"),
      "@services": resolve(__dirname, "./src/services"),
      "@modules": resolve(__dirname, "./src/modules"),
      "@models": resolve(__dirname, "./src/models"),
      "@routes": resolve(__dirname, "./src/routes"),
      "@app": resolve(__dirname, "./src/app"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@components": resolve(__dirname, "./src/components"),
      "@action": resolve(__dirname, "./src/redux/action"),
      "@config": resolve(__dirname, "./src/config"),
      "@helper": resolve(__dirname, "./src/helper"),
      "@assets": resolve(__dirname, "./src/assets"),
      "@data": resolve(__dirname, "./src/data"),
      "@redux": resolve(__dirname, "./src/redux"),
      "@icon": resolve(__dirname, "./src/common/components/icons"),
      "@defines": resolve(__dirname, "./src/defines"),
      "@layouts": resolve(__dirname, "./src/layouts"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        {
          name: "fix-node-globals-polyfill",
          setup(build) {
            build.onResolve(
              { filter: /_virtual-process-polyfill_\.js/ },
              ({ path }) => ({ path })
            );
          },
        },
      ],
    },
  },
});
export default config;
