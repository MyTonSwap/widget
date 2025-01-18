import { Asset, fromNano } from '@mytonswap/sdk';
import { useWalletStore } from '../../store/wallet.store';
import { FC } from 'react';
import formatNumber from '../../utils/formatNum';
import './Token.scss';
import { RiExternalLinkLine } from 'react-icons/ri';
import { PiStarBold, PiStarFill } from 'react-icons/pi';
import { TokenTon } from '../icons/TokenTon';
import { TON_ADDR } from '../../constants';
import { toFixedDecimal } from '../../utils/toFixedDecimals';
import { useFavoriteStore } from '../../store/favtorite.store';
import clsx from 'clsx';
import { useSwapStore } from '../../store/swap.store';

type TokenProps = {
    asset: Asset;
    onTokenSelect: (asset: Asset) => void;
    type: 'pay' | 'receive';
};

const Token: FC<TokenProps> = ({ asset, onTokenSelect, type }) => {
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
        <div
            onClick={isSelected ? undefined : () => onTokenSelect(asset)}
            className={clsx(
                'mts-flex mts-items-center mts-cursor-pointer mts-mt-1 mts-rounded-lg mts-px-2 mts-w-full mts-h-12',
                isSelected && 'mts-opacity-50 mts-cursor-auto'
            )}
            data-testid={asset.address}
        >
            <div className="mts-flex mts-flex-grow mts-items-center mts-gap-2">
                <div
                    className="mts-rounded-full !mts-bg-contain mts-w-11 mts-h-11"
                    style={{ background: `url(${asset.image})` }}
                ></div>
                <div className="mts-flex-grow">
                    <div className="mts-flex mts-justify-between mts-items-center mts-overflow-hidden mts-text-black mts-font-medium mts-text-base mts-truncate">
                        <div className="mts-flex mts-items-center mts-gap-0.5 mts-text-base">
                            {asset.symbol}{' '}
                            <span>
                                <a
                                    href={`https://tonviewer.com/${asset.address}`}
                                    onClick={(e) => e.stopPropagation()}
                                    target="_blank"
                                    className="mts-flex mts-items-center mts-opacity-50 mts-text-inherit mts-no-underline"
                                >
                                    <RiExternalLinkLine />
                                </a>
                            </span>
                        </div>
                        <div>{tokenBalance}</div>
                    </div>
                    <div className="mts-flex mts-justify-between mts-items-center mts-opacity-50 mts-text-black mts-text-xs">
                        <div className="mts-flex mts-items-center mts-gap-0.5">
                            {asset.name}
                            {asset.address !== TON_ADDR && (
                                <span className="mts-flex mts-items-center mts-gap-0.5">
                                    | <TokenTon /> {asset.liquidity_text}
                                </span>
                            )}
                        </div>
                        <div>{fixedPrice}$</div>
                    </div>
                </div>
                <div>
                    <div
                        className={clsx(
                            'mts-opacity-50 mts-transition-transform mts-duration-200 mts-ease-in-out mts-text-black mts-text-2xl',
                            isTokenFav && 'mts-opacity-100 mts-text-primary-500'
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
        </div>
    );
};

export default Token;
