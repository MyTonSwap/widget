import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import version from "vite-plugin-package-version";

// https://vitejs.dev/config/
export default defineConfig(() => ({
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler", // or "modern"
            },
        },
    },
    plugins: [
        nodePolyfills({ include: ["buffer"] }),
        tsconfigPaths(),
        version(),
        react(),
        cssInjectedByJsPlugin(),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "lib/main.ts"),
            name: "MyTonSwap Widget",
            fileName: "mytonswap-widget",
        },
        outDir: "dist/cdn",
    },
}));
