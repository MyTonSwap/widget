import { fromNano } from '@mytonswap/sdk';
import { TON_ADDR } from '../../constants';
import { useWalletStore } from '../../store/wallet.store';
import './Wallet.scss';
import formatNumber from '../../utils/formatNum';
import shortAddress from '../../utils/shortAddress';
import { FaCheck, FaCopy } from 'react-icons/fa6';
import { useState } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { useOptionsStore } from '../../store/options.store';
import { useTranslation } from 'react-i18next';
// import { useTonConnectUI } from "@tonconnect/ui-react";

const Wallet = () => {
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
        <>
            {wallet && (
                <div className="mts-rounded-lg mts-p-2">
                    <p className="mts-opacity-75 mts-text-xs">{t('account')}</p>
                    <div className="mts-flex mts-flex-col">
                        <p className="mts-mt-2 mts-text-sm">{t('balance')}</p>
                        <div className="mts-my-2 mts-text-primary-500 mts-font-black mts-text-xl">
                            {TON_BALANCE}
                            {t('ton')}
                        </div>
                        <div className="mts-flex mts-items-center mts-gap-1">
                            <div className="mts-flex mts-opacity-75 mts-rounded mts-bg-zinc-100 mts-px-2 mts-py-1 mts-w-fit mts-text-sm">
                                {shortAddress(
                                    wallet.account.address,
                                    'mainnet',
                                    4
                                )}
                            </div>
                            <button
                                className="mts-flex mts-justify-center mts-items-center mts-opacity-75 mts-cursor-pointer mts-rounded mts-bg-zinc-100 mts-w-8 mts-h-8 mts-text-black mts-text-xs disabled:mts-opacity-50 disabled:mts-cursor-not-allowed"
                                disabled={copied}
                                onClick={() =>
                                    copyToClipboard(wallet.account.address)
                                }
                            >
                                {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                            <a
                                className="mts-flex mts-justify-center mts-items-center mts-opacity-75 mts-cursor-pointer mts-rounded mts-bg-zinc-100 mts-w-8 mts-h-8 mts-text-black mts-text-xs"
                                target="_blank"
                                href={`https://tonviewer.com/${wallet.account.address}`}
                            >
                                <MdArrowOutward />
                            </a>
                        </div>
                        <button
                            className="mts-flex mts-justify-center mts-items-center mts-transition-all mts-duration-300 mts-ease-in-out mts-cursor-pointer mts-mt-2 mts-rounded mts-bg-zinc-100 mts-h-10 mts-text-black mts-text-sm"
                            onClick={handleDisconnect}
                        >
                            {t('disconnect_wallet')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Wallet;
