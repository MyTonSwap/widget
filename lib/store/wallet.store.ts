import { create } from "zustand";
import { Balance, MyTonSwapClient } from "@mytonswap/sdk";
import { Wallet } from "@tonconnect/ui-react";
import { useSwapStore } from "./swap.store";
import catchError from "../utils/catchErrors";
import { WIDGET_VERSION } from "../constants";
import { reportErrorWithToast } from "../services/errorAnalytics";
type WalletStates = {
    client: MyTonSwapClient;
    wallet: Wallet | null;
    balance: Map<string, Balance>;
    walletConnected: boolean;
};

type WalletActions = {
    setWallet: (wallet: Wallet) => Promise<void>;
    refetch: () => void;
    disconnect: () => void;
};

export const useWalletStore = create<WalletActions & WalletStates>(
    (set, get) => ({
        client: new MyTonSwapClient({
            headers: { "widget-version": WIDGET_VERSION },
        }),
        wallet: null,
        walletConnected: false,
        balance: new Map<string, Balance>(),
        disconnect() {
            set(() => ({ wallet: null, balance: new Map() }));
        },
        async setWallet(newWallet) {
            const { client, wallet } = get();
            if (
                !newWallet ||
                (wallet && newWallet.account.address === wallet.account.address)
            )
                return;

            set(() => ({ wallet: newWallet }));
            try {
                const balancesResult = await catchError(() =>
                    client.tonapi.getWalletAssets(newWallet.account.address)
                );
                if (balancesResult.error) {
                    reportErrorWithToast(
                        balancesResult.error,
                        "Failed to fetch balances",
                        "wallet.store.ts setWallet getWalletAssets :45"
                    );
                    return;
                }
                const balances = balancesResult.data;
                set(() => ({ balance: balances }));
                const addresses = Array.from(balances.keys());
                const assetsResult = await catchError(() =>
                    client.assets.getAssets(addresses)
                );
                if (assetsResult.error) {
                    reportErrorWithToast(
                        assetsResult.error,
                        "Failed to fetch assets",
                        "wallet.store.ts setWallet getAssets :59"
                    );
                    return;
                }
                const assets = assetsResult.data;
                useSwapStore.getState().addToAssets(assets);
            } catch (error) {
                console.log(error);
            }
        },

        async refetch() {
            const { wallet, client } = get();
            if (wallet) {
                try {
                    const balancesResult = await catchError(() =>
                        client.tonapi.getWalletAssets(wallet.account.address)
                    );
                    if (balancesResult.error) {
                        reportErrorWithToast(
                            balancesResult.error,
                            "Failed to fetch balances",
                            "wallet.store.ts refetch getWalletAssets :81"
                        );
                        return;
                    }
                    const balances = balancesResult.data;
                    set(() => ({ balance: balances }));
                } catch (error) {
                    console.log(error);
                }
            }
        },
    })
);
