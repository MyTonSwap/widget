import clsx from "clsx";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import SwapKeyValue from "./SwapKeyValue";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
import formatNumber from "../../utils/formatNum";
import { CgSpinnerTwo } from "react-icons/cg";

const SwapDetails = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { onePayRoute, bestRoute, isFindingBestRoute } = useSwapStore();
    const { colors } = useThemeStore();
    return (
        <motion.button
            initial={{ height: 50 }}
            animate={{ height: isOpen ? 158 : 50 }}
            className="border-[1px] w-full min-h-12 mt-3 rounded-xl flex flex-col items-center px-3 text-xs "
            style={{
                borderColor: colors.border,
                color: colors.text_black,
            }}
            onClick={() => {
                setIsOpen((prev) => !prev);
            }}
        >
            <div className=" flex items-center justify-between w-full min-h-12">
                {onePayRoute && !isFindingBestRoute ? (
                    <div>
                        1 {onePayRoute.pool_data.route_view[0]} ≈{" "}
                        {formatNumber(onePayRoute.pool_data.receive_show, 4)}{" "}
                        {
                            onePayRoute.pool_data.route_view[
                                onePayRoute.pool_data.route_view.length - 1
                            ]
                        }
                    </div>
                ) : (
                    <div className="flex items-center gap-x-1 ">
                        <CgSpinnerTwo
                            className="animate-spin"
                            style={{ color: colors.primary }}
                        />
                        Fetching best route
                    </div>
                )}
                <div className="text-sm">
                    <MdKeyboardArrowDown
                        className={clsx(
                            "text-lg transition-all",
                            isOpen ? "rotate-180" : ""
                        )}
                    />
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.05 } }}
                        exit={{ opacity: 0 }}
                        className="w-full flex flex-col gap-y-1 mb-3"
                    >
                        <SwapKeyValue
                            keyText={"Slippage tolerance"}
                            value={
                                <div
                                    className="rounded-md px-1 text-white"
                                    style={{
                                        background: colors.slippage_box,
                                        color: colors.text_white,
                                    }}
                                >
                                    1% Auto
                                </div>
                            }
                        />
                        <SwapKeyValue
                            keyText={"Blockchain fee"}
                            value={
                                bestRoute?.pool_data.blockchainFee ?? "0 TON"
                            }
                        />
                        <SwapKeyValue
                            keyText={"Price impact"}
                            value={
                                bestRoute
                                    ? bestRoute.pool_data.priceImpact + "%"
                                    : "0%"
                            }
                        />
                        <SwapKeyValue
                            keyText={"Minimum Receive"}
                            value={
                                bestRoute?.pool_data.minimumReceive_show ?? "0"
                            }
                        />
                        <SwapKeyValue
                            keyText={"Route"}
                            value={
                                bestRoute ? (
                                    <div className="flex items-center justify-center gap-x-1">
                                        <span className="flex items-center justify-center gap-x-1">
                                            <div
                                                className="w-3 h-3 bg-red-500  !bg-contain"
                                                style={{
                                                    background: `url(${
                                                        bestRoute.selected_pool
                                                            .dex === "dedust"
                                                            ? "https://dedust.io/favicon-32x32.png"
                                                            : "https://ston.fi/images/tild3432-3236-4431-b139-376231383134__favicon.svg"
                                                    })`,
                                                }}
                                            ></div>
                                            {bestRoute.selected_pool.dex ===
                                            "dedust"
                                                ? "Dedust -"
                                                : "Ston.fi -"}
                                        </span>
                                        {bestRoute.pool_data.route_view.join(
                                            " > "
                                        )}
                                    </div>
                                ) : (
                                    "Enter amount"
                                )
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default SwapDetails;
