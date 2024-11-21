import { httpClient } from "./httpClient";

type Transaction = {
    query_id: string;
    hash: string;
};

export const sendTransaction = async (transaction: Transaction) => {
    try {
        await httpClient.post("/v2/routes/boc/confirm", transaction);
        console.log("Transaction reported successfully");
    } catch (reportingError) {
        console.error("Failed to report transaction:", reportingError);
    }
};
