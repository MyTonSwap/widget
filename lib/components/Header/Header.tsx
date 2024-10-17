import { IoSettingsOutline } from "react-icons/io5";
import SettingPopover from "./SettingPopover";
import { useThemeStore } from "../../store/theme.store";
import "./Header.scss";
const Header = () => {
    const { colors } = useThemeStore();

    return (
        <div className="header-container" style={{ color: colors.text_black }}>
            <div>Swap</div>
            <div className="header-setting">
                <SettingPopover>
                    <IoSettingsOutline
                        className="setting-icon"
                        style={{ color: colors.text_black }}
                    />
                </SettingPopover>
            </div>
        </div>
    );
};

export default Header;
