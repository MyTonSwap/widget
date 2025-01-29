import { fromNano } from '@mytonswap/sdk';
import { TON_ADDR } from '../../constants';
import { useWalletStore } from '../../store/wallet.store';
import './Wallet.scss';
import formatNumber from '../../utils/formatNum';
import shortAddress from '../../utils/shortAddress';
import { FaCheck } from 'react-icons/fa6';
import { FC, useState } from 'react';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
import Copy from '../icons/Copy';
import Link from '../icons/Link';
import { cn } from '../../utils/cn';
// import { useTonConnectUI } from "@tonconnect/ui-react";

type WalletProps = {
    isWalletPopover?: boolean;
};

const Wallet: FC<WalletProps> = ({ isWalletPopover }) => {
    // make function and state for copy to clipboard address button
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    const { tonConnectInstance } = useOptionsStore();
    const { wallet, balance, disconnect } = useWalletStore();
    const handleDisconnect = async () => {
        if (tonConnectInstance) {
            await tonConnectInstance.disconnect();
        }
        disconnect();
    };
    const TON_BALANCE = formatNumber(
        +fromNano(balance.get(TON_ADDR)?.balance || 0n),
        4,
        false
    );

    return (
        wallet && (
            <div
                className={cn(
                    'mts-flex mts-flex-col mts-gap-3 mts-w-full',
                    isWalletPopover ? 'mts-px-2 mts-pt-2 mts-pb-2' : 'mts-mt-4'
                )}
            >
                <div
                    className={cn(
                        'mts-rounded-2xl mts-p-4 mts-border-dark-200 dark:mts-bg-dark-800 dark:mts-border-dark-700 mts-bg-white dark:mts-text-white mts-border-[1px]',
                        isWalletPopover && 'mts-border-none mts-p-0'
                    )}
                >
                    <p className="mts-opacity-75 mts-font-normal mts-text-[12px]">
                        {t('account')}
                    </p>
                    <div className="mts-flex mts-flex-col">
                        <p className="mts-mt-3 mts-text-lg mts-font-medium">
                            {t('balance')}
                        </p>
                        <div className="mts-mt-2 mts-mb-1 mts-font-black mts-text-xl md:mts-text-3xl">
                            {TON_BALANCE}
                            <span className="mts-text-primary-500">
                                {t('ton')}
                            </span>
                        </div>
                        <div className="mts-flex mts-items-center mts-gap-1">
                            <div className="mts-flex mts-opacity-75 mts-rounded-lg mts-white mts-border-[1px] mts-border-dark-200 mts-px-2 mts-py-1 mts-w-fit mts-text-sm mts-font-normal mts-h-10  mts-items-center dark:mts-bg-dark-900 dark:mts-border-dark-700">
                                {shortAddress(
                                    wallet.account.address,
                                    'mainnet',
                                    4
                                )}
                            </div>
                            <button
                                className="mts-flex mts-justify-center mts-items-center mts-opacity-75 mts-cursor-pointer mts-rounded-md mts-text-white    mts-text-xs disabled:mts-opacity-50 disabled:mts-cursor-not-allowed mts-h-10 mts-w-10 mts-bg-primary-900 dark:mts-bg-primary-700"
                                disabled={copied}
                                onClick={() =>
                                    copyToClipboard(wallet.account.address)
                                }
                            >
                                {copied ? (
                                    <FaCheck />
                                ) : (
                                    <Copy className="mts-text-xl" />
                                )}
                            </button>
                            <a
                                className="mts-flex mts-justify-center mts-items-center mts-opacity-75 mts-cursor-pointer mts-rounded-md mts-text-white  mts-text-xs mts-h-10 mts-w-10 mts-bg-primary-900 dark:mts-bg-primary-700"
                                target="_blank"
                                href={`https://tonviewer.com/${wallet.account.address}`}
                            >
                                <Link className="mts-text-xl" />
                            </a>
                        </div>
                    </div>
                </div>
                <button
                    className="mts-flex mts-justify-center mts-items-center mts-transition-all mts-duration-300 mts-ease-in-out mts-cursor-pointer  mts-bg-primary-500 mts-h-11 md:mts-h-12 mts-text-white mts-border-[1px] mts-border-primary-600 mts-rounded-lg mts-text-sm "
                    onClick={handleDisconnect}
                >
                    {t('disconnect_wallet')}
                </button>
            </div>
        )
    );
};

export default Wallet;
