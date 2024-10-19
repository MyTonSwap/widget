import { useThemeStore } from "../../store/theme.store";
import { useTonConnectModal, useTonWallet } from "@tonconnect/ui-react";
import { useWalletStore } from "../../store/wallet.store";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { AnimatePresence, motion } from "framer-motion";
import ErrorTonConnect from "./ErrorTonConnect";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import WaitingForWallet from "./WaitingForWallet";
import Inprogress from "./Inprogress";
import Done from "./Done";
import "./SwapButton.scss";

const SwapButton = () => {
    const { open } = useTonConnectModal();
    const { colors } = useThemeStore();
    const wallet = useTonWallet();

    const { balance } = useWalletStore();
    const { pay_amount, pay_token, bestRoute, swapModal, receive_token } =
        useSwapStore();

    const [confirmModal, setConfirmModal] = useState(false);
    const getSwapText = () => {
        if (!wallet) return "Connect Wallet";
        if (!receive_token || !pay_token) return "Choose a token";
        if (pay_amount === 0n) return "Enter an amount";
        if (bestRoute && !bestRoute.pool_data.status)
            return "Price Impact is too high";
        if (pay_amount > Number(balance.get(pay_token!.address)?.balance))
            return "Insufficient balance";

        return "Swap";
    };

    const isButtonDisabled = () => {
        if (!wallet) return false;
        if (!pay_amount || !pay_token) return true;
        if (bestRoute && !bestRoute.pool_data.status) return true;
        if (pay_amount > Number(balance.get(pay_token!.address)?.balance))
            return true;

        return false;
    };

    const swapText = getSwapText();
    const buttonDisabled = isButtonDisabled();

    const handleSwapClick = () => {
        if (!wallet) {
            open();
        } else {
            setConfirmModal(true);
        }
    };

    const isRouteAvailable = bestRoute && bestRoute.pool_data;

    return (
        <>
            <AnimatePresence>
                {bestRoute &&
                    (confirmModal || swapModal !== ModalState.NONE) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="modal-container"
                        >
                            <motion.div
                                transition={{ ease: [0.6, -0.05, 0.01, 0.99] }}
                                className="modal-container-inner"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    background: colors.background,
                                    borderColor: colors.border,
                                }}
                            >
                                {confirmModal && (
                                    <ConfirmationModal
                                        setConfirmModal={setConfirmModal}
                                    />
                                )}
                                {swapModal === ModalState.WAITING && (
                                    <WaitingForWallet />
                                )}
                                {swapModal === ModalState.ERROR && (
                                    <ErrorTonConnect />
                                )}
                                {swapModal === ModalState.IN_PROGRESS && (
                                    <Inprogress />
                                )}
                                {swapModal === ModalState.DONE && <Done />}
                            </motion.div>
                        </motion.div>
                    )}
            </AnimatePresence>
            <button
                className="swap-button"
                style={{
                    background:
                        isRouteAvailable && !bestRoute.pool_data.status
                            ? colors.price_impact
                            : colors.primary,
                    color: colors.text_white,
                }}
                onClick={handleSwapClick}
                disabled={buttonDisabled}
            >
                {swapText}
            </button>
        </>
    );
};

export default SwapButton;
