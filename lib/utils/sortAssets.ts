import { Asset, fromNano } from "@mytonswap/sdk";
import { TON_ADDR } from "../constants";
import { useWalletStore } from "../store/wallet.store";

export default (a: Asset, b: Asset): number => {
    const { balance } = useWalletStore.getState();

    const getTotalValue = (asset: Asset) => {
        const assetBalance = balance.get(asset.address);
        return (
            (assetBalance?.price?.prices.USD ?? 0) *
            +fromNano(
                assetBalance?.balance ?? "0",
                assetBalance?.jetton.decimals ?? 0
            )
        );
    };

    const totalValueA = getTotalValue(a);
    const totalValueB = getTotalValue(b);
    if (totalValueA !== totalValueB) {
        return totalValueB - totalValueA; // Descending order for (price * balance)
    }

    const getRawBalance = (asset: Asset) => {
        const assetBalance = balance.get(asset.address);
        return +fromNano(
            assetBalance?.balance ?? "0",
            assetBalance?.jetton.decimals ?? 0
        );
    };

    const balanceA = getRawBalance(a);
    const balanceB = getRawBalance(b);

    if (balanceA !== balanceB) {
        return balanceB - balanceA; // Descending order for balance
    }

    if (a.address === TON_ADDR) {
        return -1;
    } else if (b.address === TON_ADDR) {
        return 1;
    }

    return 0;
};
