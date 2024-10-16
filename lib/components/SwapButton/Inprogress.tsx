import { useEffect } from "react";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { IoClose } from "react-icons/io5";
import { useThemeStore } from "../../store/theme.store";
import { fromNano } from "@mytonswap/sdk";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import formatNumber from "../../utils/formatNum";
import { ImSpinner8 } from "react-icons/im";

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
        <div className="flex items-center justify-center flex-col h-full">
            <IoClose
                onClick={handleCloseModal}
                className=" absolute right-4 top-4 text-xl opacity-70 cursor-pointer"
            />
            <div className="flex items-center pt-3">
                <div
                    className="w-14 h-14 rounded-full !bg-contain translate-x-2 border-[3px]"
                    style={{
                        background: `url(${pay_token?.image})`,
                        borderColor: colors.background,
                    }}
                ></div>
                <div
                    className="w-14 h-14 rounded-full !bg-contain -translate-x-2 border-[3px]"
                    style={{
                        background: `url(${receive_token?.image})`,
                        borderColor: colors.background,
                    }}
                ></div>
            </div>
            <div
                className="text-center font-bold opacity-70 flex items-center flex-col "
                style={{ color: colors.text_black }}
            >
                <div>
                    {fromNano(pay_amount, pay_token?.decimal)}{" "}
                    {pay_token?.symbol}
                </div>
                <div>
                    <FaArrowRightArrowLeft className="rotate-90 text-xs opacity-60" />
                </div>
                <div>
                    {bestRoute!.pool_data.receive_show!} {receive_token?.symbol}
                </div>
                <div className="text-xs opacity-60">
                    ≈{" "}
                    {formatNumber(
                        Number(bestRoute!.pool_data.receive_show) *
                            receive_rate!.USD,
                        4
                    )}
                    $
                </div>
            </div>

            <div className="text-xl font-bold text-center mt-4">
                Transaction in progress
            </div>
            <p>It may take while</p>
            <div className="w-full flex items-center justify-center  text-3xl mt-2">
                <ImSpinner8 className="animate-spin opacity-70" />
            </div>
        </div>
    );
};

export default Inprogress;
