import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import version from "vite-plugin-package-version";

// https://vitejs.dev/config/
export default defineConfig({
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
        dts({
            rollupTypes: true,
            tsconfigPath: "./tsconfig.app.json",
            insertTypesEntry: true,
        }),
        cssInjectedByJsPlugin(),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "lib/main.ts"),
            name: "MyTonSwap Widget",
            fileName: "mytonswap-widget",
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react/jsx-runtime": "react/jsx-runtime",
                },
            },
        },
    },
});
