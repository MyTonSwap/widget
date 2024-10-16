import { ChangeEvent, CSSProperties, FC, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import CardDialog from "./CardDialog";
import { useThemeStore } from "../../store/theme.store";
import { useSwapStore } from "../../store/swap.store";
import { Asset, BestRoute, fromNano } from "@mytonswap/sdk";
import formatNumber from "../../utils/formatNum";
import CardButton from "./CardButton";
import { toNano } from "@mytonswap/sdk";
import { useWalletStore } from "../../store/wallet.store";
import { TON_ADDR } from "../../constants";

type CardProps = {
    type: "pay" | "receive";
};

const Card: FC<CardProps> = ({ type }) => {
    const [isSelectVisible, setIsSelectVisible] = useState(false);
    const [typingTimeout, setTypingTimeout] =
        useState<ReturnType<typeof setTimeout>>();
    const [userInput, setUserInput] = useState("");
    const { colors } = useThemeStore();
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

    const value =
        type === "pay" ? userInput : bestRoute?.pool_data.receive_show ?? 0;

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
        bestRoute?.pool_data.receive_show
            ? formatNumber(
                  Number(bestRoute.pool_data.receive_show) * tokenRate,
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
        const decimalRegexp = /^\d*(?:\.\d{0,2})?$/; // Allow up to 2 decimal places

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

    const balanceToken = pay_token ? balance.get(pay_token.address) : null;

    const handleMaxClick = () => {
        if (!balanceToken || !pay_token) return;
        setUserInput(
            formatNumber(
                +fromNano(balanceToken?.balance, pay_token?.decimal),
                2
            )
        );
        let payAmount = BigInt(balanceToken.balance);
        if (pay_token.address === TON_ADDR) {
            payAmount = payAmount - toNano(0.4);
        }
        setPayAmount(payAmount);
    };

    return (
        <>
            <div className="w-full flex flex-col gap-y-1 text-xs">
                <div className="flex items-center justify-between px-1">
                    <span
                        className=""
                        style={{
                            color: colors.text_black,
                            opacity: 0.7,
                        }}
                    >
                        You {type === "pay" ? "Pay" : "Receive"}
                    </span>
                    {type === "pay" && balanceToken ? (
                        <span
                            className="cursor-pointer"
                            onClick={handleMaxClick}
                            style={{ color: colors.text_black }}
                        >
                            <span
                                className=""
                                style={{ color: colors.primary }}
                            >
                                Max:{" "}
                            </span>
                            {formatNumber(
                                +fromNano(
                                    balanceToken.balance,
                                    pay_token!.decimal
                                ),
                                2
                            )}{" "}
                            {pay_token?.symbol}
                        </span>
                    ) : (
                        ""
                    )}
                </div>
                <div
                    className="grid grid-cols-swapcard w-full rounded-lg px-2 py-2 "
                    style={{ background: colors.background }}
                >
                    <div className="flex flex-col">
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
                                disabled={type === "receive"}
                                onChange={handlePayAmountChange}
                                pattern="^[0-9]*[.,]?[0-9]*$"
                                placeholder="0"
                                className="outline-none bg-transparent w-full"
                                style={{ color: colors.text_black }}
                            />
                        )}
                        {type === "receive" && isFindingBestRoute && (
                            <div
                                className="h-4 my-1 w-24 rounded-md"
                                data-skeleton
                                style={{
                                    ...({
                                        "--skeleton-bg": colors.input_token,
                                        "--skeleton-shine":
                                            colors.skeleton_shine,
                                    } as CSSProperties),
                                }}
                            />
                        )}
                        {((type === "receive" && !isFindingBestRoute) ||
                            type === "pay") && (
                            <span
                                className="text-xs"
                                style={{
                                    color: colors.text_black,
                                    opacity: 0.5,
                                }}
                            >
                                {calculatedRate}$
                            </span>
                        )}
                        {type === "receive" && isFindingBestRoute && (
                            <div
                                className="h-3 my-[2px] w-12 rounded-md"
                                data-skeleton
                                style={{
                                    ...({
                                        "--skeleton-bg": colors.input_token,
                                        "--skeleton-shine":
                                            colors.skeleton_shine,
                                    } as CSSProperties),
                                }}
                            />
                        )}
                    </div>
                    <div className="flex items-center ">
                        <CardButton
                            type={type}
                            onClick={() => setIsSelectVisible(true)}
                            isLoading={isLoading || !token}
                        >
                            <div
                                className="h-6 w-6 rounded-full !bg-contain"
                                style={{
                                    background: `url(${token?.image})`,
                                }}
                            ></div>
                            <div>{token?.symbol}</div>
                            <div>
                                <MdKeyboardArrowDown />
                            </div>
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
