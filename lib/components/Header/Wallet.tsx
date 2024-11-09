import { fromNano } from "@mytonswap/sdk";
import { TON_ADDR } from "../../constants";
import { useWalletStore } from "../../store/wallet.store";
import "./Wallet.scss";
import formatNumber from "../../utils/formatNum";
import shortAddress from "../../utils/shortAddress";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useOptionsStore } from "../../store/options.store";
import { useTranslation } from "react-i18next";
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
                <div className="wallet-card">
                    <p className="title">{t("account")}</p>
                    <div className="wallet-content">
                        <p className="balance-title">{t("balance")}</p>
                        <div className="balance-amount">
                            {TON_BALANCE}
                            {t("ton")}
                        </div>
                        <div className="address-section">
                            <div className="address">
                                {shortAddress(
                                    wallet.account.address,
                                    "mainnet",
                                    4
                                )}
                            </div>
                            <button
                                className="wallet-icon"
                                disabled={copied}
                                onClick={() =>
                                    copyToClipboard(wallet.account.address)
                                }
                            >
                                {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                            <a
                                className="wallet-icon"
                                target="_blank"
                                href={`https://tonviewer.com/${wallet.account.address}`}
                            >
                                <MdArrowOutward />
                            </a>
                        </div>
                        <button
                            className="disconnect-wallet"
                            onClick={handleDisconnect}
                        >
                            {t("disconnect_wallet")}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Wallet;
