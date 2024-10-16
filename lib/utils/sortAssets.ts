import { Asset, fromNano } from "@mytonswap/sdk";
import { TON_ADDR } from "../constants";
import { useWalletStore } from "../store/wallet.store";

export default (a: Asset, b: Asset): number => {
    const { balance } = useWalletStore.getState();

    const Balance_A = balance.get(a.address);
    const Balance_B = balance.get(b.address);
    // Sort by (price * balance) first
    const totalValueA =
        (Balance_A?.jetton.prices?.USD ?? 0) *
        +fromNano(Balance_A?.balance ?? "0", Balance_A?.jetton.decimals ?? 0);
    const totalValueB =
        (Balance_B?.jetton.prices?.USD ?? 0) *
        +fromNano(Balance_B?.balance ?? "0", Balance_B?.jetton.decimals ?? 0);

    if (totalValueA !== totalValueB) {
        return totalValueB > totalValueA ? 1 : -1; // Descending order for (price * balance)
    }

    // Sort by raw balance if total values are equal
    const balanceA = +fromNano(
        Balance_A?.balance ?? "0",
        Balance_A?.jetton.decimals ?? 0
    );
    const balanceB = +fromNano(
        Balance_B?.balance ?? "0",
        Balance_B?.jetton.decimals ?? 0
    );

    if (balanceA !== balanceB) {
        return balanceB > balanceA ? 1 : -1; // Descending order for balance
    }

    // Special case for "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c" (handle as -1)
    if (a.address === TON_ADDR) {
        return -1;
    } else if (b.address === TON_ADDR) {
        return 1;
    }

    // Sort by name (ascending order, case-insensitive) if both total value and balance are equal
    //   const nameA = a.name.toUpperCase();
    //   const nameB = b.name.toUpperCase();
    //   return nameA.localeCompare(nameB);

    return 0;
};
