import { FC, PropsWithChildren, useRef, useState } from "react";
import SlippageSetting from "./SlippageSetting";
import { useOnClickOutside } from "usehooks-ts";
import TokensSettings from "./TokensSettings";
import { AnimatePresence, motion } from "framer-motion";

import "./SettingPopover.scss";
import Wallet from "./Wallet";
import { useOptionsStore } from "../../store/options.store";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@uidotdev/usehooks";
import { modalAnimationDesktop, modalAnimationMobile } from "../../constants";
import { IoClose } from "react-icons/io5";

export type SettingPopoverProps = PropsWithChildren & {};

const SettingPopover: FC<SettingPopoverProps> = ({ children }) => {
    const { t } = useTranslation();
    // const direction = i18n.getResourceBundle(
    //     i18n.resolvedLanguage!,
    //     "direction"
    // );
    const { options } = useOptionsStore();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const onClickOutSite = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };
    useOnClickOutside(ref, onClickOutSite);
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };
    const handleCloseSetting = () => {
        setIsOpen(false);
    };
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const modalAnimation = isDesktop
        ? modalAnimationDesktop
        : modalAnimationMobile;
    return (
        <div className="popover-container">
            <button onClick={handleButtonClick} data-testid="setting-button">
                {children}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeOut", duration: 0.15 }}
                        className="modal-backdrop"
                    >
                        <motion.div
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
                            transition={{ ease: "easeOut", duration: 0.15 }}
                            ref={ref}
                            className="popover"
                            data-testid="setting-popover"
                        >
                            <div className="popover-header">
                                <div>{t("setting")}</div>
                                <button
                                    onClick={handleCloseSetting}
                                    className="popover-header-close"
                                >
                                    <IoClose />
                                </button>
                            </div>

                            {options.ui_preferences?.show_settings_slippage && (
                                <SlippageSetting />
                            )}
                            {options.ui_preferences
                                ?.show_settings_community && <TokensSettings />}
                            {options.ui_preferences?.show_settings_wallet && (
                                <Wallet />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingPopover;
