import { BestRoute, MyTonSwapClient } from "@mytonswap/sdk";
import { beginCell, Cell } from "@ton/ton";

import {
    SendTransactionRequest,
    TonConnectUI,
    UserRejectsError,
} from "@tonconnect/ui-react";
import { useSwapStore } from "../store/swap.store";

export default async function swap(
    tonconnect: TonConnectUI,
    bestRoute: BestRoute
) {
    const client = new MyTonSwapClient();
    const rawMessage = await client.swap.createSwap(
        tonconnect.account!.address,
        bestRoute
    );
    if (!rawMessage) return;
    const stateInit = rawMessage.init
        ? beginCell()
              .storeRef(rawMessage.init.code!)
              .storeRef(rawMessage.init.data!)
              .endCell()
              .toBoc()
              .toString("base64")
        : undefined;
    const messages = [
        {
            address: rawMessage.to.toString(),
            amount: rawMessage.value.toString(),
            stateInit: stateInit,
            payload: rawMessage.body?.toBoc().toString("base64"),
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
