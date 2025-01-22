import { Asset, fromNano } from '@mytonswap/sdk';
import { useWalletStore } from '../../store/wallet.store';
import { FC } from 'react';
import formatNumber from '../../utils/formatNum';
import './Token.scss';
import { PiStarBold, PiStarFill } from 'react-icons/pi';
import { TokenTon } from '../icons/TokenTon';
import { TON_ADDR } from '../../constants';
import { toFixedDecimal } from '../../utils/toFixedDecimals';
import { useFavoriteStore } from '../../store/favtorite.store';
import clsx from 'clsx';
import { useSwapStore } from '../../store/swap.store';
import { cn } from '../../utils/cn';
import Link from '../icons/Link';
import { useTranslation } from 'react-i18next';

type TokenProps = {
    asset: Asset;
    onTokenSelect: (asset: Asset) => void;
    type: 'pay' | 'receive';
};

const Token: FC<TokenProps> = ({ asset, onTokenSelect, type }) => {
    const { t } = useTranslation();
    const { balance } = useWalletStore();
    const { pay_token, receive_token } = useSwapStore();
    const { isFav, addToFav, removeFromFav } = useFavoriteStore();
    const tokenBalance = parseFloat(
        toFixedDecimal(
            fromNano(balance.get(asset.address)?.balance ?? 0, asset.decimal),
            2
        )
    );
    const isTokenFav = isFav(asset.address);

    const price =
        (balance.get(asset.address)?.price?.prices.USD ?? 0) * tokenBalance;
    const fixedPrice = price === 0 ? 0 : formatNumber(price, 2);

    const isSelected =
        type === 'pay'
            ? pay_token?.address === asset.address
            : receive_token?.address === asset.address ||
              pay_token?.address === asset.address;

    return (
        <button
            onClick={isSelected ? undefined : () => onTokenSelect(asset)}
            className={clsx(
                'mts-flex mts-items-center mts-cursor-pointer mts-mt-1 mts-rounded-lg mts-w-full mts-h-12 md:mts-h-14',
                isSelected && 'mts-opacity-50 mts-cursor-auto'
            )}
            data-testid={asset.address}
        >
            <div className="mts-flex mts-flex-grow mts-items-center mts-justify-center mts-gap-2 mts-h-full">
                <div
                    className="mts-rounded-full !mts-bg-contain mts-w-10 mts-h-10 mts-min-w-10 mts-min-h-10 mts-max-h-10 mts-max-w-10 md:mts-w-12 md:mts-h-12 md:mts-min-w-12 md:mts-min-h-12 md:mts-max-h-12 md:mts-max-w-12"
                    style={{ background: `url(${asset.image})` }}
                ></div>
                <div className="mts-flex-grow mts-h-full mts-justify-center mts-gap-1 mts-flex mts-flex-col">
                    <div className="mts-flex mts-justify-between mts-items-center mts-overflow-hidden mts-text-black dark:mts-text-white mts-font-medium mts-text-sm md:mts-text-base mts-truncate">
                        <div className="mts-flex mts-items-center mts-gap-1  mts-font-medium   ">
                            {asset.symbol}{' '}
                            <span>
                                <a
                                    href={`https://tonviewer.com/${asset.address}`}
                                    onClick={(e) => e.stopPropagation()}
                                    target="_blank"
                                    className="mts-flex mts-items-center mts-opacity-50 mts-text-inherit mts-no-underline"
                                >
                                    <Link className="mts-text-xs" />
                                </a>
                            </span>
                            {asset.warning && (
                                <div className="mts-text-xs mts-bg-primary-100 mts-rounded-full mts-px-2 mts-text-primary-500 mts-border-primary-200 dark:mts-bg-primary-900 dark:mts-border-primary-700 mts-border-[1px]">
                                    {t('community')}
                                </div>
                            )}
                        </div>
                        <div>{tokenBalance}</div>
                    </div>
                    <div className="mts-flex mts-justify-between mts-items-center mts-opacity-50 mts-text-black dark:mts-text-white mts-text-xs md:mts-text-sm mts-gap-2 ">
                        <div className="mts-flex mts-items-center mts-gap-0.5">
                            <span className="mts-break-all mts-line-clamp-1 mts-truncate mts-whitespace-pre-wrap">
                                {asset.name}
                            </span>
                            {asset.address !== TON_ADDR && (
                                <span className="mts-flex mts-items-center mts-gap-0.5">
                                    | <TokenTon /> {asset.liquidity_text ?? 0}
                                </span>
                            )}
                        </div>
                        <div>{fixedPrice}$</div>
                    </div>
                </div>
                <div>
                    <div
                        className={cn(
                            'mts-opacity-20 mts-transition-transform mts-duration-200 mts-ease-in-out mts-text-black mts-text-2xl dark:mts-text-white',
                            isTokenFav &&
                                'mts-opacity-100 mts-text-primary-500 dark:mts-text-primary-500'
                        )}
                    >
                        {isTokenFav ? (
                            <PiStarFill
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromFav(asset.address);
                                }}
                            />
                        ) : (
                            <PiStarBold
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToFav(asset.address);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default Token;
