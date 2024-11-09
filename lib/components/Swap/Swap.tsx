import { FC, useEffect, useRef } from "react";
import Header from "../Header/Header";
import SwapCard from "../SwapCard/SwapCard";
import SwapDetails from "../SwapDetails/SwapDetails";
import clsx from "clsx";
import { TonConnectUI } from "@tonconnect/ui-react";
import { useOptionsStore, SwapOptions } from "../../store/options.store";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { useWalletStore } from "../../store/wallet.store";
import SwapButton from "../SwapButton/SwapButton";
import "./Swap.scss";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import "../../i18n/i18n";
import {
    onSwap,
    onTokenSelect,
    useEventsStore,
} from "../../store/events.store";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { supportedLanguages } from "../../i18n/i18n";

export type SwapProps = {
    options?: SwapOptions;
    locale?: string;
    tonConnectInstance: TonConnectUI;
    onTokenSelect?: ({ type, asset }: onTokenSelect) => void;
    onSwap?: ({ type, data }: onSwap) => void;
};

// declare telegram in window
declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
            };
        };
    }
}

export const SwapComponent: FC<SwapProps> = ({
    options,
    locale,
    tonConnectInstance,
    onTokenSelect,
    onSwap,
}) => {
    const { t, i18n } = useTranslation();
    if (
        locale &&
        i18n.resolvedLanguage !== locale &&
        supportedLanguages.includes(locale as supportedLanguages)
    ) {
        i18n.changeLanguage(locale);
    } else {
        if (!locale && i18n.resolvedLanguage !== "en") {
            i18n.changeLanguage("en");
        }
    }
    const direction = i18n.getResourceBundle(
        i18n.resolvedLanguage!,
        "direction"
    );
    const {
        setOptions,
        setTonConnectInstance,
        options: appOptions,
    } = useOptionsStore();

    if (tonConnectInstance) {
        setTonConnectInstance(tonConnectInstance);
    }
    if (options) {
        setOptions(options);
    }
    const {
        setWallet,
        refetch,
        wallet: stateWallet,
        disconnect,
    } = useWalletStore();
    useEffect(() => {
        tonConnectInstance.onStatusChange((wallet) => {
            if (wallet) {
                setWallet(wallet);
            } else if (stateWallet && !wallet) {
                disconnect();
            }
        });
        if (tonConnectInstance.wallet) {
            setWallet(tonConnectInstance.wallet);
        } else if (stateWallet && !tonConnectInstance.wallet) {
            disconnect();
        }
    }, [tonConnectInstance]);

    const { setOnTokenSelect, setOnSwap } = useEventsStore();
    const {
        initializeApp,
        receive_token,
        refetchBestRoute,
        swapModal,
        pay_token,
    } = useSwapStore();

    const isInitMount = useRef(true);

    useEffect(() => {
        if (isInitMount) {
            let refetchInterval: ReturnType<typeof setInterval>;
            if (!pay_token) {
                initializeApp();
                refetchInterval = setInterval(() => {
                    if (swapModal === ModalState.NONE) {
                        refetch();
                        refetchBestRoute();
                    }
                }, 10000);
            }
            if (window?.Telegram?.WebApp?.initData?.length !== 0) {
                ensureDocumentIsScrollable();
            }
            function ensureDocumentIsScrollable() {
                const isScrollable =
                    document.documentElement.scrollHeight > window.innerHeight;

                if (!isScrollable) {
                    document.documentElement.style.setProperty(
                        "height",
                        "calc(100vh + 1px)",
                        "important"
                    );
                }
            }
            if (onTokenSelect) {
                setOnTokenSelect(onTokenSelect);
            }
            if (onSwap) {
                setOnSwap(onSwap);
            }
            isInitMount.current = false;
            return () => {
                clearInterval(refetchInterval);
            };
        }
    }, []);

    const shouldShowSwapDetails =
        receive_token && appOptions?.ui_preferences?.show_swap_details;
    const shouldShowProvidedText =
        !appOptions?.ui_preferences?.disable_provided_text;

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <div className={cn("mytonswap-app", direction)}>
                <div className={clsx("container")}>
                    <Header />
                    <SwapCard />
                    {shouldShowSwapDetails && <SwapDetails />}
                    <SwapButton />
                    {shouldShowProvidedText && (
                        <div className="text-provided">
                            {t("service_provided")}{" "}
                            <a
                                href="https://mytonswap.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t("mytonswap")}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <Toaster
                toastOptions={{
                    style: {
                        background: `var(--background-color)`,
                        color: `var(--text-black-color)`,
                    },
                }}
            />
        </ErrorBoundary>
    );
};

export const Swap: FC<SwapProps> = ({ ...restProps }) => {
    return <SwapComponent {...restProps} />;
};
