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
import { reportErrorWithToast } from "../services/errorAnalytics";
import i18n from "../i18n/i18n";
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
    if (rawMessageResult.error) {
        reportErrorWithToast(
            rawMessageResult.error,
            "Failed to get swap data",
            "swap.ts swap createSwap :30"
        );
        return;
    }
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
            stateInstance.setTransactionHash(cell.hash().toString("hex"));
        })
        .catch((e) => {
            console.log(e);
            const stateInstance = useSwapStore.getState();
            if (e instanceof UserRejectsError) {
                stateInstance.setErrorMessage({
                    errorTitle: i18n.t("errors.transaction_canceled"),
                    errorMessage: i18n.t("errors.transaction_canceled_by_user"),
                });
            } else {
                stateInstance.setErrorMessage({
                    errorTitle: i18n.t("errors.transaction_failed"),
                    errorMessage: i18n.t("errors.unknown_error"),
                });
            }
        });
}
