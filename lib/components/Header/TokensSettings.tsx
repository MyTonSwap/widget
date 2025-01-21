import { useSwapStore } from '../../store/swap.store';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

const TokensSettings = () => {
    const { t } = useTranslation();
    const { communityTokens, setCommunityTokens } = useSwapStore();
    return (
        <div className="mts-flex mts-justify-between mts-items-center mts-px-1 mts-text-xs md:mts-text-sm">
            <div className="mts-text-zinc-600 mts-text-lg ">
                <span>{t('community_tokens')}</span>
            </div>
            <div>
                <button
                    className={cn(
                        'mts-flex mts-relative mts-justify-start mts-items-center mts-transition-all mts-duration-300 mts-rounded-full mts-bg-zinc-100 mts-p-1 mts-w-12 mts-h-6 mts-shadow-[0px_0px_0px_4px_rgb(var(--mts-primary-100))]',

                        communityTokens ? 'mts-bg-primary-500' : ''
                    )}
                    onClick={() => setCommunityTokens(!communityTokens)}
                    data-testid="community-token-setting"
                >
                    <div
                        className={cn(
                            'mts-absolute mts-transition-all mts-duration-300 mts-ease mts-rounded-full mts-w-4 mts-h-4',
                            communityTokens
                                ? 'mts-left-7 mts-bg-white'
                                : 'mts-left-1 mts-bg-primary-500'
                        )}
                    ></div>
                </button>
            </div>
        </div>
    );
};

export default TokensSettings;
