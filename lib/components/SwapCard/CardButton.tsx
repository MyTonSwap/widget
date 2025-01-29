import { FC, PropsWithChildren } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import './CardButton.scss';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import { useSwapStore } from '../../store/swap.store';
import { cn } from '../../utils/cn';

type CardButtonProps = {
    isLoading: boolean;
    onClick: () => void;
    type: 'pay' | 'receive';
};

const CardButton: FC<CardButtonProps & PropsWithChildren> = ({
    children,
    isLoading,
    type,
    onClick,
}) => {
    const { t } = useTranslation();
    const { options } = useOptionsStore();
    const { isSelectingToken } = useSwapStore();
    const isDisabled = (() => {
        if (isSelectingToken) return true;
        if (type === 'pay' && options.lock_pay_token) return true;
        if (type === 'receive' && options.lock_receive_token) return true;
        return false;
    })();

    return (
        <button
            disabled={isDisabled}
            onClick={isDisabled ? () => {} : onClick}
            {...{
                ...(isLoading && type === 'pay'
                    ? { 'data-skeleton': true }
                    : {}),
            }}
            data-testid={`card-button-${type}`}
            className={cn(
                'mts-flex mts-gap-1 mts-items-center mts-transition-all mts-ease-in-out mts-rounded-full mts-py-1 mts-pr-2 mts-pl-1 mts-h-10 mts-font-semibold mts-text-sm md:mts-text-base mts-ltr mts-text-black dark:mts-text-white  mts-border-dark-300 dark:mts-border-dark-800 mts-border-[1px]',
                isLoading && 'mts-w-20 mts-h-10',
                type === 'pay' && isLoading && 'mts-pointer-events-none',
                type === 'receive' &&
                    isLoading &&
                    'mts-justify-center mts-px-2 mts-w-fit'
            )}
            style={{
                ...(isDisabled && { opacity: 0.7, cursor: 'auto' }),

                ...{
                    '--skeleton-bg': `var(--input-token-color)`,
                    '--skeleton-shine': `var(--skeleton-shine-color)`,
                },
            }}
        >
            {!isLoading ? (
                children
            ) : type === 'receive' ? (
                <>
                    {t('select')}{' '}
                    <div className="mts-flex mts-justify-center mts-items-center">
                        <MdKeyboardArrowDown />
                    </div>
                </>
            ) : (
                ''
            )}
        </button>
    );
};

export default CardButton;
