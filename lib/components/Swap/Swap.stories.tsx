import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Swap } from './Swap';
import { tonConnectUi } from '../../../.storybook/preview';

const meta: Meta<typeof Swap> = {
    component: Swap,
    decorators: [
        (Story, args) => {
            return (
                <div className="mts-default">
                    <Story
                        args={{
                            ...args.args,
                            tonConnectInstance: tonConnectUi,
                            onTokenSelect: action('onTokenSelect'),
                            onSwap: action('onSwap'),
                        }}
                    />
                </div>
            );
        },
    ],
};

export default meta;

type Story = StoryObj<typeof Swap>;

export const Default: Story = {
    decorators: [
        (Story) => (
            <div className="mts-default">
                <Story />
            </div>
        ),
    ],
};

export const Dark: Story = {
    decorators: [
        (Story) => (
            <div className="mts-dark">
                <Story />
            </div>
        ),
    ],
};

export const WithPinnedTokens: Story = {
    args: {
        options: {
            pin_tokens: [
                'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
                'EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_',
            ],
        },
    },
};

export const WithDefaultTokens: Story = {
    args: {
        options: {
            default_pay_token:
                'EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_',
            default_receive_token: 'RAFF',
        },
    },
};

export const WithLockedToken: Story = {
    args: {
        options: {
            default_pay_token:
                'EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_',
            default_receive_token:
                'EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7',
            lock_pay_token: true,
        },
    },
};

export const WithLockedInput: Story = {
    args: {
        options: {
            default_pay_token:
                'EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_',
            default_receive_token:
                'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
            lock_pay_token: true,
            lock_receive_token: true,
            lock_input: true,
            default_pay_amount: '1000000',

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
        options: {
            default_pay_token:
                'EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_',
            default_receive_token:
                'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
            lock_pay_token: true,
            lock_receive_token: true,
            lock_input: true,
            default_pay_amount: '1000000',

            ui_preferences: {
                show_refresh: false,
            },
        },
    },
};

export const TonJiggle: Story = {
    decorators: [
        (Story) => (
            <div className="mts-ton-jiggle">
                <Story />
            </div>
        ),
    ],
};

export const WithAppId: Story = {
    args: {
        options: {
            app_id: 'tonjiggle',
        },
    },
    decorators: [
        (Story) => (
            <div className="mts-ton-jiggle">
                <Story />
            </div>
        ),
    ],
};

export const WithLiquidityProvider: Story = {
    args: {
        options: {
            liquidity_provider: 'dedust',
        },
    },
    decorators: [
        (Story) => (
            <div className="mts-ton-jiggle">
                <Story />
            </div>
        ),
    ],
};

export const HideSwapDetail: Story = {
    args: {
        options: {
            app_id: 'tonjiggle',

            ui_preferences: {
                show_swap_details: false,
                disable_provided_text: false,
            },
        },
    },
};

export const Russian: Story = {
    args: {
        locale: 'ru',
    },
};

export const Arabic: Story = {
    args: {
        locale: 'ar',
    },
};

export const Spanish: Story = {
    args: {
        locale: 'es',
    },
};

export const SimplifiedChinese: Story = {
    args: {
        locale: 'cn',
    },
};

export const Farsi: Story = {
    args: {
        locale: 'fa',
    },
};
