import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Swap } from "./Swap";
import { tonConnectUi } from "../../../.storybook/preview";

const meta: Meta<typeof Swap> = {
    component: Swap,
    decorators: [
        (Story, args) => {
            return (
                <Story
                    args={{
                        ...args.args,
                        tonConnectInstance: tonConnectUi,
                        onTokenSelect: action("onTokenSelect"),
                        onSwap: action("onSwap"),
                    }}
                />
            );
        },
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
            price_impact: "#E64646",
            skeleton_shine: "#FFFFFF",
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

export const WithPinnedTokens: Story = {
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
            price_impact: "#E64646",
        },
        options: {
            pin_tokens: [
                "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                "EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_",
            ],
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
            default_pay_token:
                "EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_",
            default_receive_token:
                "EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7",
        },
    },
};

export const WithLockedToken: Story = {
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
            default_pay_token:
                "EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_",
            default_receive_token:
                "EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7",
            lock_pay_token: true,
        },
    },
};

export const WithLockedInput: Story = {
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
            price_impact: "#E64646",
        },
        options: {
            default_pay_token:
                "EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_",
            default_receive_token:
                "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
            lock_pay_token: true,
            lock_receive_token: true,
            lock_input: true,
            default_pay_amount: "1000000",

            ui_preferences: {
                disable_provided_text: false,
                show_swap_details: true,
                show_settings_wallet: true,
                show_settings_slippage: true,
                show_settings_community: true,
                show_change_direction: true,
                show_settings: true,
            },
        },
    },
};

export const WithoutRefresh: Story = {
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
            price_impact: "#E64646",
        },
        options: {
            default_pay_token:
                "EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_",
            default_receive_token:
                "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
            lock_pay_token: true,
            lock_receive_token: true,
            lock_input: true,
            default_pay_amount: "1000000",

            ui_preferences: {
                show_refresh: false,
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

export const TonJiggle: Story = {
    args: {
        theme: {
            border: "#004A6533",
            primary: "#177594",
            background: "#181F34",
            input_card: "#27272A",
            input_token: "#1D2939",
            light_shade: "#193349",
            slippage_box: "#D1D1E0",
            text_black: "#FFFFFF",
            text_white: "#FFFFFF",
            text_fade: "#6B7280",
            skeleton_shine: "#585959",
        },
    },
};

export const WithAppId: Story = {
    args: {
        theme: {
            border: "#004A6533",
            primary: "#177594",
            background: "#181F34",
            input_card: "#27272A",
            input_token: "#1D2939",
            light_shade: "#193349",
            slippage_box: "#D1D1E0",
            text_black: "#FFFFFF",
            text_white: "#FFFFFF",
            text_fade: "#6B7280",
            skeleton_shine: "#585959",
        },
        options: {
            app_id: "tonjiggle",
        },
    },
};

export const HideSwapDetail: Story = {
    args: {
        theme: {
            border: "#004A6533",
            primary: "#177594",
            background: "#181F34",
            input_card: "#27272A",
            input_token: "#1D2939",
            light_shade: "#193349",
            slippage_box: "#D1D1E0",
            text_black: "#FFFFFF",
            text_white: "#FFFFFF",
            text_fade: "#6B7280",
            skeleton_shine: "#585959",
            price_impact: "#E64646",
        },
        options: {
            app_id: "tonjiggle",

            ui_preferences: {
                show_swap_details: false,
                disable_provided_text: false,
            },
        },
    },
};

export const Russian: Story = {
    args: {
        locale: "ru",
    },
};

export const Arabic: Story = {
    args: {
        locale: "ar",
    },
};

export const Spanish: Story = {
    args: {
        locale: "es",
    },
};

export const SimplifiedChinese: Story = {
    args: {
        locale: "cn",
    },
};

export const Farsi: Story = {
    args: {
        locale: "fa",
    },
};
