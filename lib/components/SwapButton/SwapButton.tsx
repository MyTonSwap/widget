import { useWalletStore } from '../../store/wallet.store';
import { ModalState, useSwapStore } from '../../store/swap.store';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorTonConnect from './ErrorTonConnect';
import ConfirmationModal from './ConfirmationModal';
import WaitingForWallet from './WaitingForWallet';
import Inprogress from './Inprogress';
import Done from './Done';
import './SwapButton.scss';
import { useMediaQuery } from 'usehooks-ts';
import {
    modalAnimationDesktop,
    modalAnimationMobile,
    WIDGET_VERSION,
} from '../../constants';
import { useLongPress } from '@uidotdev/usehooks';
import toast from 'react-hot-toast';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
import { CgSpinnerTwo } from 'react-icons/cg';

const SwapButton = () => {
    const { t } = useTranslation();
    const { tonConnectInstance } = useOptionsStore();

    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { balance } = useWalletStore();
    const {
        pay_amount,
        pay_token,
        bestRoute,
        swapModal,
        receive_token,
        setModalState,
        isSelectingToken,
    } = useSwapStore();

    const getSwapText = () => {
        if (isSelectingToken)
            return (
                <span className="loading-button">
                    <CgSpinnerTwo className="animate-loading" /> Loading ...
                </span>
            );
        if (!tonConnectInstance?.wallet) return t('button_text.connect_wallet');
        if (!receive_token || !pay_token)
            return t('button_text.choose_a_token');
        if (pay_amount === 0n) return t('button_text.enter_amount');
        if (bestRoute && !bestRoute.pool_data.status)
            return t('button_text.price_impact');
        if (pay_amount > Number(balance.get(pay_token!.address)?.balance ?? 0))
            return t('button_text.insufficient_balance');

        return t('button_text.swap');
    };

    const isButtonDisabled = () => {
        if (!tonConnectInstance?.wallet) return false;

        if (!pay_amount || !receive_token) return true;
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
                            className="modal-container-inner raw-bottom-telegram"
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
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
                className={cn(
                    'swap-button',
                    tonConnectInstance?.wallet &&
                        isRouteAvailable &&
                        !bestRoute.pool_data.status
                        ? 'price-impact'
                        : ''
                )}
                data-testid="swap-button"
                {...attrs}
                onClick={handleSwapClick}
                disabled={buttonDisabled}
            >
                {swapText}
            </button>
        </>
    );
};

export default SwapButton;
