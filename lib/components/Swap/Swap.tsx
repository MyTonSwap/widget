import { FC, useEffect } from "react";
import Header from "../Header/Header";
import SwapCard from "../SwapCard/SwapCard";
import SwapDetails from "../SwapDetails/SwapDetails";
import clsx from "clsx";
import { ColorTheme, useThemeStore } from "../../store/theme.store";
import { TonConnectUIProvider, useTonWallet } from "@tonconnect/ui-react";
// import { useOptionsStore } from "../../store/options.store";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { useWalletStore } from "../../store/wallet.store";
import SwapButton from "../SwapButton/SwapButton";

type SwapProps = {
    theme?: ColorTheme;
};

export const Swap: FC<SwapProps> = ({ theme }) => {
    const { colors, setTheme } = useThemeStore();
    // const { setOptions } = useOptionsStore();
    if (theme) {
        setTheme(theme);
    }
    // if (options) {
    //     setOptions(options);
    // }
    const wallet = useTonWallet();
    const { setWallet, refetch } = useWalletStore();
    useEffect(() => {
        if (wallet) {
            setWallet(wallet);
        }
    }, [setWallet, wallet]);

    const { initializeApp, receive_token, refetchBestRoute, swapModal } =
        useSwapStore();
    useEffect(() => {
        const refetchInterval = setInterval(() => {
            if (swapModal === ModalState.NONE) {
                refetch();
                refetchBestRoute();
            }
        }, 10000);
        initializeApp();
        return () => {
            clearInterval(refetchInterval);
        };
    }, []);

    return (
        <div>
            <div
                className={clsx(
                    "border-[1px]  max-w-[350px] rounded-2xl p-3 relative overflow-hidden"
                )}
                style={{
                    borderColor: colors.border,
                    background: colors.background,
                }}
            >
                <Header />
                <SwapCard />
                {receive_token && <SwapDetails />}
                <SwapButton />
            </div>
        </div>
    );
};

export const TonConnectWrappedSwap: FC<SwapProps> = ({ theme }) => {
    return (
        <TonConnectUIProvider manifestUrl="https://mytonswap.com/wallet/manifest.json">
            <Swap theme={theme} />
        </TonConnectUIProvider>
    );
};
