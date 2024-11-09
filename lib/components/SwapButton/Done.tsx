import { FaArrowRightArrowLeft, FaCircleCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { fromNano } from "@mytonswap/sdk";
import formatNumber from "../../utils/formatNum";
import "./Done.scss";
import { useTranslation } from "react-i18next";
const Done = () => {
    const { t } = useTranslation();
    const { bestRoute, pay_amount, pay_token, receive_token, receive_rate } =
        useSwapStore();
    const { setModalState } = useSwapStore();
    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    return (
        <div className="done-container">
            <IoClose onClick={handleCloseModal} className=" close-icon" />
            <div className="done-icon">
                <FaCircleCheck />
            </div>
            <div className="done-text">{t("transaction.complete")}</div>
            <div className="done-modal-images">
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
            <div className="done-modal-change-rate ">
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
        </div>
    );
};

export default Done;
