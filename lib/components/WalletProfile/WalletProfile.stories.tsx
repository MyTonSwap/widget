import type { Meta, StoryObj } from "@storybook/react";

import { WalletProfile } from "./WalletProfile";
import { tonConnectUi } from "../../../.storybook/preview";
const meta: Meta<typeof WalletProfile> = {
    component: WalletProfile,
    decorators: [
        (Story, ctx) => {
            return (
                <div className="mts-default">
                    <Story
                        args={{ ...ctx.args, tonConnectInstance: tonConnectUi }}
                    />
                </div>
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
        position: "bottom-right",
    },
    decorators: [
        (Story) => (
            <div className="mts-dark">
                <Story />
            </div>
        ),
    ],
};
