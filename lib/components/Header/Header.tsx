import SettingPopover from './SettingPopover';
import './Header.scss';
import { useOptionsStore } from '../../store/options.store';
import Refresh from '../Common/Refresh';
import { useSwapStore } from '../../store/swap.store';
import { useTranslation } from 'react-i18next';
import Setting from '../icons/Setting';
const Header = () => {
    const { t } = useTranslation();
    const { options } = useOptionsStore();
    const { isFindingBestRoute, receive_token, refetchBestRoute } =
        useSwapStore();

    return (
        <div className="mts-flex mts-justify-between mts-items-center mts-px-1 mts-text-primary-950 mts-font-bold mts-text-lg">
            <div data-testid="swap-header-title">{t('swap')}</div>
            <div className="mts-flex mts-items-center mts-gap-2">
                {options.ui_preferences?.show_refresh && (
                    <div
                        className="mts-w-6 mts-h-6 mts-cursor-pointer"
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
                        <Setting className="mts-text-primary-950 mts-text-2xl" />
                    </SettingPopover>
                )}
            </div>
        </div>
    );
};

export default Header;
