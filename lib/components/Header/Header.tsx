import { IoSettingsOutline } from "react-icons/io5";
import SettingPopover from "./SettingPopover";
import "./Header.scss";
import { useOptionsStore } from "../../store/options.store";
import Refresh from "../Common/Refresh";
import { useSwapStore } from "../../store/swap.store";
import { useTranslation } from "react-i18next";
const Header = () => {
    const { t } = useTranslation();
    const { options } = useOptionsStore();
    const { isFindingBestRoute, receive_token, refetchBestRoute } =
        useSwapStore();

    return (
        <div className="header-container">
            <div data-testid="swap-header-title">{t("swap")}</div>
            <div className="header-setting">
                {options.ui_preferences?.show_refresh && (
                    <div
                        className="loading-container"
                        onClick={refetchBestRoute}
                    >
                        <Refresh
                            isLoading={isFindingBestRoute}
                            enabled={!!receive_token}
                        />
                    </div>
                )}
                {options.ui_preferences?.show_settings && (
                    <SettingPopover>
                        <IoSettingsOutline className="setting-icon" />
                    </SettingPopover>
                )}
            </div>
        </div>
    );
};

export default Header;
