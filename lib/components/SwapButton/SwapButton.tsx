import { useThemeStore } from "../../store/theme.store";
import { useWalletStore } from "../../store/wallet.store";
import { ModalState, useSwapStore } from "../../store/swap.store";
import { AnimatePresence, motion } from "framer-motion";
import ErrorTonConnect from "./ErrorTonConnect";
import ConfirmationModal from "./ConfirmationModal";
import WaitingForWallet from "./WaitingForWallet";
import Inprogress from "./Inprogress";
import Done from "./Done";
import "./SwapButton.scss";
import { useMediaQuery } from "usehooks-ts";
import {
    modalAnimationDesktop,
    modalAnimationMobile,
    WIDGET_VERSION,
} from "../../constants";
import { useLongPress } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import { useOptionsStore } from "../../store/options.store";

const SwapButton = () => {
    const { tonConnectInstance } = useOptionsStore();
    const { colors } = useThemeStore();

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { balance } = useWalletStore();
    const {
        pay_amount,
        pay_token,
        bestRoute,
        swapModal,
        receive_token,
        setModalState,
    } = useSwapStore();

    const getSwapText = () => {
        if (!tonConnectInstance?.wallet) return "Connect Wallet";
        if (!receive_token || !pay_token) return "Choose a token";
        if (pay_amount === 0n) return "Enter an amount";
        if (bestRoute && !bestRoute.pool_data.status)
            return "Price Impact is too high";
        if (pay_amount > Number(balance.get(pay_token!.address)?.balance ?? 0))
            return "Insufficient balance";

        return "Swap";
    };

    const isButtonDisabled = () => {
        if (!tonConnectInstance?.wallet) return false;
        if (!pay_amount || !pay_token) return true;
        if (bestRoute && !bestRoute.pool_data.status) return true;
        if (pay_amount > Number(balance.get(pay_token!.address)?.balance ?? 0))
            return true;

        return false;
    };

    const swapText = getSwapText();
    const buttonDisabled = isButtonDisabled();

    const handleSwapClick = () => {
        if (tonConnectInstance && !tonConnectInstance?.wallet) {
            tonConnectInstance?.openModal();
        } else {
            setModalState(ModalState.CONFIRM);
        }
    };

    const isRouteAvailable = bestRoute && bestRoute.pool_data;
    const modalAnimation = isDesktop
        ? modalAnimationDesktop
        : modalAnimationMobile;
    const attrs = useLongPress(
        () => {
            toast(`Version: ${WIDGET_VERSION}`);
        },
        {
            threshold: 1000 * 5,
        }
    );
    return (
        <>
            <AnimatePresence>
                {bestRoute && swapModal !== ModalState.NONE && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-container"
                    >
                        <motion.div
                            transition={{ ease: [0.6, -0.05, 0.01, 0.99] }}
                            className="modal-container-inner"
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
                            style={{
                                background: colors.background,
                                borderColor: colors.border,
                            }}
                        >
                            {swapModal === ModalState.CONFIRM && (
                                <ConfirmationModal
                                    setConfirmModal={setModalState}
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
                {...attrs}
                style={{
                    background:
                        tonConnectInstance?.wallet &&
                        isRouteAvailable &&
                        !bestRoute.pool_data.status
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
