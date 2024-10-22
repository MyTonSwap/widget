import { create } from "zustand";
import { Balance, MyTonSwapClient } from "@mytonswap/sdk";
import { Wallet } from "@tonconnect/ui-react";
import { useSwapStore } from "./swap.store";
import catchError from "../utils/catchErrors";
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
        client: new MyTonSwapClient(),
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
                if (balancesResult.error)
                    return console.log("make this alert!");
                const balances = balancesResult.data;
                set(() => ({ balance: balances }));
                const addresses = Array.from(balances.keys());
                const assetsResult = await catchError(() =>
                    client.assets.getAssets(addresses)
                );
                if (assetsResult.error) return console.log("make this alert!");
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
                    if (balancesResult.error)
                        return console.log("make this alert!");
                    const balances = balancesResult.data;
                    set(() => ({ balance: balances }));
                } catch (error) {
                    console.log(error);
                }
            }
        },
    })
);
