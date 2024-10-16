import { IoSettingsOutline } from "react-icons/io5";
import SettingPopover from "./SettingPopover";
import { useThemeStore } from "../../store/theme.store";

const Header = () => {
    const { colors } = useThemeStore();

    return (
        <div
            className="flex items-center justify-between px-3"
            style={{ color: colors.text_black }}
        >
            <div>Swap</div>
            <div className="flex gap-x-2 items-center">
                <SettingPopover>
                    <IoSettingsOutline
                        className="hover:rotate-90 transition-transform duration-150 text-lg text-black/50"
                        style={{
                            color: colors.text_black,
                            opacity: 0.5,
                        }}
                    />
                </SettingPopover>
            </div>
        </div>
    );
};

export default Header;
