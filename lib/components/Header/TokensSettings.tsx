import clsx from "clsx";
import { useSwapStore } from "../../store/swap.store";
import "./TokensSettings.scss";
import { useTranslation } from "react-i18next";
const TokensSettings = () => {
    const { t } = useTranslation();
    const { communityTokens, setCommunityTokens } = useSwapStore();
    return (
        <div className="token-setting-container">
            <div className="token-setting-text">
                <span>{t("community_tokens")}</span>
            </div>
            <div>
                <button
                    className={clsx(
                        "checkbox",
                        communityTokens ? "checkbox-active" : ""
                    )}
                    onClick={() => setCommunityTokens(!communityTokens)}
                    data-testid="community-token-setting"
                >
                    <div
                        className={clsx(
                            "checkbox-inner",
                            communityTokens
                                ? "checkbox-inner-active"
                                : "checkbox-inner-inactive"
                        )}
                    ></div>
                </button>
            </div>
        </div>
    );
};

export default TokensSettings;
