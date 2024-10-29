import clsx from "clsx";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import SwapKeyValue from "./SwapKeyValue";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
import formatNumber from "../../utils/formatNum";
import { CgSpinnerTwo } from "react-icons/cg";
import "./SwapDetails.scss";
const SwapDetails = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { onePayRoute, bestRoute, isFindingBestRoute, slippage } =
        useSwapStore();
    const { colors } = useThemeStore();
    return (
        <motion.button
            initial={{ height: 50 }}
            animate={{ height: isOpen ? 158 : 50 }}
            className="detail-accordion-container"
            style={{
                borderColor: colors.border,
                color: colors.text_black,
            }}
            onClick={() => {
                setIsOpen((prev) => !prev);
            }}
            data-testid="swap-details"
        >
            <div className="detail-accordion">
                {onePayRoute && onePayRoute.pool_data && !isFindingBestRoute ? (
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
                    <div className="finding">
                        <CgSpinnerTwo
                            className="animate-spin"
                            style={{ color: colors.primary }}
                        />
                        Fetching best route
                    </div>
                )}
                <div>
                    <MdKeyboardArrowDown
                        className={clsx("icon", isOpen ? "is-open" : "")}
                    />
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.05 } }}
                        exit={{ opacity: 0 }}
                        className="detail-accordion-content"
                    >
                        <SwapKeyValue
                            keyText={"Slippage tolerance"}
                            value={
                                <div
                                    className="slippage-box"
                                    style={{
                                        background: colors.slippage_box,
                                        color: colors.text_white,
                                    }}
                                >
                                    {slippage === "auto" ? "1" : slippage}%{" "}
                                    {slippage === "auto" ? "Auto" : ""}
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
                                <span data-testid="price-impact">
                                    {bestRoute
                                        ? bestRoute.pool_data.priceImpact + "%"
                                        : "0%"}
                                </span>
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
                                    <div className="route-container">
                                        <span
                                            className="dex"
                                            data-testid="dex-container"
                                        >
                                            <div
                                                className="image"
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
                                        {bestRoute?.pool_data?.route_view.join(
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
