import { FC, PropsWithChildren, useRef, useState } from 'react';
import SlippageSetting from './SlippageSetting';
import { useOnClickOutside } from 'usehooks-ts';
import TokensSettings from './TokensSettings';
import { AnimatePresence, motion } from 'framer-motion';

import './SettingPopover.scss';
import Wallet from './Wallet';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@uidotdev/usehooks';
import { modalAnimationDesktop, modalAnimationMobile } from '../../constants';
import { IoClose } from 'react-icons/io5';

export type SettingPopoverProps = PropsWithChildren & {};

const SettingPopover: FC<SettingPopoverProps> = ({ children }) => {
    const { t } = useTranslation();
    // const direction = i18n.getResourceBundle(
    //     i18n.resolvedLanguage!,
    //     "direction"
    // );
    const { options } = useOptionsStore();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const onClickOutSite = () => {
        setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };
    useOnClickOutside(ref, onClickOutSite);
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };
    const handleCloseSetting = () => {
        setIsOpen(false);
    };
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const modalAnimation = isDesktop
        ? modalAnimationDesktop
        : modalAnimationMobile;
    return (
        <div className="mts-flex mts-relative mts-items-center mts-z-[2]">
            <button
                onClick={handleButtonClick}
                data-testid="setting-button"
                className="mts-flex mts-justify-center mts-items-center"
            >
                {children}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.15 }}
                        className="mts-fixed mts-top-0 mts-left-0 mts-bg-black/50 mts-w-full mts-h-full"
                    >
                        <motion.div
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
                            transition={{ ease: 'easeOut', duration: 0.15 }}
                            ref={ref}
                            className="mts-flex mts-fixed mts-bottom-0 mts-left-0 mts-flex-col mts-gap-3 mts-shadow-sm mts-rounded-t-2xl mts-bg-zinc-100 mts-p-4 mts-w-full mts-min-w-60 mts-h-fit mts-text-primary-950 rtl:mts-right-auto rtl:left-0 md:mts-min-w-80 md:mts-max-w-[32.5rem] md:mts-rounded-2xl"
                            data-testid="setting-popover"
                        >
                            <div className="mts-flex mts-items-center mts-justify-between">
                                <div>{t('setting')}</div>
                                <button
                                    onClick={handleCloseSetting}
                                    className="mts-text-primary-950"
                                >
                                    <IoClose />
                                </button>
                            </div>

                            {options.ui_preferences?.show_settings_slippage && (
                                <SlippageSetting />
                            )}
                            {options.ui_preferences
                                ?.show_settings_community && <TokensSettings />}
                            {options.ui_preferences?.show_settings_wallet && (
                                <Wallet />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingPopover;
