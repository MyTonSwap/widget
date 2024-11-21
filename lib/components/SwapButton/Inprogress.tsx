import { useEffect } from "react";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { IoClose } from "react-icons/io5";
import { Dex, fromNano } from "@mytonswap/sdk";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import formatNumber from "../../utils/formatNum";
import { ImSpinner8 } from "react-icons/im";
import "./Inprogress.scss";
import { useEventsStore } from "../../store/events.store";
import { useTranslation } from "react-i18next";
import { sendTransaction } from "../../services/transaction";
const Inprogress = () => {
    const { t } = useTranslation();
    const {
        transactionHash,
        client,
        setModalState,
        setErrorMessage,
        pay_amount,
        pay_token,
        receive_token,
        bestRoute,
        receive_rate,
        pay_rate,
        transactionQueryId,
    } = useSwapStore();
    const { onSwap } = useEventsStore();
    useEffect(() => {
        const checkForTransaction = async () => {
            if (transactionHash) {
                const event = await client.tonapi.waitForTransactionResult(
                    transactionHash,
                    10000
                );
                if (event) {
                    onSwap({
                        type: "success",
                        data: {
                            pay: pay_token!,
                            receive: receive_token!,
                            pay_amount: pay_amount.toString(),
                            receive_amount:
                                bestRoute!.pool_data.receive_show!.toString(),
                            pay_rate: pay_rate?.USD ?? 0,
                            receive_rate: receive_rate?.USD ?? 0,
                            dex: bestRoute!.selected_pool.dex as Dex,
                            hash: transactionHash,
                        },
                    });
                    setModalState(ModalState.DONE);
                } else {
                    onSwap({
                        type: "error",
                        data: {
                            pay: pay_token!,
                            receive: receive_token!,
                            pay_amount: pay_amount.toString(),
                            receive_amount:
                                bestRoute!.pool_data.receive_show!.toString(),
                            pay_rate: pay_rate!.USD,
                            receive_rate: receive_rate!.USD,
                            dex: bestRoute!.selected_pool.dex as Dex,
                            hash: transactionHash,
                        },
                    });
                    sendTransaction({
                        hash: transactionHash,
                        query_id: transactionQueryId!,
                    });
                    setErrorMessage({
                        errorTitle: t("errors.transaction_failed"),
                        errorMessage: t("errors.unknown_error"),
                    });
                }
            }
        };
        checkForTransaction();
    }, []);
    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };

    return (
        <div className="inprogress-container">
            <IoClose onClick={handleCloseModal} className=" close-button" />
            <div className="inprogress-modal-images">
                <div
                    className="pay-image"
                    style={{
                        background: `url(${pay_token?.image})`,
                    }}
                ></div>
                <div
                    className="receive-image"
                    style={{
                        background: `url(${receive_token?.image})`,
                    }}
                ></div>
            </div>
            <div className="inprogress-modal-change-rate ">
                <div>
                    {fromNano(pay_amount, pay_token?.decimal)}{" "}
                    {pay_token?.symbol}
                </div>
                <div>
                    <FaArrowRightArrowLeft className="change-icon" />
                </div>
                <div>
                    {bestRoute!.pool_data.receive_show!} {receive_token?.symbol}
                </div>
                <div className="rate">
                    ≈{" "}
                    {formatNumber(
                        Number(bestRoute!.pool_data.receive_show) *
                            receive_rate!.USD,
                        4
                    )}
                    $
                </div>
            </div>

            <div className="description">{t("transaction.pending")}</div>
            <p className="description-2">
                {t("transaction.action_in_progress")}
            </p>
            <div className="loading-icon">
                <ImSpinner8 className="animate-spin icon" />
            </div>
        </div>
    );
};

export default Inprogress;
