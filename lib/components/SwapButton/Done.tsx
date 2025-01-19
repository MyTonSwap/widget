import { FaArrowRightArrowLeft, FaCircleCheck } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { ModalState, useSwapStore } from '../../store/swap.store';
import { fromNano } from '@mytonswap/sdk';
import formatNumber from '../../utils/formatNum';
import './Done.scss';
import { useTranslation } from 'react-i18next';

const Done = () => {
    const { t } = useTranslation();
    const { bestRoute, pay_amount, pay_token, receive_token, receive_rate } =
        useSwapStore();
    const { setModalState } = useSwapStore();
    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    return (
        <div className="mts-flex mts-flex-col mts-justify-center mts-items-center mts-h-full">
            <IoClose
                onClick={handleCloseModal}
                className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-black mts-text-xl"
            />
            <div className="mts-flex mts-justify-center mts-items-center mts-w-full mts-text-primary mts-text-5xl mts-text-green-500">
                <FaCircleCheck />
            </div>
            <div className="mts-mb-8 mts-text-black mts-font-bold mts-text-xl mts-text-center">
                {t('transaction.complete')}
            </div>
            <div className="mts-flex mts-items-center mts-pt-1">
                <div
                    className="mts-translate-x-3 mts-border-4 mts-border-solid mts-border-zinc-100 mts-rounded-full !mts-bg-contain mts-w-16 mts-h-16"
                    style={{
                        background: `url(${pay_token?.image})`,
                    }}
                ></div>
                <div
                    className="mts--translate-x-0.5 mts-border-4 mts-border-solid mts-border-zinc-100 mts-rounded-full !mts-bg-contain mts-w-16 mts-h-16"
                    style={{
                        background: `url(${receive_token?.image})`,
                    }}
                ></div>
            </div>
            <div className="mts-flex mts-flex-col mts-items-center mts-opacity-70 mts-text-black mts-font-bold mts-text-center">
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
        </div>
    );
};

export default Done;
