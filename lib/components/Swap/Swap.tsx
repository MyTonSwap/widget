import { FC, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import SwapCard from '../SwapCard/SwapCard';
import SwapDetails from '../SwapDetails/SwapDetails';
import clsx from 'clsx';
import { TonConnectUI } from '@tonconnect/ui-react';
import { useOptionsStore, SwapOptions } from '../../store/options.store';
import { useSwapStore } from '../../store/swap.store';
import { useWalletStore } from '../../store/wallet.store';
import SwapButton from '../SwapButton/SwapButton';
import './Swap.scss';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import '../../i18n/i18n';
import {
    onSwap,
    onTokenSelect,
    useEventsStore,
} from '../../store/events.store';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { supportedLanguages } from '../../i18n/i18n';

export type SwapProps = {
    options?: SwapOptions;
    locale?: string;
    tonConnectInstance: TonConnectUI;
    onTokenSelect?: ({ type, asset }: onTokenSelect) => void;
    onSwap?: ({ type, data }: onSwap) => void;
};

// declare telegram in window
interface NewWindow extends Window {
    Telegram?: {
        WebApp: {
            initData: string;
        };
    };
}

import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: 'https://a0fd184abe72bfb85e2b0f8dd3f339ce@o4508426959257600.ingest.de.sentry.io/4508427069620304',
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: [
        'localhost',
        /^https:\/\/app\.mytonswap\.com\/api/,
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

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
        if (!locale && i18n.resolvedLanguage !== 'en') {
            i18n.changeLanguage('en');
        }
    }
    const direction = i18n.getResourceBundle(
        i18n.resolvedLanguage!,
        'direction'
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

        pay_token,
    } = useSwapStore();

    const isInitMount = useRef(true);

    useEffect(() => {
        if (isInitMount) {
            if (!pay_token) {
                initializeApp();
            }
            if (
                (window as NewWindow)?.Telegram?.WebApp?.initData?.length !== 0
            ) {
                ensureDocumentIsScrollable();
            }
            function ensureDocumentIsScrollable() {
                const isScrollable =
                    document.documentElement.scrollHeight > window.innerHeight;

                if (!isScrollable) {
                    document.documentElement.style.setProperty(
                        'height',
                        'calc(100vh + 1px)',
                        'important'
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
        }
    }, []);

    const shouldShowSwapDetails =
        receive_token && appOptions?.ui_preferences?.show_swap_details;
    const shouldShowProvidedText =
        !appOptions?.ui_preferences?.disable_provided_text;

    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <div
                className={cn(
                    'mytonswap-app',
                    direction,
                    options?.ui_preferences?.theme === 'light'
                        ? 'mts-light'
                        : 'mts-dark'
                )}
            >
                <div
                    className={clsx(
                        'mts-rounded-lg  mts-max-w-[21.875rem] mts-overflow-hidden md:mts-p-3 md:mts-w-[28.125rem] md:mts-max-w-[28.125rem] lg:mts-w-[calc(34.375rem+24px)] lg:mts-max-w-[calc(34.375rem+24px)]'
                    )}
                >
                    <Header />
                    <SwapCard />
                    <SwapButton />
                    {shouldShowSwapDetails && <SwapDetails />}
                    {shouldShowProvidedText && (
                        <div className="mts-mt-2 mts-mb-1 mts-w-full mts-text-black dark:mts-text-white mts-text-[10px] mts-text-center">
                            {t('service_provided')}{' '}
                            <a
                                href="https://mytonswap.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('mytonswap')}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <Toaster
                toastOptions={{
                    style: {
                        background: `rgb(var(--mts-primary-950))`,
                        color: `white`,
                    },
                }}
            />
        </ErrorBoundary>
    );
};

export const Swap: FC<SwapProps> = ({ ...restProps }) => {
    return <SwapComponent {...restProps} />;
};
