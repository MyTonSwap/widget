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

export type ColorTheme = {
    primary?: string;
    border?: string;
    background?: string;
    light_shade?: string;
    input_token?: string;
    input_card?: string;
    slippage_box?: string;
    text_black?: string;
    text_white?: string;
    text_fade?: string;
    skeleton_shine?: string;
    price_impact?: string;
};

type ThemeStates = {
    colors: ColorTheme;
    userTheme: ColorTheme;
};

type ThemeActions = {
    setTheme: (colors: ColorTheme) => void;
};

export const useThemeStore = create<ThemeActions & ThemeStates>((set, get) => ({
    colors: {
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
        skeleton_shine: "#9c9c9c",
        price_impact: "#E64646",
    },
    userTheme: {},
    setTheme: (theme) => {
        const { colors, userTheme } = get();
        if (JSON.stringify(theme) === JSON.stringify(userTheme)) return;
        const newSchema = defaultsDeep(theme, colors) satisfies ColorTheme;
        set({ colors: newSchema, userTheme: theme });
    },
}));

export const setTheme = (theme: ColorTheme) => {
    useThemeStore.getState().setTheme(theme);
};
