import { useWalletStore } from '../../store/wallet.store';
import { ModalState, useSwapStore } from '../../store/swap.store';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorTonConnect from './ErrorTonConnect';
import ConfirmationModal from './ConfirmationModal';
import WaitingForWallet from './WaitingForWallet';
import Inprogress from './Inprogress';
import Done from './Done';
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
                <span className="mts-flex mts-justify-center mts-items-center mts-gap-2">
                    <CgSpinnerTwo className="mts-animate-spin" /> Loading ...
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
                        className="mts-fixed mts-top-0 mts-left-0 mts-z-[9999999999999999999999999] mts-bg-[rgba(0,0,0,0.5)] mts-w-full mts-h-full mts-overflow-hidden"
                    >
                        <motion.div
                            transition={{ ease: [0.6, -0.05, 0.01, 0.99] }}
                            className="mts-flex mts-fixed mts-bottom-0 mts-left-0 mts-flex-col mts-justify-center mts-items-center mts-shadow-[0px_0px_5px_rgba(0,0,0,0.05)] mts-border-t mts-border-solid mts-border-black/10 mts-rounded-t-lg mts-bg-white dark:mts-bg-zinc-900 mts-p-2 mts-w-full mts-h-full mts-max-h-[28.75rem] md:mts-shadow-[0_0px_10px_rgba(0,0,0,0.05)] md:mts-rounded-lg md:mts-w-[90%] md:mts-max-w-[28.125rem] md:mtsx-max-h-[80%] md:mts-max-h-[30rem] lg:mts-w-[32.5rem] lg:mts-max-w-[32.5rem]"
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
                    'mts-mt-3 mts-rounded-lg mts-bg-primary-500 mts-border-[1px] mts-border-primary-600  mts-w-full mts-h-11 mts-text-white mts-text-sm md:mts-h-[3.25rem] md:mts-text-md lg:mts-rounded-xl lg:mts-h-[3.5rem] lg:mts-text-md disabled:mts-bg-primary-300 dark:disabled:mts-bg-primary-800 dark:disabled:mts-border-transparent dark:disabled:mts-text-white/50  disabled:mts-cursor-not-allowed',
                    tonConnectInstance?.wallet &&
                        isRouteAvailable &&
                        !bestRoute.pool_data.status
                        ? ''
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
