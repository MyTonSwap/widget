import axios from "axios";
import { WIDGET_VERSION } from "../constants";
import toast from "react-hot-toast";

const ERROR_REPORTING_ENDPOINT = "https://app.mytonswap.com/api/stats/error";

interface ErrorReportBody {
    section: string;
    error: string;
    distinct_id: string;
    version: string;
}

async function sendErrorReport(body: ErrorReportBody): Promise<void> {
    try {
        await axios.post(ERROR_REPORTING_ENDPOINT, body);
        console.log("Error reported successfully");
    } catch (reportingError) {
        console.error("Failed to report error:", reportingError);
    }
}

export async function reportError(message: string): Promise<void> {
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
                )}\n${error}\n${error.cause}\n${error.code}\n${error.stack} `
            );
            return toast.error(`${message} E${errorcode}`);
        }
    }

    if (axios.isCancel(error) || !axios.isAxiosError(error)) {
        reportError(
            `Message: Failed to fetch assets\nError Code: 001\nLocation: ${location}\nReason: ${error.message}\n${error.stack}`
        );
        return toast.error(`${message}} E${errorcode}`);
    }

    reportError(
        `Message: Failed to fetch assets\nError Code: 001\nLocation: ${location}\nReason: ${error.message}\n${error.stack}`
    );
    return toast.error(`${message}} E${errorcode}`);
}
