import { useEffect } from "react";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { IoClose } from "react-icons/io5";
import { useThemeStore } from "../../store/theme.store";
import { fromNano } from "@mytonswap/sdk";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import formatNumber from "../../utils/formatNum";
import { ImSpinner8 } from "react-icons/im";
import "./Inprogress.scss";
const Inprogress = () => {
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
    } = useSwapStore();
    const { colors } = useThemeStore();
    useEffect(() => {
        const checkForTransaction = async () => {
            console.log("runned");
            if (transactionHash) {
                const event = await client.tonapi.waitForTransactionResult(
                    transactionHash,
                    10000
                );
                if (event) {
                    setModalState(ModalState.DONE);
                } else {
                    setErrorMessage({
                        errorTitle: "Transaction Failed!",
                        errorMessage:
                            "Something went wrong. Please try again later. If the problem persists, please contact us.",
                    });
                }
            }
        };
        checkForTransaction();
    }, []);
    const handleCloseModal = () => {
        setModalState(ModalState.DONE);
    };

    return (
        <div className="inprogress-container">
            <IoClose onClick={handleCloseModal} className=" close-button" />
            <div className="inprogress-modal-images">
                <div
                    className="pay-image"
                    style={{
                        background: `url(${pay_token?.image})`,
                        borderColor: colors.background,
                    }}
                ></div>
                <div
                    className="receive-image"
                    style={{
                        background: `url(${receive_token?.image})`,
                        borderColor: colors.background,
                    }}
                ></div>
            </div>
            <div
                className="inprogress-modal-change-rate "
                style={{ color: colors.text_black }}
            >
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

            <div className="description">Transaction in progress</div>
            <p>It may take while</p>
            <div className="loading-icon">
                <ImSpinner8 className="animate-spin icon" />
            </div>
        </div>
    );
};

export default Inprogress;
