import { Swap, SwapProps } from "./Swap/Swap";
import { createRoot } from "react-dom/client";
import WalletProfile, {
    WalletProfileProps,
} from "./WalletProfile/WalletProfile";
import i18n from "../i18n/i18n";

declare global {
    interface Window {
        createSwap: (elementId: string, options: SwapProps) => void;
        createWalletProfile: (
            elementId: string,
            options: WalletProfileProps
        ) => void;
    }
}

export const createSwap = (elementId: string, options: SwapProps) => {
    i18n.changeLanguage(options.locale || "en");
    const root = document.getElementById(elementId);
    if (!root) throw new Error("Element does not exist");
    createRoot(root).render(<Swap {...options} />);
};

export const createWalletProfile = (
    elementId: string,
    options: WalletProfileProps
) => {
    const root = document.getElementById(elementId);
    if (!root) throw new Error("Element does not exist");
    createRoot(root).render(<WalletProfile {...options} />);
};

if (window) {
    window.createSwap = createSwap;
    window.createWalletProfile = createWalletProfile;
}
