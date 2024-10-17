import { ChangeEvent, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
import { FaCircleCheck } from "react-icons/fa6";
import "./SlippageSetting.scss";
const SlippageSetting = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { slippage, setSlippage } = useSwapStore();
    const { colors } = useThemeStore();
    const [userInput, setUserInput] = useState("");

    const handleSlippageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const decimalRegexp = /^\d*(?:\.\d)?$/;

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
            setUserInput(clearedInput.replace(/0(?=[1-9])/g, ""));
        }
        if (Number(clearedInput) > 0 && Number(clearedInput) < 50) {
            setUserInput(clearedInput.replace(/0(?=[1-9])/g, ""));
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
    return (
        <motion.div
            initial={{ height: 20 }}
            animate={{ height: isOpen ? 56 : 20 }}
            className="slippage-setting-container"
        >
            <button
                className="button-container"
                onClick={() => setIsOpen((prev) => !prev)}
                style={{ color: colors.text_black }}
            >
                <div>Max Slippage</div>
                <div className="slippage-indicator">
                    {slippage === "auto" ? "Auto" : `${slippage}%`}{" "}
                    <MdOutlineKeyboardArrowDown
                        className="icon"
                        style={{
                            transform: isOpen ? "rotate(180deg)" : "none",
                        }}
                    />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="slippage-setting-dropdown"
                    >
                        <div
                            onClick={handleOnAutoClick}
                            className="dropdown-item"
                        >
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
                        <div className="dropdown-item">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SlippageSetting;
