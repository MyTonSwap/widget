import type { Preview } from "@storybook/react";

import "../lib/global.css";
import { TonConnectUI } from "@tonconnect/ui-react";

export const tonConnectUi = new TonConnectUI({
    manifestUrl: "https://mytonswap.com/wallet/manifest.json",
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: "centered",
        options: {
            storySort: {
                order: ["Components", ["Swap", "Default"]],
            },
        },
    },
};

export default preview;
