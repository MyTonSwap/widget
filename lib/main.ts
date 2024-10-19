import r2wc from "@r2wc/react-to-web-component";
import * as React from "react";

import "./tailwind.css";

import { TonConnectWrappedSwap } from "./components/Swap/Swap";
export * from "./components";

if (!customElements.get("mts-swap"))
    customElements.define(
        "mts-swap",
        r2wc(TonConnectWrappedSwap, {
            props: { theme: "json", options: "json" },
        })
    );

interface SwapProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
    > {
    options?: string;
    theme?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "mts-swap": SwapProps;
        }
    }
}
