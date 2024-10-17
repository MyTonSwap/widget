import { Asset, fromNano } from "@mytonswap/sdk";
import { useThemeStore } from "../../store/theme.store";
import { useWalletStore } from "../../store/wallet.store";
import { FC } from "react";
import formatNumber from "../../utils/formatNum";
import "./Token.scss";
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
    const fixedPrice = price === 0 ? 0 : formatNumber(price, 4);
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
                        <div>{asset.symbol}</div>
                        <div>{tokenBalance}</div>
                    </div>
                    <div
                        className="token-details-name-rate"
                        style={{
                            color: colors.text_black,
                            opacity: 0.5,
                        }}
                    >
                        <div className="line-clamp-1">{asset.name}</div>
                        <div>{fixedPrice}$</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Token;
