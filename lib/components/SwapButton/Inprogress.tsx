import { useEffect } from 'react';
import { ModalState, useSwapStore } from '../../store/swap.store';
import { IoClose } from 'react-icons/io5';
import { Dex, fromNano } from '@mytonswap/sdk';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import formatNumber from '../../utils/formatNum';
import { ImSpinner8 } from 'react-icons/im';
import { useEventsStore } from '../../store/events.store';
import { useTranslation } from 'react-i18next';

const Inprogress = () => {
    const { t } = useTranslation();
    const {
        transactionHash,
        client,
        setModalState,
        setErrorMessage,
        pay_amount,
        pay_token,
        receive_token,
        bestRoute,
        receive_rate,
        pay_rate,
    } = useSwapStore();
    const { onSwap } = useEventsStore();
    useEffect(() => {
        const checkForTransaction = async () => {
            if (transactionHash) {
                const event = await client.tonapi.waitForTransactionResult(
                    transactionHash,
                    10000
                );
                if (event) {
                    onSwap({
                        type: 'success',
                        data: {
                            pay: pay_token!,
                            receive: receive_token!,
                            pay_amount: pay_amount.toString(),
                            receive_amount:
                                bestRoute!.pool_data.receive_show!.toString(),
                            pay_rate: pay_rate?.USD ?? 0,
                            receive_rate: receive_rate?.USD ?? 0,
                            dex: bestRoute!.selected_pool.dex as Dex,
                            hash: transactionHash,
                        },
                    });

                    setModalState(ModalState.DONE);
                } else {
                    onSwap({
                        type: 'error',
                        data: {
                            pay: pay_token!,
                            receive: receive_token!,
                            pay_amount: pay_amount.toString(),
                            receive_amount:
                                bestRoute!.pool_data.receive_show!.toString(),
                            pay_rate: pay_rate!.USD,
                            receive_rate: receive_rate!.USD,
                            dex: bestRoute!.selected_pool.dex as Dex,
                            hash: transactionHash,
                        },
                    });

                    setErrorMessage({
                        errorTitle: t('errors.transaction_failed'),
                        errorMessage: t('errors.unknown_error'),
                    });
                }
            }
        };
        checkForTransaction();
    }, []);
    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };

    return (
        <div className="mts-flex mts-flex-col mts-justify-center mts-items-center mts-h-full">
            <IoClose
                onClick={handleCloseModal}
                className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-black mts-text-xl"
            />
            <div className="mts-flex mts-items-center mts-pt-1">
                <div
                    className="mts-transform mts-translate-x-1 mts-border-2 mts-border-solid mts-border-zinc-100 mts-rounded-full !mts-bg-contain mts-w-16 mts-h-16 md:mts-w-10 md:mts-h-10"
                    style={{
                        background: `url(${pay_token?.image})`,
                    }}
                ></div>
                <div
                    className="mts-transform mts--translate-x-1 mts-border-2 mts-border-solid mts-border-zinc-100 mts-rounded-full !mts-bg-contain mts-w-16 mts-h-16 md:mts-w-10 md:mts-h-10"
                    style={{
                        background: `url(${receive_token?.image})`,
                    }}
                ></div>
            </div>
            <div className="mts-flex mts-flex-col mts-items-center mts-opacity-70 mts-text-black mts-font-bold mts-text-lg mts-text-center">
                <div>
                    {fromNano(pay_amount, pay_token?.decimal)}{' '}
                    {pay_token?.symbol}
                </div>
                <div>
                    <FaArrowRightArrowLeft className="mts-transform mts-rotate-90 mts-opacity-60 mts-text-sm md:mts-text-xs" />
                </div>
                <div>
                    {bestRoute!.pool_data.receive_show!} {receive_token?.symbol}
                </div>
                <div className="mts-opacity-60 mts-text-sm md:mts-text-xs">
                    ≈{' '}
                    {formatNumber(
                        Number(bestRoute!.pool_data.receive_show) *
                            receive_rate!.USD,
                        4
                    )}
                    $
                </div>
            </div>

            <div className="mts-mt-4 mts-text-black mts-font-bold mts-text-xl mts-text-center">
                {t('transaction.pending')}
            </div>
            <p className="mts-text-black mts-text-base">
                {t('transaction.action_in_progress')}
            </p>
            <div className="mts-flex mts-justify-center mts-items-center mts-mt-1 mts-w-full mts-text-black mts-text-3xl md:mts-mt-4 md:mts-text-4xl">
                <ImSpinner8 className="mts-animate-spin mts-opacity-50" />
            </div>
        </div>
    );
};

export default Inprogress;
