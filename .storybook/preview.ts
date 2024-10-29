import type { Preview } from "@storybook/react";

import "../lib/tailwind.css";
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
    },
};

export default preview;
