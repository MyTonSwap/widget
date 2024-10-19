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
            border: "#1D2939", // Darker version of the light border
            primary: "#16A34A", // A slightly darker, more muted green for primary
            background: "#101828", // Dark background
            input_card: "#27272A", // Dark input card
            input_token: "#1D2939", // Dark version of the input token background
            light_shade: "#1D2939", // Light shade adapted to darker theme
            slippage_box: "#D1D1E0", // Lighter, contrasting text for slippage box
            text_black: "#FFFFFF", // Text should now be light
            text_white: "#000000", // White text becomes dark
            text_fade: "#6B7280", // Darker, muted version of the faded text
            skeleton_shine: "#585959",
        },
    },
};
export const RedStone: Story = {
    args: {
        theme: {
            border: "#3A3A3C", // Darker version of the light border
            primary: "#b91c1c",
            background: "#101828", // Dark background
            input_card: "#27272A", // Dark input card
            input_token: "#3A3A3C", // Dark version of the input token background
            light_shade: "#3A3A3C", // Light shade adapted to darker theme
            slippage_box: "#D1D1E0", // Lighter, contrasting text for slippage box
            text_black: "#FFFFFF", // Text should now be light
            text_white: "#000000", // White text becomes dark
            text_fade: "#6B7280", // Darker, muted version of the faded text
            skeleton_shine: "#585959",
        },
    },
};

export const CyberPunk: Story = {
    args: {
        theme: {
            border: "#2A2B2F", // Dark with a subtle border effect
            primary: "#FFCC00", // Vibrant neon yellow, similar to the Cyberpunk logo
            background: "#121212", // Deep black with a slight gray tint
            input_card: "#1C1C1E", // Dark input card with a subtle bluish tone
            input_token: "#252527", // Dark gray with a slight hint of metal sheen
            light_shade: "#2F3136", // Darker gray for subtle highlights
            slippage_box: "#FF0057", // Neon pink/red for striking contrast
            text_black: "#EDEDED", // Light text for high contrast against the dark background
            text_white: "#0C0C0E", // Very dark gray/black for specific uses
            text_fade: "#808080", // Muted gray for less prominent text
            skeleton_shine: "#585959",
        },
    },
};
