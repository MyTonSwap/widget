import { FC, useEffect, useRef, useState } from "react";
import { useWalletStore } from "../../store/wallet.store";
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
}) => {
    const { setWallet, disconnect, wallet } = useWalletStore();

    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const buttonRef = useRef(null);
    useOnClickOutside([ref, buttonRef], () => {
        setIsOpen(false);
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

    const popOverAnimationVariation = popOverVariationsKeyValue[position];
    return (
        <div className="wallet-profile-mts mytonswap-app">
            <div
                className={`wallet-profile-button ${wallet ? "connected" : ""}`}
                onClick={wallet ? handleButtonClick : handleConnectWallet}
                ref={buttonRef}
            >
                {wallet
                    ? shortAddress(wallet.account.address, "mainnet", 4)
                    : "Connect Wallet"}
            </div>

            <AnimatePresence>
                {wallet && isOpen && (
                    <motion.div
                        initial={popOverAnimationVariation.initial}
                        exit={popOverAnimationVariation.exit}
                        animate={popOverAnimationVariation.animate}
                        transition={{ ease: "easeOut", duration: 0.15 }}
                        ref={ref}
                        className="wallet-popover"
                    >
                        <Wallet />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletProfile;
