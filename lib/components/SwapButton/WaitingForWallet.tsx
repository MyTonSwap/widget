import { ImSpinner8 } from 'react-icons/im';
import { IoClose } from 'react-icons/io5';
import { ModalState, useSwapStore } from '../../store/swap.store';
import { motion } from 'framer-motion';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const WaitingForWallet = () => {
    const { t } = useTranslation();
    const { tonConnectInstance } = useOptionsStore();
    const { setModalState } = useSwapStore();

    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mts-flex mts-relative mts-flex-col mts-justify-center mts-items-center mts-px-4 mts-h-full mts-text-black"
        >
            <IoClose
                onClick={handleCloseModal}
                className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-2xl"
            />

            <div className="mts-flex mts-justify-center mts-items-center mts-scale-150 mts-w-full mts-text-3xl md:mts-text-4xl">
                <ImSpinner8 className="mts-animate-spin mts-opacity-70 mts-text-primary-500" />
            </div>
            <div className="mts-mt-4 mts-font-bold mts-text-2xl md:mts-text-xl mts-text-center">
                <Trans
                    i18nKey={'confirm.confirm_in_wallet'}
                    values={{
                        wallet: tonConnectInstance?.wallet?.device.appName,
                    }}
                ></Trans>
            </div>
            <p>{t('confirm.action_in_progress')}</p>
        </motion.div>
    );
};

export default WaitingForWallet;
