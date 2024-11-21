import axios from "axios";
import { WIDGET_VERSION } from "../constants";
import toast from "react-hot-toast";
import { useSwapStore } from "../store/swap.store";
import { useWalletStore } from "../store/wallet.store";
import { httpClient } from "./httpClient";

interface ErrorReportBody {
    section: string;
    error: string;
    distinct_id: string;
    version: string;
}

async function sendErrorReport(body: ErrorReportBody): Promise<void> {
    try {
        await httpClient.post("/stats/error", body);
        console.log("Error reported successfully");
    } catch (reportingError) {
        console.error("Failed to report error:", reportingError);
    }
}

export async function reportError(message: string): Promise<void> {
    const {
        onePayRoute,
        pay_token,
        pay_rate,
        pay_amount,
        receive_token,
        receive_rate,
        bestRoute,
        slippage,
        swapModal,
        transactionHash,
    } = useSwapStore.getState();
    const swapStateDump = JSON.stringify(
        {
            onePayRoute,
            pay_token,
            pay_rate,
            pay_amount: pay_amount.toString(),
            receive_token,
            receive_rate,
            bestRoute,
            slippage,
            swapModal,
            transactionHash,
        },
        null,
        2
    );
    const { wallet, balance } = useWalletStore.getState();
    const walletStateDump = JSON.stringify(
        {
            wallet,
            balance: Object.fromEntries(balance),
        },
        null,
        2
    );
    message += `\n\n[SWAP STATE]: ${swapStateDump}\n[WALLET STATE]: ${walletStateDump}`;
    const body: ErrorReportBody = {
        section: "widget",
        error: message,
        distinct_id: "cdef4d5a-8f43-4f82-be21-52a0ed1fa5e7",
        version: WIDGET_VERSION,
    };
    await sendErrorReport(body);
}

export function reportErrorWithToast(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    message: string,
    location: string
): string {
    const errorcode = location.split(":")[1];
    if (axios.isAxiosError(error)) {
        if (error.response) {
            reportError(
                `Message: ${message}\nError Code: 002\nLocation: ${location}\nReason: ${JSON.stringify(
                    error.response.data
                )}\n${error}\n${error.cause}\n${error.code}`
            );
            return toast.error(`${message} E${errorcode}`);
        }
    }

    if (axios.isCancel(error) || !axios.isAxiosError(error)) {
        reportError(
            `Message: Failed to fetch assets\nError Code: 001\nLocation: ${location}\nReason: ${error.message}\nTrace: ${error.stack}`
        );
        return toast.error(`${message} E${errorcode}`);
    }

    reportError(
        `Message: Failed to fetch assets\nError Code: 001\nLocation: ${location}\nReason: ${error.message}\nTrace: ${error.stack}`
    );
    return toast.error(`${message} E${errorcode}`);
}
