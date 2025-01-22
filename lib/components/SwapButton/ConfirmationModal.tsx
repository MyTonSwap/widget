import { ModalState, useSwapStore } from '../../store/swap.store';
import { fromNano } from '@mytonswap/sdk';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import SwapKeyValue from '../SwapDetails/SwapKeyValue';
import formatNumber from '../../utils/formatNum';
import swap from '../../utils/swap';
import { FC, useEffect } from 'react';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import Close from '../icons/Close';
type ConfirmationModalProps = {
    setConfirmModal: (state: ModalState) => void;
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({ setConfirmModal }) => {
    const {
        pay_amount,
        pay_token,
        bestRoute,
        receive_token,
        receive_rate,
        slippage,
        setModalState,
    } = useSwapStore();
    const { t } = useTranslation();

    const handleConfirmClose = () => {
        setConfirmModal(ModalState.NONE);
    };
    const { tonConnectInstance } = useOptionsStore();
    useEffect(() => {
        if (tonConnectInstance) {
            tonConnectInstance.uiOptions = {
                actionsConfiguration: { modals: [] },
            };
        }
    }, [tonConnectInstance]);

    const handleConfirmSwap = () => {
        if (tonConnectInstance?.wallet) {
            swap(tonConnectInstance, bestRoute!);
            setConfirmModal(ModalState.NONE);
            setModalState(ModalState.WAITING);
        }
    };
    return (
        <div className="mts-flex mts-flex-col mts-items-center mts-gap-3 mts-px-2 mts-pt-2 mts-pb-2 mts-w-full mts-h-full ">
            <div className="mts-flex mts-justify-between mts-items-center mts-w-full">
                <span className="mts-text-black dark:mts-text-white mts-font-bold mts-text-lg">
                    {t('confirm.confirm_title')}
                </span>{' '}
                <button onClick={handleConfirmClose}>
                    <Close className="mts-cursor-pointer mts-text-black mts-text-2xl dark:mts-text-white" />
                </button>
            </div>
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
            <div className="mts-flex mts-flex-col mts-items-center mts-opacity-70 mts-text-black dark:mts-text-white mts-font-bold mts-text-center">
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
                <div className="mts-opacity-60 mts-text-xs">
                    ≈{' '}
                    {formatNumber(
                        Number(bestRoute!.pool_data.receive_show) *
                            receive_rate!.USD,
                        4
                    )}
                    $
                </div>
            </div>
            <div className="mts-flex mts-flex-grow mts-flex-col mts-justify-center mts-gap-3 mts-mt-0.5 mts-w-full mts-h-fit mts-text-lg">
                <SwapKeyValue
                    keyText={t('slippage_tolerance')}
                    value={
                        <div className="mts-px-2 mts-py-1 mts-bg-zinc-200 dark:mts-bg-zinc-700 dark:mts-text-white mts-rounded-full">
                            {slippage === 'auto' ? '1% Auto' : slippage + '%'}
                        </div>
                    }
                />
                <SwapKeyValue
                    keyText={t('minimum_received')}
                    value={
                        <div className="mts-flex mts-gap-1">
                            {formatNumber(
                                bestRoute!.pool_data.minimumReceive_show,
                                4
                            )}
                            <div>{receive_token?.symbol}</div>
                        </div>
                    }
                />
                <SwapKeyValue
                    keyText={t('blockchain_fee')}
                    value={bestRoute!.pool_data.blockchainFee}
                />
                <SwapKeyValue
                    keyText={t('route')}
                    value={
                        bestRoute ? (
                            <div className="mts-flex mts-justify-center mts-items-center mts-gap-1">
                                {bestRoute.pool_data.route_view.join(' > ')}
                            </div>
                        ) : (
                            'Enter amount'
                        )
                    }
                />
            </div>
            <div className="mts-mt-0.5 mts-w-full">
                <button
                    onClick={handleConfirmSwap}
                    className="mts-cursor-pointer mts-rounded-lg mts-bg-primary-500 mts-w-full mts-h-12 mts-text-white mts-text-base mts-border-[1px] mts-border-primary-600"
                >
                    {t('confirm.confirm_button')}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
