import { fromNano } from "@mytonswap/sdk";
import { TON_ADDR } from "../../constants";
import { useThemeStore } from "../../store/theme.store";
import { useWalletStore } from "../../store/wallet.store";
import "./Wallet.scss";
import formatNumber from "../../utils/formatNum";
import shortAddress from "../../utils/shortAddress";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
// import { useTonConnectUI } from "@tonconnect/ui-react";

const Wallet = () => {
    // make function and state for copy to clipboard address button
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

    const { wallet, balance, disconnect } = useWalletStore();
    // const [tc] = useTonConnectUI();
    const handleDisconnect = async () => {
        // await tc.disconnect();
        disconnect();
    };
    const { colors } = useThemeStore();
    const TON_BALANCE = formatNumber(
        +fromNano(balance.get(TON_ADDR)?.balance || 0n),
        4,
        false
    );

    return (
        <>
            {wallet && (
                <div
                    className="wallet-card"
                    style={{ background: colors.light_shade }}
                >
                    <p className="title">Account</p>
                    <div className="wallet-content">
                        <p className="balance-title">Balance</p>
                        <div
                            className="balance-amount"
                            style={{ color: colors.primary }}
                        >
                            {TON_BALANCE}TON
                        </div>
                        <div className="address-section">
                            <div
                                className="address"
                                style={{ background: colors.background }}
                            >
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
                                style={{
                                    background: colors.background,
                                    color: colors.text_black,
                                }}
                            >
                                {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                            <a
                                className="wallet-icon"
                                target="_blank"
                                href={`https://tonviewer.com/${wallet.account.address}`}
                                style={{
                                    background: colors.background,
                                    color: colors.text_black,
                                }}
                            >
                                <MdArrowOutward />
                            </a>
                        </div>
                        <button
                            className="disconnect-wallet"
                            onClick={handleDisconnect}
                            style={{
                                background: colors.primary,
                                color: colors.text_black,
                            }}
                        >
                            Disconnect Wallet
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Wallet;
