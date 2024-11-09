import { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSwapStore } from "../../store/swap.store";
import { FaCircleCheck } from "react-icons/fa6";
import "./SlippageSetting.scss";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const SlippageSetting = () => {
    const { t } = useTranslation();

    const { slippage, setSlippage } = useSwapStore();
    const [userInput, setUserInput] = useState("");

    const handleSlippageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const decimalRegexp = /^\d*(?:\.\d{0,1})?$/;

        const userInput = e.target.value.replace(/,/g, ".");
        let clearedInput = "";
        if (userInput === "") {
            clearedInput = "".replace(/^0+$/, "0");
        } else if (userInput === "." || userInput === "0.") {
            clearedInput = "0.".replace(/^0+$/, "0");
        } else if (decimalRegexp.test(userInput)) {
            clearedInput = userInput.replace(/^0+$/, "0");
        } else {
            return;
        }
        if (clearedInput.includes(".") || userInput === "0") {
            setUserInput(clearedInput.replace(/^0+(?=\d)/, ""));
        }
        if (Number(clearedInput) > 0 && Number(clearedInput) <= 10) {
            setUserInput(clearedInput.replace(/^0+(?=\d)/, ""));
            setSlippage(+clearedInput);
        } else if (clearedInput === "") {
            setUserInput("");
            setSlippage("auto");
        }
    };

    const handleOnAutoClick = () => {
        setUserInput("");
        setSlippage("auto");
    };

    const handleOnPlusClick = () => {
        if (slippage === "auto") {
            setSlippage(1);
            setUserInput("1");
        } else {
            const newSlippage = Math.min(10, +(slippage + 0.1).toFixed(1));
            setSlippage(newSlippage);
            setUserInput(`${newSlippage}`);
        }
    };
    const handleOnMinusClick = () => {
        if (slippage === "auto") {
            setSlippage(1);
            setUserInput("1");
        } else {
            const newSlippage = Math.max(
                1,
                +((slippage as number) - 0.1).toFixed(1)
            );
            setSlippage(newSlippage);
            setUserInput(`${newSlippage}`);
        }
    };

    return (
        <div
            className="slippage-setting-container"
            data-testid="slippage-setting"
        >
            <button className="button-container">
                <div>{t("max_slippage")}</div>
                <div
                    className="slippage-indicator"
                    data-testid="slippage-indicator"
                >
                    {slippage === "auto" ? t("auto") : `${slippage}%`}{" "}
                </div>
            </button>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="slippage-setting-dropdown"
                >
                    <div
                        onClick={handleOnAutoClick}
                        className="dropdown-item"
                        data-testid="slippage-setting-auto"
                    >
                        <FaCircleCheck
                            className={`icon ${
                                slippage === "auto" ? "" : "disabled"
                            }`}
                        />
                        {t("auto")}
                    </div>
                    <div className="controllers">
                        <button
                            className={`controller ${
                                slippage !== "auto" && slippage <= 1
                                    ? "disabled"
                                    : ""
                            }`}
                            data-testid="slippage-setting-minus"
                            onClick={handleOnMinusClick}
                            disabled={slippage !== "auto" && slippage <= 1}
                        >
                            <FaMinus />
                        </button>
                        <div className="slippage-input-group dropdown-item percent-input">
                            <FaCircleCheck
                                className={`icon ${
                                    slippage !== "auto" ? "" : "disabled"
                                }`}
                            />
                            <input
                                value={userInput}
                                onChange={handleSlippageChange}
                                data-testid="slippage-setting-input"
                                type="text"
                                dir="rtl"
                                className="slippage-input"
                                placeholder="1"
                            />
                            <span className="slippage-input-percent">%</span>
                        </div>
                        <button
                            className={`controller ${
                                slippage !== "auto" && slippage >= 10
                                    ? "disabled"
                                    : ""
                            }`}
                            onClick={handleOnPlusClick}
                            data-testid="slippage-setting-plus"
                            disabled={slippage !== "auto" && slippage >= 10}
                        >
                            <TiPlus />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SlippageSetting;
