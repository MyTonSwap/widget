import type { Meta, StoryObj } from "@storybook/react";

import { Swap } from "./Swap";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const meta: Meta<typeof Swap> = {
    component: Swap,
    decorators: [
        (Story) => (
            <TonConnectUIProvider manifestUrl="https://mytonswap.com/wallet/manifest.json">
                <Story />
            </TonConnectUIProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Swap>;

export const Default: Story = {
    args: {
        theme: {
            border: "#f4f4f5",
            primary: "#22c55e",
            background: "#FFFFFF",
            input_card: "#FFFFFF",
            input_token: "#F4F4F5",
            light_shade: "#F4F4F5",
            slippage_box: "#71717A",
            text_black: "#000000",
            text_white: "#FFFFFF",
            text_fade: "#9CAACB",
        },
    },
};

export const Dark: Story = {
    args: {
        theme: {
            border: "#1D2939",
            primary: "#16A34A",
            background: "#101828",
            input_card: "#27272A",
            input_token: "#1D2939",
            light_shade: "#1D2939",
            slippage_box: "#D1D1E0",
            text_black: "#FFFFFF",
            text_white: "#000000",
            text_fade: "#6B7280",
            skeleton_shine: "#585959",
        },
    },
};

export const WithDefaultTokens: Story = {
    args: {
        theme: {
            border: "#1D2939",
            primary: "#16A34A",
            background: "#101828",
            input_card: "#27272A",
            input_token: "#1D2939",
            light_shade: "#1D2939",
            slippage_box: "#D1D1E0",
            text_black: "#FFFFFF",
            text_white: "#000000",
            text_fade: "#6B7280",
            skeleton_shine: "#585959",
        },
        options: {
            defaultTokens: {
                pay_token: "EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_",
                receive_token:
                    "EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7",
            },
        },
    },
};
export const RedStone: Story = {
    args: {
        theme: {
            border: "#3A3A3C",
            primary: "#b91c1c",
            background: "#101828",
            input_card: "#27272A",
            input_token: "#3A3A3C",
            light_shade: "#3A3A3C",
            slippage_box: "#D1D1E0",
            text_black: "#FFFFFF",
            text_white: "#000000",
            text_fade: "#6B7280",
            skeleton_shine: "#585959",
        },
    },
};

export const CyberPunk: Story = {
    args: {
        theme: {
            border: "#2A2B2F",
            primary: "#FFCC00",
            background: "#121212",
            input_card: "#1C1C1E",
            input_token: "#252527",
            light_shade: "#2F3136",
            slippage_box: "#FF0057",
            text_black: "#EDEDED",
            text_white: "#0C0C0E",
            text_fade: "#808080",
            skeleton_shine: "#585959",
        },
    },
};
