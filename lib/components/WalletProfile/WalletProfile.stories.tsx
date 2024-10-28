import type { Meta, StoryObj } from "@storybook/react";

import { WalletProfile } from "./WalletProfile";
import { tonConnectUi } from "../../../.storybook/preview";
const meta: Meta<typeof WalletProfile> = {
    component: WalletProfile,
    decorators: [
        (Story, ctx) => {
            return (
                <Story
                    args={{ ...ctx.args, tonConnectInstance: tonConnectUi }}
                />
            );
        },
    ],
};

export default meta;

type Story = StoryObj<typeof WalletProfile>;

export const Default: Story = {
    args: {
        position: "bottom-right",
    },
};

export const topLeft: Story = {
    args: {
        position: "top-left",
    },
};

export const topRight: Story = {
    args: {
        position: "top-right",
    },
};

export const bottomLeft: Story = {
    args: {
        position: "bottom-left",
    },
};

export const customTheme: Story = {
    args: {
        theme: {
            text_black_color: "#ffffff",
            primary_color: "#22c55e",
            background_color: "#101828",
            border_color: "#1D2939",
            text_white_color: "#FFFFFF",
            background_shade_color: "#1D2939",
        },

        position: "bottom-right"
    },
};
