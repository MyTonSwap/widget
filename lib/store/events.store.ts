import { Asset } from "@mytonswap/sdk";
import { create } from "zustand";

export type onSwap = {
    type: "start" | "success" | "error";
    data: {
        pay: Asset;
        receive: Asset;
        pay_amount: string;
        receive_amount: string;
        pay_rate: number;
        receive_rate: number;
        dex: "stonfi" | "dedust";
        hash: string;
    };
};

export type onTokenSelect = {
    type: "pay" | "receive";
    asset: Asset;
};

type EventsActions = {
    onTokenSelect: (data: onTokenSelect) => void;
    onSwap: (data: onSwap) => void;
    setOnTokenSelect: (onTokenSelect: (data: onTokenSelect) => void) => void;
    setOnSwap: (onSwap: (data: onSwap) => void) => void;
};

export const useEventsStore = create<EventsActions>((set) => ({
    onTokenSelect: (data) => {
        console.log("default onTokenSelect called");
        console.log(data);
    },
    onSwap: (data) => {
        console.log("default onSwap called");
        console.log(data);
    },
    setOnTokenSelect: (onTokenSelect) => {
        set({ onTokenSelect });
    },
    setOnSwap: (onSwap) => {
        set({ onSwap });
    },
}));
