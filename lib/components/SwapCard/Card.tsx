import { ChangeEvent, CSSProperties, FC, useEffect, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import CardDialog from './CardDialog';
import { useSwapStore } from '../../store/swap.store';
import { Asset, BestRoute, fromNano } from '@mytonswap/sdk';
import formatNumber from '../../utils/formatNum';
import CardButton from './CardButton';
import { toNano } from '@mytonswap/sdk';
import { useWalletStore } from '../../store/wallet.store';
import { TON_ADDR } from '../../constants';
import './Card.scss';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
type CardProps = {
    type: 'pay' | 'receive';
};

const Card: FC<CardProps> = ({ type }) => {
    const { t } = useTranslation();
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [typingTimeout, setTypingTimeout] =
        useState<ReturnType<typeof setTimeout>>();
    const [userInput, setUserInput] = useState('');
    const {
        setPayToken,
        pay_token,
        pay_rate,
        setReceiveToken,
        receive_rate,
        pay_amount,
        receive_token,
        isLoading,
        setPayAmount,
        bestRoute,
        isFindingBestRoute,
    } = useSwapStore();
    const { balance } = useWalletStore();
    const { options } = useOptionsStore();
    const onTokenSelect = (asset: Asset) => {
        if (type === 'pay') {
            setPayToken(asset);
        } else {
            setReceiveToken(asset);
        }
        setIsSelectVisible(false);
    };

    const tokenRate = (() => {
        if (type === 'pay') {
            return pay_rate?.USD ?? 0;
        } else {
            return receive_rate?.USD ?? 0;
        }
    })();

    const token = (() => {
        if (type === 'pay') {
            return pay_token;
        } else {
            return receive_token;
        }
    })();

    const isRouteAvailable = bestRoute && bestRoute.pool_data;

    const value =
        type === 'pay'
            ? userInput
            : ((isRouteAvailable && bestRoute?.pool_data.receive_show) ?? 0);

    const calculatePayRate = (payAmount: bigint, tokenRate: number) =>
        payAmount
            ? formatNumber(
                  Number(fromNano(payAmount, pay_token?.decimal)) * tokenRate,
                  4
              )
            : 0;

    const calculateReceiveRate = (
        bestRoute: BestRoute | null,
        tokenRate: number
    ) =>
        isRouteAvailable && bestRoute!.pool_data.receive_show
            ? formatNumber(
                  Number(bestRoute!.pool_data.receive_show) * tokenRate,
                  4
              )
            : 0;

    const calculatedRate =
        type === 'pay'
            ? calculatePayRate(pay_amount, tokenRate)
            : calculateReceiveRate(bestRoute, tokenRate);

    const timeoutSetPayAmount = (num: bigint) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(
            setTimeout(() => {
                setPayAmount(num);
            }, 300)
        );
    };
    const handlePayAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const decimalRegexp = /^\d*(?:\.\d{0,18})?$/; // Allow up to 18 decimal places

        let userInput = e.target.value.replace(/,/g, '.');

        // Handle empty string input
        if (userInput === '') {
            setUserInput('');
            timeoutSetPayAmount(0n);
            return;
        }

        // If input matches the decimal pattern
        if (decimalRegexp.test(userInput)) {
            // Avoid leading zeros (except for values like "0." or "0.1")
            userInput = userInput.replace(/^0+(?=\d)/, '');

            // Handle case where input is exactly "0." (valid scenario)
            if (userInput === '.' || userInput === '0.') {
                setUserInput('0.');
            } else {
                setUserInput(userInput);
            }

            // Update the pay amount if input is a valid number
            if (Number(userInput) > 0) {
                timeoutSetPayAmount(toNano(userInput, pay_token?.decimal));
            } else {
                timeoutSetPayAmount(0n);
            }
        }
    };

    useEffect(() => {
        if (type === 'pay') {
            setUserInput(fromNano(pay_amount, pay_token?.decimal));
        }
    }, [pay_amount]);

    const balanceToken = (() => {
        if (type === 'pay') {
            return pay_token ? balance.get(pay_token.address) : null;
        } else {
            return receive_token ? balance.get(receive_token.address) : null;
        }
    })();

    const handleMaxClick = () => {
        if (!balanceToken || !pay_token) return;

        let payAmount = BigInt(balanceToken.balance);
        if (pay_token.address === TON_ADDR) {
            if (payAmount <= toNano(0.2)) return;
            payAmount = payAmount - toNano(0.2);
        }
        if (payAmount === pay_amount) return;

        setUserInput(formatNumber(+fromNano(payAmount), 2));
        setPayAmount(payAmount);
    };
    const isDisabled = (() => {
        if (type === 'pay' && options.lock_pay_token) return true;
        if (type === 'receive' && options.lock_receive_token) return true;
        return false;
    })();
    return (
        <>
            <div
                className={cn(
                    'mts-flex mts-flex-col mts-w-full mts-text-base mts-bg-dark-50 dark:mts-bg-dark-900 dark:mts-border-transparent mts-border-[1px] mts-border-dark-200 mts-p-4 mts-rounded-lg',
                    type === 'receive' && 'mts-m-[2px]'
                )}
            >
                <div className="mts-flex mts-justify-between mts-items-center">
                    <span
                        data-testid="swapcard-title"
                        className="mts-opacity-70 mts-text-black mts-text-xs mts-font-normal dark:mts-text-white"
                    >
                        {type === 'pay' ? t('you_pay') : t('you_receive')}
                    </span>
                </div>
                <div
                    className={cn(
                        `mts-grid mts-grid-cols-[1fr_auto] mts-gap-1  mts-rounded-lg  mts-w-full mts-mt-3`
                    )}
                >
                    <div className="mts-flex mts-flex-col mts-justify-center mts-gap-1 mts-w-full">
                        {((type === 'receive' && !isFindingBestRoute) ||
                            type === 'pay') && (
                            <input
                                type="text"
                                inputMode="decimal"
                                autoComplete="off"
                                autoCorrect="off"
                                minLength={1}
                                maxLength={14}
                                value={value ?? ''}
                                disabled={
                                    type === 'receive' || options.lock_input
                                }
                                onChange={handlePayAmountChange}
                                pattern="^[0-9]*[.,]?[0-9]*$"
                                placeholder="0"
                                className={`mts-outline-none mts-bg-transparent mts-h-7 mts-w-full mts-text-black dark:mts-text-white mts-font-bold  mts-font-inherit mts-text-lg md:mts-text-2xl ${type}`}
                                data-testid={`swapcard-input-${type}`}
                            />
                        )}
                        {type === 'receive' && isFindingBestRoute && (
                            <div
                                className="mts-rounded-lg mts-w-24 mts-h-7"
                                data-skeleton
                                style={{
                                    ...({
                                        '--skeleton-bg': `var(--input-token-color)`,
                                        '--skeleton-shine': `var(--skeleton-shine-color)`,
                                    } as CSSProperties),
                                }}
                            />
                        )}
                        {((type === 'receive' && !isFindingBestRoute) ||
                            type === 'pay') && (
                            <span className="mts-flex mts-items-center mts-opacity-50 mts-h-5 mts-text-black dark:mts-text-white mts-text-sm md:mts-text-base mts-font-inherit mts-font-medium mts-text-left">
                                {calculatedRate} $
                            </span>
                        )}
                        {type === 'receive' && isFindingBestRoute && (
                            <div
                                className="mts-rounded-lg mts-w-12 mts-h-5"
                                data-skeleton
                                style={{
                                    ...({
                                        '--skeleton-bg': `var(--input-token-color)`,
                                        '--skeleton-shine': `var(--skeleton-shine-color)`,
                                    } as CSSProperties),
                                }}
                            />
                        )}
                    </div>
                    <div className="mts-flex mts-items-end mts-flex-col mts-gap-2">
                        <CardButton
                            type={type}
                            onClick={() => setIsSelectVisible(true)}
                            isLoading={isLoading || !token}
                        >
                            <div
                                className="mts-rounded-full !mts-bg-contain mts-w-8 mts-h-8"
                                style={{
                                    background: `url(${token?.image}) `,
                                }}
                            ></div>
                            <div>{token?.symbol}</div>
                            {!isDisabled && (
                                <div className="mts-dropdown-icon">
                                    <MdKeyboardArrowDown />
                                </div>
                            )}
                        </CardButton>
                        {type === 'pay' && balanceToken ? (
                            <span
                                className="mts-cursor-pointer  mts-text-xs mts-flex mts-items-center mts-gap-2 mts-text-dark-500 mts-font-medium"
                                onClick={handleMaxClick}
                            >
                                <span>
                                    {formatNumber(
                                        +fromNano(
                                            balanceToken.balance,
                                            pay_token!.decimal
                                        ),
                                        2,
                                        false
                                    )}{' '}
                                    {pay_token?.symbol}
                                </span>
                                <span className="mts-text-black mts-px-1 mts-bg-dark-200 dark:mts-bg-dark-700 dark:mts-text-white mts-text-[10px] mts-rounded-full">
                                    {t('max')}
                                </span>
                            </span>
                        ) : (
                            <span className="mts-cursor-auto  mts-text-xs mts-text-dark-500">
                                {balanceToken && receive_token && (
                                    <span>
                                        {formatNumber(
                                            +fromNano(
                                                balanceToken.balance,
                                                receive_token!.decimal
                                            ),
                                            2,
                                            false
                                        )}{' '}
                                        {receive_token?.symbol}
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <CardDialog
                isSelectVisible={isSelectVisible}
                setIsSelectVisible={setIsSelectVisible}
                onTokenSelect={onTokenSelect}
                type={type}
            />
        </>
    );
};

export default Card;
