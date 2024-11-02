import { IoSettingsOutline } from "react-icons/io5";
import SettingPopover from "./SettingPopover";
import { useThemeStore } from "../../store/theme.store";
import "./Header.scss";
import { useOptionsStore } from "../../store/options.store";
import Refresh from "../Common/Refresh";
import { useSwapStore } from "../../store/swap.store";
const Header = () => {
    const { colors } = useThemeStore();
    const { options } = useOptionsStore();
    const { isFindingBestRoute, receive_token, refetchBestRoute } =
        useSwapStore();
    return (
        <div className="header-container" style={{ color: colors.text_black }}>
            <div data-testid="swap-header-title">Swap</div>
            <div className="header-setting">
                <div className="loading-container" onClick={refetchBestRoute}>
                    <Refresh
                        isLoading={isFindingBestRoute}
                        enabled={!!receive_token}
                    />
                </div>
                {options.ui_preferences?.show_settings && (
                    <SettingPopover>
                        <IoSettingsOutline
                            className="setting-icon"
                            style={{ color: colors.text_black }}
                        />
                    </SettingPopover>
                )}
            </div>
        </div>
    );
};

export default Header;
