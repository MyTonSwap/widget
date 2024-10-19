import { create } from "zustand";
import { Balance, MyTonSwapClient } from "@mytonswap/sdk";
import { Wallet } from "@tonconnect/ui-react";
import { useSwapStore } from "./swap.store";
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
                const balances = await client.tonapi.getWalletAssets(
                    newWallet.account.address
                );
                set(() => ({ balance: balances }));
                const addresses = Array.from(balances.keys());
                const assets = await client.assets.getAssets(addresses);
                useSwapStore.getState().addToAssets(assets);
            } catch (error) {
                console.log(error);
            }
        },

        async refetch() {
            const { wallet, client } = get();
            if (wallet) {
                try {
                    const balances = await client.tonapi.getWalletAssets(
                        wallet.account.address
                    );
                    set(() => ({ balance: balances }));
                } catch (error) {
                    console.log(error);
                }
            }
        },
    })
);
