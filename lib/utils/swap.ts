import { BestRoute, MyTonSwapClient } from "@mytonswap/sdk";
import { beginCell, Cell } from "@ton/ton";

import {
    SendTransactionRequest,
    TonConnectUI,
    UserRejectsError,
} from "@tonconnect/ui-react";
import { useSwapStore } from "../store/swap.store";
import catchError from "./catchErrors";
import { useOptionsStore } from "../store/options.store";
import { WIDGET_VERSION } from "../constants";

export default async function swap(
    tonconnect: TonConnectUI,
    bestRoute: BestRoute
) {
    const client = new MyTonSwapClient({
        headers: { "widget-version": WIDGET_VERSION },
    });
    const app_id = useOptionsStore.getState().options.app_id;
    const rawMessageResult = await catchError(() =>
        client.swap.createSwap(tonconnect.account!.address, bestRoute, app_id)
    );
    if (rawMessageResult.error) return console.log("make this alert!");
    const rawMessage = rawMessageResult.data;
    if (!rawMessage) return;

    let stateInit: undefined | string = undefined;
    if (rawMessage.init) {
        const code = Cell.fromBoc(Buffer.from(rawMessage.init.code, "hex"))[0];
        const data = Cell.fromBoc(Buffer.from(rawMessage.init.data, "hex"))[0];
        stateInit = beginCell()
            .storeRef(code)
            .storeRef(data)
            .endCell()
            .toBoc()
            .toString("base64");
    }
    const messages = [
        {
            address: rawMessage.to,
            amount: rawMessage.value,
            stateInit: stateInit,
            payload: Cell.fromBoc(Buffer.from(rawMessage.body, "hex"))[0]
                .toBoc()
                .toString("base64"),
        },
    ] satisfies SendTransactionRequest["messages"];
    tonconnect
        .sendTransaction({
            messages: messages,
            validUntil: Date.now() + 1000 * 60 * 60 * 24,
        })
        .then((result) => {
            const cell = Cell.fromBoc(Buffer.from(result.boc, "base64"))[0];
            const stateInstance = useSwapStore.getState();
            stateInstance.setTransactionHash(cell.hash().toString("base64"));
        })
        .catch((e) => {
            console.log(e);
            const stateInstance = useSwapStore.getState();
            if (e instanceof UserRejectsError) {
                stateInstance.setErrorMessage({
                    errorTitle: "Transaction Canceled!",
                    errorMessage:
                        "You have canceled the transaction. There will be no changes to your account.",
                });
            } else {
                stateInstance.setErrorMessage({
                    errorTitle: "Transaction Failed!",
                    errorMessage:
                        "Something went wrong. Please try again later. If the problem persists, please contact us.",
                });
            }
        });
}
