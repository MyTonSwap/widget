import { ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
import { FaCircleCheck } from "react-icons/fa6";
import "./SlippageSetting.scss";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa6";

const SlippageSetting = () => {
    const { slippage, setSlippage } = useSwapStore();
    const { colors } = useThemeStore();
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
    // write a function to handle the slippage change
    // write a function to handle the auto click
    // write a function to handle the plus click
    // write a function to handle the minus click
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
        <div className="slippage-setting-container">
            <button
                className="button-container"
                style={{ color: colors.text_black }}
            >
                <div>Max Slippage</div>
                <div className="slippage-indicator">
                    {slippage === "auto" ? "Auto" : `${slippage}%`}{" "}
                </div>
            </button>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="slippage-setting-dropdown"
                >
                    <div onClick={handleOnAutoClick} className="dropdown-item">
                        <FaCircleCheck
                            className="icon"
                            style={{
                                color:
                                    slippage === "auto"
                                        ? colors.primary
                                        : colors.text_fade,
                            }}
                        />
                        Auto
                    </div>
                    <div className="controllers">
                        <button
                            className="controller"
                            onClick={handleOnMinusClick}
                            disabled={slippage !== "auto" && slippage <= 1}
                        >
                            <FaMinus />
                        </button>
                        <div className="slippage-input-group dropdown-item percent-input">
                            <FaCircleCheck
                                className="icon"
                                style={{
                                    color:
                                        slippage !== "auto"
                                            ? colors.primary
                                            : colors.text_fade,
                                }}
                            />
                            <input
                                value={userInput}
                                onChange={handleSlippageChange}
                                type="text"
                                dir="rtl"
                                className="slippage-input"
                                placeholder="1"
                            />
                            <span className="slippage-input-percent">%</span>
                        </div>
                        <button
                            className="controller"
                            onClick={handleOnPlusClick}
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
