import { ModalState, useSwapStore } from '../../store/swap.store';
import { motion } from 'framer-motion';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { fromNano } from '@mytonswap/sdk';
import Close from '../icons/Close';
import Spinner from '../icons/Spinner';

const WaitingForWallet = () => {
    const { t } = useTranslation();
    const { tonConnectInstance } = useOptionsStore();
    const { pay_amount, pay_token, bestRoute, receive_token, setModalState } =
        useSwapStore();

    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mts-flex mts-relative mts-flex-col mts-w-full mts-justify-center mts-items-center mts-px-4 mts-h-full mts-text-black dark:mts-text-white"
        >
            <button onClick={handleCloseModal}>
                <Close className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-2xl" />
            </button>
            <div className="mts-flex mts-items-center mts-pt-1">
                <div
                    className="mts-translate-x-3 mts-border-5 mts-border-solid mts-border-modal-background mts-rounded-full !mts-bg-contain mts-w-11 mts-h-11"
                    style={{
                        background: `url(${pay_token?.image})`,
                    }}
                ></div>
                <div
                    className="mts--translate-x-0.5 mts-border-5 mts-border-solid mts-border-modal-background mts-rounded-full !mts-bg-contain mts-w-11 mts-h-11"
                    style={{
                        background: `url(${receive_token?.image})`,
                    }}
                ></div>
            </div>
            <div className="mts-flex mts-flex-col mts-items-center mts-opacity-70 mts-text-black dark:mts-text-white mts-font-bold mts-text-center mts-bg-zinc-50 mts-w-full mts-border-zinc-200 mts-border-[1px] mts-rounded-xl mts-p-2 dark:mts-bg-zinc-800 dark:mts-border-zinc-700 mts-mt-6">
                <div>
                    {fromNano(pay_amount, pay_token?.decimal)}{' '}
                    {pay_token?.symbol}
                </div>
                <div>
                    <FaArrowRightArrowLeft className="mts-rotate-90 mts-opacity-60 mts-text-xs" />
                </div>
                <div>
                    {bestRoute!.pool_data.receive_show!} {receive_token?.symbol}
                </div>
                {/* <div className="mts-opacity-60 mts-text-xs">
                    ≈{' '}
                    {formatNumber(
                        Number(bestRoute!.pool_data.receive_show) *
                            receive_rate!.USD,
                        4
                    )}
                    $
                </div> */}
            </div>

            <div className="mts-mt-4 mts-font-bold mts-text-lg md:mts-text-xl mts-text-center">
                <Trans
                    i18nKey={'confirm.confirm_in_wallet'}
                    values={{
                        wallet: tonConnectInstance?.wallet?.device.appName,
                    }}
                ></Trans>
            </div>
            <p className="mts-text-base">{t('confirm.action_in_progress')}</p>
            <div className="mts-flex mts-justify-center mts-items-center mts-text-3xl md:mts-text-4xl mts-h-20 mts-w-20 mts-border-[1px] mts-bg-zinc-100 dark:mts-bg-zinc-800 dark:mts-border-zinc-700 mts-border-zinc-200 mts-rounded-full mts-mt-6">
                <Spinner className="mts-animate-spin mts-opacity-70 mts-text-primary-500" />
            </div>
        </motion.div>
    );
};

export default WaitingForWallet;
