import { FC, useEffect } from "react";
import Header from "../Header/Header";
import SwapCard from "../SwapCard/SwapCard";
import SwapDetails from "../SwapDetails/SwapDetails";
import clsx from "clsx";
import { ColorTheme, useThemeStore } from "../../store/theme.store";
import { TonConnectUIProvider, useTonWallet } from "@tonconnect/ui-react";
import { useOptionsStore, SwapOptions } from "../../store/options.store";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { useWalletStore } from "../../store/wallet.store";
import SwapButton from "../SwapButton/SwapButton";
import "./Swap.scss";
type SwapProps = {
    theme?: ColorTheme;
    options?: SwapOptions;
};

export const Swap: FC<SwapProps> = ({ theme, options }) => {
    const { colors, setTheme } = useThemeStore();
    const { setOptions } = useOptionsStore();
    if (theme) {
        setTheme(theme);
    }
    if (options) {
        setOptions(options);
    }
    const wallet = useTonWallet();
    const {
        setWallet,
        refetch,
        wallet: stateWallet,
        disconnect,
    } = useWalletStore();
    useEffect(() => {
        if (wallet) {
            setWallet(wallet);
        } else if (stateWallet && !wallet) {
            disconnect();
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
        <div className="mytonswap-app">
            <div
                className={clsx("container")}
                style={{
                    background: colors.background,
                    borderColor: colors.border,
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

export const TonConnectWrappedSwap: FC<SwapProps> = ({ theme, options }) => {
    return (
        <TonConnectUIProvider manifestUrl="https://mytonswap.com/wallet/manifest.json">
            <Swap theme={theme} options={options} />
        </TonConnectUIProvider>
    );
};
