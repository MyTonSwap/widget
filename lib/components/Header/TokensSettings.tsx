import clsx from "clsx";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
const TokensSettings = () => {
    const { colors } = useThemeStore();
    const { communityTokens, setCommunityTokens } = useSwapStore();
    return (
        <div className="flex text-sm items-center justify-between">
            <div style={{ color: colors.text_black }}>
                <span>Community Tokens</span>
            </div>
            <div>
                <button
                    className={clsx(
                        "flex h-6 w-12  items-center justify-start p-1 rounded-full transition-all relative",
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
                            "w-4 h-4  rounded-full transition-all absolute",
                            communityTokens
                                ? "bg-white left-7"
                                : "bg-green-600 left-1"
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
