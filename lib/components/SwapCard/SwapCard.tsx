import { useSwapStore } from '../../store/swap.store';
import Card from './Card';
import { LuArrowDownUp } from 'react-icons/lu';

import { useOptionsStore } from '../../store/options.store';
const SwapCard = () => {
    const { changeDirection } = useSwapStore();
    const { options } = useOptionsStore();

    const shouldShowChangeDirection =
        options.ui_preferences?.show_change_direction;

    const isDisabled = options.lock_pay_token || options.lock_receive_token;
    return (
        <div className="mts-flex mts-relative mts-flex-col mts-items-center mts-gap-3 mts-mt-3.5 mts-rounded-xl mts-bg-zinc-100 mts-p-3 mts-font-medium">
            <Card type="pay" />
            <div className="mts-absolute mts-top-1/2 mts-bg-white mts-w-full mts-h-[3px] md:mts-h-[5px]"></div>
            {shouldShowChangeDirection && (
                <button
                    disabled={isDisabled}
                    onClick={() => {
                        changeDirection();
                    }}
                    className="mts-flex mts-relative mts-justify-center mts-items-center mts-z-1 mts-transition-all mts-duration-300 mts-ease mts-rounded-full mts-bg-primary-500 mts-py-3 mts-px-14 md:mts-px-15 mts-text-white mts-text-2xl active:mts-scale-95 disabled:mts-opacity-50 disabled:mts-cursor-not-allowed"
                    data-testid="change-direction-button"
                >
                    <LuArrowDownUp />
                </button>
            )}
            <Card type="receive" />
        </div>
    );
};

export default SwapCard;
