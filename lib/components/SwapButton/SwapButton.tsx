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

const SwapButton = () => {
    const { open } = useTonConnectModal();
    const { colors } = useThemeStore();
    const wallet = useTonWallet();

    const { balance } = useWalletStore();
    const { pay_amount, pay_token, bestRoute, swapModal } = useSwapStore();

    const [confirmModal, setConfirmModal] = useState(false);
    const swapText = (() => {
        if (!wallet) {
            return "Connect Wallet";
        }
        if (!pay_amount || !pay_token) {
            return "Enter amount";
        }

        if (pay_amount > Number(balance.get(pay_token!.address)?.balance)) {
            return "Insufficient balance";
        } else if (bestRoute && bestRoute.pool_data.priceImpact) {
            return `Price Impact is too high`;
        } else {
            return "Swap";
        }
    })();

    const buttonDisabled = (() => {
        if (!pay_amount || !pay_token) {
            return true;
        }
        if (pay_amount > Number(balance.get(pay_token!.address)?.balance)) {
            return true;
        }
        if (bestRoute && bestRoute.pool_data.priceImpact) {
            return true;
        }
    })();

    const handleSwapClick = () => {
        if (!wallet) {
            open();
        } else {
            setConfirmModal(true);
        }
    };

    return (
        <>
            <AnimatePresence>
                {bestRoute &&
                    (confirmModal || swapModal !== ModalState.NONE) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full absolute left-0 z-10 top-0 bg-black/10"
                        >
                            <motion.div
                                initial={{ bottom: "-105%" }}
                                animate={{ bottom: "0%" }}
                                exit={{ bottom: "-105%" }}
                                className="absolute left-0 z-20 w-full border-[1px] h-[350px] rounded-xl "
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
                className="w-full h-12 mt-2 rounded-xl text-white disabled:opacity-70"
                style={{
                    background:
                        bestRoute?.pool_data?.priceImpact ?? 0 > 50
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
