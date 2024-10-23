import { create } from "zustand";
import { defaultsDeep } from "lodash";

export type SwapOptions = {
    default_pay_token?: string;
    default_receive_token?: string;
    pin_tokens?: string[];
    app_id?: string;
    ui_preferences?: {
        disable_provided_text?: boolean;
    };
};

type SwapOptionsStates = {
    options: SwapOptions;
    userOptions: SwapOptions;
};

type SwapOptionsActions = {
    setOptions: (options: SwapOptions) => void;
};

export const useOptionsStore = create<SwapOptionsActions & SwapOptionsStates>(
    (set, get) => ({
        options: {
            ui_preferences: {
                disable_provided_text: false,
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
        },
    })
);
