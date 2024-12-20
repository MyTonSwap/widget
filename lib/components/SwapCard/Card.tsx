import { ChangeEvent, CSSProperties, FC, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import CardDialog from "./CardDialog";
import { useSwapStore } from "../../store/swap.store";
import { Asset, BestRoute, fromNano } from "@mytonswap/sdk";
import formatNumber from "../../utils/formatNum";
import CardButton from "./CardButton";
import { toNano } from "@mytonswap/sdk";
import { useWalletStore } from "../../store/wallet.store";
import { TON_ADDR } from "../../constants";
import "./Card.scss";
import { useOptionsStore } from "../../store/options.store";
import { useTranslation } from "react-i18next";
type CardProps = {
    type: "pay" | "receive";
};

const Card: FC<CardProps> = ({ type }) => {
    const { t } = useTranslation();
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [typingTimeout, setTypingTimeout] =
        useState<ReturnType<typeof setTimeout>>();
    const [userInput, setUserInput] = useState("");
    const {
        setPayToken,
        pay_token,
        pay_rate,
        setReceiveToken,
        receive_rate,
        pay_amount,
        receive_token,
        isLoading,
        setPayAmount,
        bestRoute,
        isFindingBestRoute,
    } = useSwapStore();
    const { balance } = useWalletStore();
    const { options } = useOptionsStore();
    const onTokenSelect = (asset: Asset) => {
        if (type === "pay") {
            setPayToken(asset);
        } else {
            setReceiveToken(asset);
        }
        setIsSelectVisible(false);
    };

    const tokenRate = (() => {
        if (type === "pay") {
            return pay_rate?.USD ?? 0;
        } else {
            return receive_rate?.USD ?? 0;
        }
    })();

    const token = (() => {
        if (type === "pay") {
            return pay_token;
        } else {
            return receive_token;
        }
    })();

    const isRouteAvailable = bestRoute && bestRoute.pool_data;

    const value =
        type === "pay"
            ? userInput
            : (isRouteAvailable && bestRoute?.pool_data.receive_show) ?? 0;

    const calculatePayRate = (payAmount: bigint, tokenRate: number) =>
        payAmount
            ? formatNumber(
                  Number(fromNano(payAmount, pay_token?.decimal)) * tokenRate,
                  4
              )
            : 0;

    const calculateReceiveRate = (
        bestRoute: BestRoute | null,
        tokenRate: number
    ) =>
        isRouteAvailable && bestRoute!.pool_data.receive_show
            ? formatNumber(
                  Number(bestRoute!.pool_data.receive_show) * tokenRate,
                  4
              )
            : 0;

    const calculatedRate =
        type === "pay"
            ? calculatePayRate(pay_amount, tokenRate)
            : calculateReceiveRate(bestRoute, tokenRate);

    const timeoutSetPayAmount = (num: bigint) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(
            setTimeout(() => {
                setPayAmount(num);
            }, 300)
        );
    };
    const handlePayAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const decimalRegexp = /^\d*(?:\.\d{0,18})?$/; // Allow up to 18 decimal places

        let userInput = e.target.value.replace(/,/g, ".");

        // Handle empty string input
        if (userInput === "") {
            setUserInput("");
            timeoutSetPayAmount(0n);
            return;
        }

        // If input matches the decimal pattern
        if (decimalRegexp.test(userInput)) {
            // Avoid leading zeros (except for values like "0." or "0.1")
            userInput = userInput.replace(/^0+(?=\d)/, "");

            // Handle case where input is exactly "0." (valid scenario)
            if (userInput === "." || userInput === "0.") {
                setUserInput("0.");
            } else {
                setUserInput(userInput);
            }

            // Update the pay amount if input is a valid number
            if (Number(userInput) > 0) {
                timeoutSetPayAmount(toNano(userInput, pay_token?.decimal));
            } else {
                timeoutSetPayAmount(0n);
            }
        }
    };

    useEffect(() => {
        if (type === "pay") {
            setUserInput(fromNano(pay_amount, pay_token?.decimal));
        }
    }, [pay_amount]);

    const balanceToken = (() => {
        if (type === "pay") {
            return pay_token ? balance.get(pay_token.address) : null;
        } else {
            return receive_token ? balance.get(receive_token.address) : null;
        }
    })();

    const handleMaxClick = () => {
        if (!balanceToken || !pay_token) return;

        let payAmount = BigInt(balanceToken.balance);
        if (pay_token.address === TON_ADDR) {
            if (payAmount <= toNano(0.2)) return;
            payAmount = payAmount - toNano(0.2);
        }
        if (payAmount === pay_amount) return;

        setUserInput(formatNumber(+fromNano(payAmount), 2));
        setPayAmount(payAmount);
    };
    const isDisabled = (() => {
        if (type === "pay" && options.lock_pay_token) return true;
        if (type === "receive" && options.lock_receive_token) return true;
        return false;
    })();
    return (
        <>
            <div className="swapcard-card">
                <div className="card-head">
                    <span data-testid="swapcard-title" className="card-title">
                        {type === "pay" ? t("you_pay") : t("you_receive")}
                    </span>
                    {type === "pay" && balanceToken ? (
                        <span className="max-button" onClick={handleMaxClick}>
                            <span className="max-text">{t("max")} : </span>
                            <span>
                                {formatNumber(
                                    +fromNano(
                                        balanceToken.balance,
                                        pay_token!.decimal
                                    ),
                                    2,
                                    false
                                )}{" "}
                                {pay_token?.symbol}
                            </span>
                        </span>
                    ) : (
                        <span className="max-button pay">
                            {balanceToken && receive_token && (
                                <span>
                                    {formatNumber(
                                        +fromNano(
                                            balanceToken.balance,
                                            receive_token!.decimal
                                        ),
                                        2,
                                        false
                                    )}{" "}
                                    {receive_token?.symbol}
                                </span>
                            )}
                        </span>
                    )}
                </div>
                <div className={`card-content ${type}`}>
                    <div className="card-inputs">
                        {((type === "receive" && !isFindingBestRoute) ||
                            type === "pay") && (
                            <input
                                type="text"
                                inputMode="decimal"
                                autoComplete="off"
                                autoCorrect="off"
                                minLength={1}
                                maxLength={14}
                                value={value ?? ""}
                                disabled={
                                    type === "receive" || options.lock_input
                                }
                                onChange={handlePayAmountChange}
                                pattern="^[0-9]*[.,]?[0-9]*$"
                                placeholder="0"
                                className={`card-input ${type}`}
                                data-testid={`swapcard-input-${type}`}
                            />
                        )}
                        {type === "receive" && isFindingBestRoute && (
                            <div
                                className="card-input-loading"
                                data-skeleton
                                style={{
                                    ...({
                                        "--skeleton-bg": `var(--input-token-color)`,
                                        "--skeleton-shine": `var(--skeleton-shine-color)`,
                                    } as CSSProperties),
                                }}
                            />
                        )}
                        {((type === "receive" && !isFindingBestRoute) ||
                            type === "pay") && (
                            <span className="card-rate">${calculatedRate}</span>
                        )}
                        {type === "receive" && isFindingBestRoute && (
                            <div
                                className="card-rate-loading"
                                data-skeleton
                                style={{
                                    ...({
                                        "--skeleton-bg": `var(--input-token-color)`,
                                        "--skeleton-shine": `var(--skeleton-shine-color)`,
                                    } as CSSProperties),
                                }}
                            />
                        )}
                    </div>
                    <div className="card-button">
                        <CardButton
                            type={type}
                            onClick={() => setIsSelectVisible(true)}
                            isLoading={isLoading || !token}
                        >
                            <div
                                className="selection-box"
                                style={{
                                    background: `url(${token?.image})`,
                                }}
                            ></div>
                            <div>{token?.symbol}</div>
                            {!isDisabled && (
                                <div className="dropdown-icon">
                                    <MdKeyboardArrowDown />
                                </div>
                            )}
                        </CardButton>
                    </div>
                </div>
            </div>
            <CardDialog
                isSelectVisible={isSelectVisible}
                setIsSelectVisible={setIsSelectVisible}
                onTokenSelect={onTokenSelect}
                type={type}
            />
        </>
    );
};

export default Card;
