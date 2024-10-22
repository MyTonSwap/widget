import { Asset, fromNano } from "@mytonswap/sdk";
import { useThemeStore } from "../../store/theme.store";
import { useWalletStore } from "../../store/wallet.store";
import { FC } from "react";
import formatNumber from "../../utils/formatNum";
import "./Token.scss";
import { RiExternalLinkLine } from "react-icons/ri";

import { TokenTon } from "../../icons/TokenTon";
import { TON_ADDR } from "../../constants";
type TokenProps = {
    asset: Asset;
    onTokenSelect: (asset: Asset) => void;
};

const Token: FC<TokenProps> = ({ asset, onTokenSelect }) => {
    const { balance } = useWalletStore();
    const { colors } = useThemeStore();
    const tokenBalance = +fromNano(
        balance.get(asset.address)?.balance ?? 0,
        asset.decimal
    );
    const price =
        (balance.get(asset.address)?.price?.prices.USD ?? 0) * tokenBalance;
    const fixedPrice = price === 0 ? 0 : formatNumber(price, 2);
    return (
        <div onClick={() => onTokenSelect(asset)} className="token-container">
            <div className="token-content">
                <div
                    className="token-image "
                    style={{ background: `url(${asset.image})` }}
                ></div>
                <div className="token-details">
                    <div
                        className="token-details-symbol-balance"
                        style={{ color: colors.text_black }}
                    >
                        <div className="symbol">
                            {asset.symbol}{" "}
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
                    <div
                        className="token-details-name-rate"
                        style={{
                            color: colors.text_black,
                            opacity: 0.5,
                        }}
                    >
                        <div className="line-clamp-1">
                            {asset.name}
                            {asset.address !== TON_ADDR && (
                                <span>
                                    | <TokenTon /> {asset.liquidity_text}
                                </span>
                            )}
                        </div>
                        <div>{fixedPrice}$</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Token;
