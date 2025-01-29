import { FC, useEffect, useRef, useState } from 'react';
import { useWalletStore } from '../../store/wallet.store';
import { ConnectedWallet, TonConnectUI } from '@tonconnect/ui-react';
import shortAddress from '../../utils/shortAddress';

import './WalletProfile.scss';
import '../Header/SettingPopover.scss';
import '../Swap/Swap.scss';

import { AnimatePresence, motion } from 'framer-motion';
import Wallet from '../Header/Wallet';
import { useOnClickOutside } from 'usehooks-ts';
import { popOverVariationsKeyValue } from '../../constants';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';
export type WalletProfileProps = {
    tonConnectInstance: TonConnectUI;
    position?: keyof typeof popOverVariationsKeyValue;
    theme?: {
        text_white_color?: string;
        text_black_color?: string;
        primary_color?: string;
        background_color?: string;
        background_shade_color?: string;
        border_color?: string;
    };
};

export const WalletProfile: FC<WalletProfileProps> = ({
    tonConnectInstance,
    position = 'top-right',
}) => {
    const { setWallet, disconnect, wallet } = useWalletStore();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const buttonRef = useRef(null);
    useOnClickOutside([ref, buttonRef], () => {
        setIsOpen(false);
    });

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleConnectWallet = () => {
        tonConnectInstance.openModal();
    };

    useEffect(() => {
        const handleStatusChange = (wallet: ConnectedWallet | null) => {
            if (wallet) {
                setWallet(wallet);
            } else {
                disconnect();
            }
        };

        tonConnectInstance.onStatusChange(handleStatusChange);

        if (tonConnectInstance.wallet) {
            setWallet(tonConnectInstance.wallet);
        } else {
            disconnect();
        }
    }, [tonConnectInstance, setWallet, disconnect]);

    const popOverAnimationVariation = popOverVariationsKeyValue[position];
    return (
        <div className="mts-relative">
            <div
                className={cn(
                    `mts-cursor-pointer mts-border mts-rounded-full mts-bg-primary-500 mts-px-3 mts-py-2 mts-text-white mts-font-medium mts-text-sm mts-select-none`,
                    wallet && 'mts-bg-dark-100 mts-text-black'
                )}
                onClick={wallet ? handleButtonClick : handleConnectWallet}
                ref={buttonRef}
            >
                {wallet
                    ? shortAddress(wallet.account.address, 'mainnet', 4)
                    : t('button_text.connect_wallet')}
            </div>

            <AnimatePresence>
                {wallet && isOpen && (
                    <motion.div
                        initial={popOverAnimationVariation.initial}
                        exit={popOverAnimationVariation.exit}
                        animate={popOverAnimationVariation.animate}
                        transition={{ ease: 'easeOut', duration: 0.15 }}
                        ref={ref}
                        className="mts-absolute mts-shadow-lg mts-rounded-xl mts-bg-modal-background-color mts-p-1 mts-min-w-[15.625rem] mts-w-full  mts-h-fit mts-text-text-black-color"
                    >
                        <Wallet isWalletPopover />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletProfile;
