import { useEffect } from 'react';
import { ModalState, useSwapStore } from '../../store/swap.store';
import { IoClose } from 'react-icons/io5';
import { Dex, fromNano } from '@mytonswap/sdk';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { useEventsStore } from '../../store/events.store';
import { useTranslation } from 'react-i18next';
import Spinner from '../icons/Spinner';

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
        <div className="mts-flex mts-flex-col mts-justify-center mts-items-center mts-h-full mts-w-full">
            <IoClose
                onClick={handleCloseModal}
                className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-black dark:mts-text-white mts-text-xl"
            />
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

            <div className="mts-mt-4 mts-font-bold mts-text-lg md:mts-text-xl mts-text-center dark:mts-text-white">
                {t('transaction.pending')}
            </div>
            <p className="mts-text-black dark:mts-text-white mts-text-base">
                {t('transaction.action_in_progress')}
            </p>
            <div className="mts-flex mts-justify-center mts-items-center mts-text-3xl md:mts-text-4xl mts-h-20 mts-w-20 mts-border-[1px] mts-bg-zinc-100 mts-border-zinc-200 mts-rounded-full mts-mt-6  dark:mts-bg-zinc-800 dark:mts-border-zinc-700">
                <Spinner className="mts-text-[30px] mts-text-primary-500 mts-animate-spin" />
            </div>
        </div>
    );
};

export default Inprogress;
