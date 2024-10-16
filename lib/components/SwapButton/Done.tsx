import { FaArrowRightArrowLeft, FaCircleCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useThemeStore } from "../../store/theme.store";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { fromNano } from "@mytonswap/sdk";
import formatNumber from "../../utils/formatNum";

const Done = () => {
    const { colors } = useThemeStore();
    const { bestRoute, pay_amount, pay_token, receive_token, receive_rate } =
        useSwapStore();
    const { setModalState } = useSwapStore();
    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    return (
        <div className="flex items-center justify-center flex-col h-full">
            <IoClose
                onClick={handleCloseModal}
                className=" absolute right-4 top-4 text-xl opacity-70 cursor-pointer"
            />
            <div className="w-full flex items-center justify-center text-[40px]">
                <FaCircleCheck className="" style={{ color: colors.primary }} />
            </div>
            <div className="text-xl font-bold text-center ">
                Transaction was successful
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
        </div>
    );
};

export default Done;
