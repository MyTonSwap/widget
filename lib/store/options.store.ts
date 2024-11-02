import { create } from "zustand";
import { defaultsDeep } from "lodash";
import { TonConnectUI } from "@tonconnect/ui-react";
import { useSwapStore } from "./swap.store";

export type SwapOptions = {
    default_pay_token?: string;
    default_receive_token?: string;
    default_slippage?: number;
    lock_pay_token?: boolean;
    lock_receive_token?: boolean;
    lock_input?: boolean;
    default_pay_amount?: string;
    pin_tokens?: string[];
    app_id?: string;
    ui_preferences?: {
        disable_provided_text?: boolean;
        show_swap_details?: boolean;
        show_settings_wallet?: boolean;
        show_settings_slippage?: boolean;
        show_settings_community?: boolean;
        show_change_direction?: boolean;
        show_settings?: boolean;
    };
};

type SwapOptionsStates = {
    options: SwapOptions;
    userOptions: SwapOptions;
    tonConnectInstance: TonConnectUI | null;
};

type SwapOptionsActions = {
    setOptions: (options: SwapOptions) => void;
    setTonConnectInstance: (instance: TonConnectUI) => void;
};

export const useOptionsStore = create<SwapOptionsActions & SwapOptionsStates>(
    (set, get) => ({
        tonConnectInstance: null,
        options: {
            ui_preferences: {
                disable_provided_text: false,
                disable_token_select_pay: false,
                disable_token_select_receive: false,
                show_swap_details: true,
                show_settings_wallet: true,
                show_settings_slippage: true,
                show_settings_community: true,
                show_change_direction: true,
                show_settings: true,
            },
        },
        userOptions: {},
        setOptions: (option) => {
            const { options, userOptions } = get();
            if (JSON.stringify(option) === JSON.stringify(userOptions)) return;
            const newSchema = defaultsDeep(
                option,
                options
            ) satisfies SwapOptions;

            set({ options: newSchema, userOptions: option });
            if (option.default_slippage) {
                useSwapStore.getState().setSlippage(option.default_slippage);
            }
        },
        setTonConnectInstance: (instance) => {
            if (get().tonConnectInstance) return;
            set({ tonConnectInstance: instance });
        },
    })
);
