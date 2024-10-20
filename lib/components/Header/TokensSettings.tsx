import clsx from "clsx";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
import "./TokensSettings.scss";
const TokensSettings = () => {
    const { colors } = useThemeStore();
    const { communityTokens, setCommunityTokens } = useSwapStore();
    return (
        <div className="token-setting-container">
            <div style={{ color: colors.text_black }}>
                <span>Community Tokens</span>
            </div>
            <div>
                <button
                    className={clsx(
                        "checkbox",
                        communityTokens ? "bg-green-600" : "bg-zinc-100"
                    )}
                    style={{
                        background: communityTokens
                            ? colors.primary
                            : colors.light_shade,
                    }}
                    onClick={() => setCommunityTokens(!communityTokens)}
                >
                    <div
                        className={clsx(
                            "checkbox-inner",
                            communityTokens
                                ? "checkbox-inner-active"
                                : "checkbox-inner-inactive"
                        )}
                        style={{
                            background: !communityTokens
                                ? colors.primary
                                : colors.background,
                        }}
                    ></div>
                </button>
            </div>
        </div>
    );
};

export default TokensSettings;
