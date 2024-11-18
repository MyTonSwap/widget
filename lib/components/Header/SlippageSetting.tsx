import { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSwapStore } from "../../store/swap.store";
import "./SlippageSetting.scss";
import { useTranslation } from "react-i18next";

const SlippageSetting = () => {
    const { t } = useTranslation();

    const { slippage, setSlippage } = useSwapStore();
    const [userInput, setUserInput] = useState(
        slippage === "auto" ? "" : slippage.toString()
    );

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
    const handleOnPercentClick = (percent: number) => {
        setUserInput(percent.toString());
        setSlippage(percent);
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
                        className={`dropdown-item ${
                            slippage === "auto" ? "active" : "disabled"
                        }`}
                        data-testid="slippage-setting-auto"
                    >
                        {t("auto")}
                    </div>
                    <div
                        onClick={() => handleOnPercentClick(2)}
                        className={`dropdown-item ${
                            slippage === 2 ? "active" : "disabled"
                        }`}
                        data-testid="slippage-setting-2"
                    >
                        2%
                    </div>
                    <div
                        onClick={() => handleOnPercentClick(5)}
                        className={`dropdown-item ${
                            slippage === 5 ? "active" : "disabled"
                        }`}
                        data-testid="slippage-setting-5"
                    >
                        5%
                    </div>
                    <div
                        className={`controllers dropdown-item ${
                            ["auto", 2, 5].includes(slippage)
                                ? "disabled"
                                : "active"
                        }`}
                    >
                        <input
                            value={userInput}
                            onChange={handleSlippageChange}
                            data-testid="slippage-setting-input"
                            type="text"
                            dir="rtl"
                            className={`slippage-input `}
                            placeholder="1"
                        />
                        <span className="slippage-input-percent">%</span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SlippageSetting;
