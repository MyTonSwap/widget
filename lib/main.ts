// import r2wc from "@r2wc/react-to-web-component";
// import * as React from "react";

import "./global.css";
// import { TonConnectWrappedSwap } from "./components/Swap/Swap";
export * from "./components";
export { default as i18n } from "./i18n/i18n";

// if (!customElements.get("mts-swap"))
//     customElements.define(
//         "mts-swap",
//         r2wc(TonConnectWrappedSwap, {
//             props: { theme: "json", options: "json" },
//         })
//     );

// interface SwapProps
//     extends React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLElement>,
//         HTMLElement
//     > {
//     options?: string;
//     theme?: string;
// }

// declare global {
//     namespace JSX {
//         interface IntrinsicElements {
//             "mts-swap": SwapProps;
//         }
//     }
// }
