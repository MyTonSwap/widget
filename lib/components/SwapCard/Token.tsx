import { Asset, fromNano } from '@mytonswap/sdk';
import { useWalletStore } from '../../store/wallet.store';
import { FC } from 'react';
import formatNumber from '../../utils/formatNum';
import './Token.scss';
import { RiExternalLinkLine } from 'react-icons/ri';
import { PiStarBold } from 'react-icons/pi';

import { PiStarFill } from 'react-icons/pi';

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
            className={clsx('token-container', isSelected && 'selected')}
            data-testid={asset.address}
        >
            <div className="token-content">
                <div
                    className="token-image "
                    style={{ background: `url(${asset.image})` }}
                ></div>
                <div className="token-details">
                    <div className="token-details-symbol-balance">
                        <div className="symbol">
                            {asset.symbol}{' '}
                            <span>
                                <a
                                    href={`https://tonviewer.com/${asset.address}`}
                                    onClick={(e) => e.stopPropagation()}
                                    target="_blank"
                                >
                                    <RiExternalLinkLine />
                                </a>
                            </span>
                        </div>
                        <div>{tokenBalance}</div>
                    </div>
                    <div className="token-details-name-rate">
                        <div className="line-clamp-1 name-liq">
                            {asset.name}
                            {asset.address !== TON_ADDR && (
                                <span className="liq">
                                    | <TokenTon /> {asset.liquidity_text}
                                </span>
                            )}
                        </div>
                        <div>{fixedPrice}$</div>
                    </div>
                </div>
                <div>
                    <div className={clsx('fav', isTokenFav && 'faved')}>
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
