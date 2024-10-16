import { useThemeStore } from "../../store/theme.store";
import { IoMdClose } from "react-icons/io";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { fromNano } from "@mytonswap/sdk";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import SwapKeyValue from "../SwapDetails/SwapKeyValue";
import formatNumber from "../../utils/formatNum";
import swap from "../../utils/swap";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { FC } from "react";

type ConfirmationModalProps = {
    setConfirmModal: (state: boolean) => void;
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({ setConfirmModal }) => {
    const handleConfirmClose = () => {
        setConfirmModal(false);
    };
    const [tonConnect, setOptions] = useTonConnectUI();
    setOptions({
        actionsConfiguration: { modals: [] },
    });

    const { colors } = useThemeStore();
    const {
        pay_amount,
        pay_token,
        bestRoute,
        receive_token,
        receive_rate,
        slippage,
        setModalState,
    } = useSwapStore();
    const handleConfirmSwap = () => {
        swap(tonConnect, bestRoute!);
        setConfirmModal(false);
        setModalState(ModalState.WAITING);
    };
    return (
        <div className="w-full h-full flex flex-col items-center py-2">
            <div className="flex items-center justify-between w-full px-4">
                <h1
                    className="font-bold opacity-50"
                    style={{
                        color: colors.text_black,
                    }}
                >
                    Confirm the swap
                </h1>{" "}
                <IoMdClose
                    onClick={handleConfirmClose}
                    className="cursor-pointer"
                    style={{
                        color: colors.text_black,
                    }}
                />
            </div>
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
            <div className="w-full px-4 mt-2 text-sm flex flex-col gap-y-1">
                <SwapKeyValue
                    keyText="Slippage"
                    value={slippage === "auto" ? "1% Auto" : slippage + "%"}
                />
                <SwapKeyValue
                    keyText="Minimum Receive"
                    value={
                        <div className="flex gap-x-1">
                            {formatNumber(
                                bestRoute!.pool_data.minimumReceive_show,
                                4
                            )}
                            <div>{receive_token?.symbol}</div>
                        </div>
                    }
                />
                <SwapKeyValue
                    keyText="Blockchain Fee"
                    value={bestRoute!.pool_data.blockchainFee}
                />
                <SwapKeyValue
                    keyText="Route"
                    value={
                        bestRoute ? (
                            <div className="flex items-center justify-center gap-x-1">
                                {/* <span className="flex items-center justify-center gap-x-1">
                                <div
                                    className="w-3 h-3  !bg-contain"
                                    style={{
                                        background: `url(${
                                            bestRoute
                                                .selected_pool
                                                .dex ===
                                            "dedust"
                                                ? "https://dedust.io/favicon-32x32.png"
                                                : "https://ston.fi/images/tild3432-3236-4431-b139-376231383134__favicon.svg"
                                        })`,
                                    }}
                                ></div>
                                {bestRoute.selected_pool
                                    .dex === "dedust"
                                    ? "Dedust -"
                                    : "Ston.fi -"}
                            </span> */}
                                {bestRoute.pool_data.route_view.join(" > ")}
                            </div>
                        ) : (
                            "Enter amount"
                        )
                    }
                />
            </div>
            <div className="w-full px-4 mt-2">
                <button
                    onClick={handleConfirmSwap}
                    className=" h-12 rounded-xl cursor-pointer w-full"
                    style={{
                        color: colors.text_black,
                        background: colors.primary,
                    }}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
