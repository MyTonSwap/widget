import { FC, useEffect, useRef, useState } from "react";
import { useWalletStore } from "../../store/wallet.store";
import { useThemeStore } from "../../store/theme.store";
import { ConnectedWallet, TonConnectUI } from "@tonconnect/ui-react";
import shortAddress from "../../utils/shortAddress";

import "./WalletProfile.scss";
import "../Header/SettingPopover.scss";
import "../Swap/Swap.scss";

import { AnimatePresence, motion } from "framer-motion";
import Wallet from "../Header/Wallet";
import { useOnClickOutside } from "usehooks-ts";
import { popOverVariationsKeyValue } from "../../constants";
export type WalletProfileProps = {
    tonConnectInstance: TonConnectUI;
    position?: keyof typeof popOverVariationsKeyValue;
    theme?: {
        text_white_color?: string;
        text_black_color?: string;
        primary_color?: string;
        background_color?: string;
        background_shade_color?: string;
        border_color?: string;
    };
};

export const WalletProfile: FC<WalletProfileProps> = ({
    tonConnectInstance,
    position = "top-right",
    theme,
}) => {
    const { setWallet, disconnect, wallet } = useWalletStore();
    const { setTheme, colors } = useThemeStore();

    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useOnClickOutside(ref, () => {
        setTimeout(() => setIsOpen(false), 100);
    });

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleConnectWallet = () => {
        tonConnectInstance.openModal();
    };

    useEffect(() => {
        const handleStatusChange = (wallet: ConnectedWallet | null) => {
            if (wallet) {
                setWallet(wallet);
            } else {
                disconnect();
            }
        };

        tonConnectInstance.onStatusChange(handleStatusChange);

        if (tonConnectInstance.wallet) {
            setWallet(tonConnectInstance.wallet);
        } else {
            disconnect();
        }
    }, [tonConnectInstance, setWallet, disconnect]);

    useEffect(() => {
        if (theme) {
            if (theme) {
                setTheme({
                    background: theme.background_color,
                    light_shade: theme.background_shade_color,
                    border: theme.border_color,
                    primary: theme.primary_color,
                    text_black: theme.text_black_color,
                    text_white: theme.text_white_color,
                });
            }
        }
    }, []);

    const popOverAnimationVariation = popOverVariationsKeyValue[position];
    return (
        <div className="wallet-profile-mts mytonswap-app">
            {wallet ? (
                <div
                    className="wallet-profile-button"
                    onClick={handleButtonClick}
                    style={{
                        background: colors.primary,
                        color: colors.text_white,
                        borderColor: colors.border,
                    }}
                >
                    {shortAddress(wallet.account.address, "mainnet", 4)}
                </div>
            ) : (
                <button
                    className="wallet-profile-button"
                    onClick={handleConnectWallet}
                >
                    Connect Wallet
                </button>
            )}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={popOverAnimationVariation.initial}
                        exit={popOverAnimationVariation.exit}
                        animate={popOverAnimationVariation.animate}
                        transition={{ ease: "easeOut", duration: 0.15 }}
                        ref={ref}
                        className="popover"
                        style={{
                            borderColor: colors.border,
                            background: colors.background,
                            color: colors.text_black,
                        }}
                    >
                        <Wallet />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletProfile;
