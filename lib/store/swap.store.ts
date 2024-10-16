import { create } from "zustand";
import { Asset, BestRoute, MyTonSwapClient, Prices } from "@mytonswap/sdk";
import { toNano } from "@mytonswap/sdk";

export enum ModalState {
    NONE = "NONE",
    WAITING = "WAITING",
    ACCEPTED = "ACCEPTED",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    ERROR = "ERROR",
}

type SwapStates = {
    client: MyTonSwapClient;
    pay_token: Asset | null;
    receive_token: Asset | null;
    pay_rate: Prices | null;
    receive_rate: Prices | null;
    pay_amount: bigint;
    assets: Asset[] | null;
    isLoading: boolean;
    isFindingBestRoute: boolean;
    bestRoute: BestRoute | null;
    onePayRoute: BestRoute | null;
    slippage: "auto" | number;
    communityTokens: boolean;
    acceptedCommunityToken: string[];
    swapModal: ModalState;
    transactionError: string | null;
    transactionErrorBody: string | null;
    transactionHash: string | null;
};

type SwapActions = {
    setPayToken: (token: Asset) => Promise<void>;
    setReceiveToken: (token: Asset) => Promise<void>;
    initializeApp: () => void;
    setIsLoading: (isLoading: boolean) => void;
    addToAssets: (assets: Asset[]) => void;
    setPayAmount: (amount: bigint) => Promise<void>;
    setSlippage: (slippage: "auto" | number) => void;
    setCommunityTokens: (state: boolean) => void;
    addToken: (token: string) => void;
    removeToken: (token: string) => void;
    isInAgreedTokens: (token: string) => boolean;
    changeDirection: () => void;
    setModalState: (state: ModalState) => void;
    setErrorMessage: ({
        errorMessage,
        errorTitle,
    }: {
        errorMessage: string | null;
        errorTitle: string | null;
    }) => void;
    setTransactionHash: (hash: string) => void;

    refetchBestRoute: () => void;
};

export const useSwapStore = create<SwapActions & SwapStates>((set, get) => ({
    client: new MyTonSwapClient(),
    pay_token: null,
    pay_rate: null,
    pay_amount: 0n,
    receive_token: null,
    receive_rate: null,
    isLoading: true,
    isFindingBestRoute: false,
    bestRoute: null,
    onePayRoute: null,
    slippage: "auto",
    communityTokens: localStorage.getItem("mts_widget_ct") === "true",
    acceptedCommunityToken: JSON.parse(
        localStorage.getItem("mts_widget_act") ?? "[]"
    ),
    swapModal: ModalState.NONE,
    transactionError: null,
    transactionErrorBody: null,
    transactionHash: null,
    transactionBestRoute: null,
    setTransactionHash(hash) {
        set(() => ({
            transactionHash: hash,
            swapModal: ModalState.IN_PROGRESS,
        }));
    },

    setErrorMessage({ errorMessage, errorTitle }) {
        set(() => ({
            transactionError: errorTitle,
            transactionErrorBody: errorMessage,
            swapModal: ModalState.ERROR,
        }));
    },
    setModalState(state) {
        set(() => ({ swapModal: state }));
    },
    changeDirection() {
        const { receive_token, receive_rate } = get();
        if (!receive_token) return;

        set(() => ({
            pay_token: receive_token,
            pay_rate: receive_rate,
            pay_amount: 0n,
            receive_token: null,
            receive_rate: null,
            bestRoute: null,
        }));
    },
    addToken(token) {
        const { acceptedCommunityToken } = get();
        if (!acceptedCommunityToken.includes(token)) {
            const newCommunityTokens = [...acceptedCommunityToken, token];
            localStorage.setItem(
                "mts_widget_act",
                JSON.stringify(newCommunityTokens)
            );
            set(() => ({ acceptedCommunityToken: newCommunityTokens }));
        }
    },
    removeToken(token) {
        const { acceptedCommunityToken } = get();
        if (!acceptedCommunityToken.includes(token)) {
            const newCommunityTokens = acceptedCommunityToken.filter(
                (item) => item !== token
            );
            localStorage.setItem(
                "mts_widget_act",
                JSON.stringify(newCommunityTokens)
            );
            set(() => ({ acceptedCommunityToken: newCommunityTokens }));
        }
    },
    isInAgreedTokens(token) {
        const { acceptedCommunityToken } = get();
        return acceptedCommunityToken.includes(token);
    },
    setCommunityTokens(communityTokens) {
        localStorage.setItem("mts_widget_ct", String(communityTokens));
        set(() => ({ communityTokens }));
    },
    setSlippage(slippage) {
        set(() => ({ slippage }));
    },
    setIsLoading(isLoading) {
        set(() => ({ isLoading }));
    },
    setPayToken: async (token) => {
        const { client } = get();
        if (!token) return;
        const rates = await client.tonapi.getAssetsRates([token.address]);
        const tokenRate = rates.get(token.address);
        console.log(rates);
        set(() => ({
            pay_token: token,
            pay_rate: tokenRate ?? null,
            receive_rate: null,
            receive_token: null,
            bestRoute: null,
        }));
    },
    async setPayAmount(amount) {
        const { client, pay_token, receive_token, slippage } = get();
        set(() => ({ pay_amount: amount }));
        if (!pay_token || !receive_token) return;
        set(() => ({ isFindingBestRoute: true }));
        const bestRoute = await client.router.findBestRoute(
            pay_token.address,
            receive_token.address,
            amount,
            slippage === "auto" ? undefined : slippage
        );
        // TODO: Handle error properly
        if (!bestRoute) throw new Error("failed to get best route");
        set(() => ({ bestRoute, isFindingBestRoute: false }));
    },
    setReceiveToken: async (token) => {
        const { client, pay_token, pay_amount, slippage } = get();
        if (!token) return;
        const rates = await client.tonapi.getAssetsRates([token.address]);
        const tokenRate = rates.get(token.address);
        set(() => ({
            receive_token: token,
            receive_rate: tokenRate ?? null,
            isFindingBestRoute: true,
        }));
        const onePayRoute = await client.router.findBestRoute(
            pay_token!.address,
            token.address,
            toNano(1, pay_token!.decimal),
            slippage === "auto" ? undefined : slippage
        );

        if (pay_amount > 0n && pay_token) {
            set(() => ({ onePayRoute }));
            const bestRoute = await client.router.findBestRoute(
                pay_token.address,
                token.address,
                pay_amount,
                slippage === "auto" ? undefined : slippage
            );
            set(() => ({ bestRoute, isFindingBestRoute: false }));
        } else {
            set(() => ({ onePayRoute, isFindingBestRoute: false }));
        }
    },

    assets: null,
    async addToAssets(newAssets) {
        if (!newAssets) return;
        set((state) => {
            const assetMap = new Map(
                (state.assets || []).map((asset) => [asset.address, asset])
            );

            newAssets.forEach((newAsset) => {
                if (newAsset && !assetMap.has(newAsset.address)) {
                    assetMap.set(newAsset.address, newAsset);
                }
            });

            const updatedAssets = Array.from(assetMap.values());
            return { assets: updatedAssets };
        });
    },

    async initializeApp() {
        const { client } = get();
        const TON = await client.assets.getExactAsset("TON");
        if (!TON) return;
        const tonRate = await client.tonapi.getAssetsRates([TON.address]);
        set({
            pay_token: TON,
            pay_rate: tonRate.get(TON.address),
            isLoading: false,
        });
    },
    async refetchBestRoute() {
        const { pay_token, receive_token, pay_amount, slippage, client } =
            get();
        if (!pay_token || !receive_token) return;
        set(() => ({ isFindingBestRoute: true }));
        const bestRoute = await client.router.findBestRoute(
            pay_token.address,
            receive_token.address,
            pay_amount,
            slippage === "auto" ? undefined : slippage
        );
        // TODO: Handle error properly
        if (!bestRoute) throw new Error("failed to get best route");
        set(() => ({ bestRoute, isFindingBestRoute: false }));
    },
}));
