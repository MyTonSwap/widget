import clsx from "clsx";
import { FC, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import SwapKeyValue from "./SwapKeyValue";
import { AnimatePresence, motion } from "framer-motion";
import { useSwapStore } from "../../store/swap.store";
import formatNumber from "../../utils/formatNum";
import { CgSpinnerTwo } from "react-icons/cg";
import "./SwapDetails.scss";
import { useTranslation } from "react-i18next";
import { useMeasure } from "@uidotdev/usehooks";
import { BsArrowRightShort, BsChevronRight } from "react-icons/bs";

const SwapDetails = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { onePayRoute, bestRoute, isFindingBestRoute, slippage } =
        useSwapStore();
    const [ref, { height }] = useMeasure();
    return (
        <motion.button
            className="detail-accordion-container"
            onClick={() => {
                setIsOpen((prev) => !prev);
            }}
            data-testid="swap-details"
        >
            <div className="detail-accordion">
                {onePayRoute && onePayRoute.pool_data && !isFindingBestRoute ? (
                    <div className="one-pay">
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
                        <CgSpinnerTwo className="animate-spin" />
                        {t("fetching_best_route")}
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.05 },
                            height: height ?? 0,
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        className="detail-accordion-content"
                    >
                        <div ref={ref} className="details-inner-container">
                            <SwapKeyValue
                                keyText={t("slippage_tolerance")}
                                value={
                                    <div className="slippage-box">
                                        {slippage === "auto" ? "1" : slippage}%{" "}
                                        {slippage === "auto" ? t("auto") : ""}
                                    </div>
                                }
                            />
                            <SwapKeyValue
                                keyText={t("blockchain_fee")}
                                value={
                                    bestRoute?.pool_data.blockchainFee ??
                                    "0 TON"
                                }
                            />
                            <SwapKeyValue
                                keyText={t("price_impact")}
                                value={
                                    <span data-testid="price-impact">
                                        {bestRoute
                                            ? bestRoute.pool_data.priceImpact +
                                              "%"
                                            : "0%"}
                                    </span>
                                }
                            />
                            <SwapKeyValue
                                keyText={t("minimum_received")}
                                value={
                                    bestRoute?.pool_data.minimumReceive_show ??
                                    "0"
                                }
                            />
                            <SwapKeyValue
                                keyText={t("route")}
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
                                                            bestRoute
                                                                .selected_pool
                                                                .dex ===
                                                            "dedust"
                                                                ? "https://dedust.io/favicon-32x32.png"
                                                                : "https://ston.fi/images/tild3432-3236-4431-b139-376231383134__favicon.svg"
                                                        })`,
                                                    }}
                                                ></div>
                                                {bestRoute.selected_pool.dex ===
                                                "dedust"
                                                    ? "Dedust"
                                                    : "Ston.fi"}
                                                <BsArrowRightShort />
                                            </span>
                                            <RouteView
                                                routes={
                                                    bestRoute.pool_data
                                                        .route_view
                                                }
                                            />
                                        </div>
                                    ) : (
                                        "Enter amount"
                                    )
                                }
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

const RouteView: FC<{ routes: string[] }> = ({ routes }) => {
    return (
        <span>
            {routes.map((route, idx) => (
                <>
                    {route}{" "}
                    {idx !== routes.length - 1 && (
                        <BsChevronRight className="route-icon" />
                    )}
                </>
            ))}
        </span>
    );
};

export default SwapDetails;
