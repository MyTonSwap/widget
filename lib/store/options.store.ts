import { create } from "zustand";
import { defaultsDeep } from "lodash";
// {
//     "50": "#fafafa",
//     "100": "#f4f4f5",
//     "200": "#e4e4e7",
//     "300": "#d4d4d8",
//     "400": "#a1a1aa",
//     "500": "#71717a",
//     "600": "#52525b",
//     "700": "#3f3f46",
//     "800": "#27272a",
//     "900": "#18181b",
//     "950": "#09090b"
//   }

export type SwapOptions = {
    showAddress?: boolean;
};

type SwapOptionsStates = {
    options: SwapOptions;
    userOptions: SwapOptions;
};

type SwapOptionsActions = {
    setOptions: (colors: SwapOptions) => void;
};

export const useOptionsStore = create<SwapOptionsActions & SwapOptionsStates>(
    (set, get) => ({
        options: {},
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
