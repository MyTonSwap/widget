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
        <div className="mts-flex mts-relative mts-flex-col mts-items-center  mts-mt-3.5 mts-rounded-xl mts-font-medium">
            <Card type="pay" />

            {shouldShowChangeDirection && (
                <div className="mts-h-0">
                    <button
                        disabled={isDisabled}
                        onClick={() => {
                            changeDirection();
                        }}
                        className="mts-flex mts-justify-center mts-items-center mts-z-1 mts-transition-all mts-duration-300 mts-ease mts-rounded-md mts-bg-primary-500 mts-h-10 mts-w-10 mts-text-white mts-text-xl active:mts-scale-95 disabled:mts-opacity-50 disabled:mts-cursor-not-allowed mts-absolute -mts-translate-x-1/2 -mts-translate-y-1/2"
                        data-testid="change-direction-button"
                    >
                        <LuArrowDownUp />
                    </button>
                </div>
            )}
            <Card type="receive" />
        </div>
    );
};

export default SwapCard;
