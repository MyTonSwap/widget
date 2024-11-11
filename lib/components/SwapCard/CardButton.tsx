import { FC, PropsWithChildren } from "react";
import clsx from "clsx";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./CardButton.scss";
import { useOptionsStore } from "../../store/options.store";
import { useTranslation } from "react-i18next";
type CardButtonProps = {
    isLoading: boolean;
    onClick: () => void;
    type: "pay" | "receive";
};

const CardButton: FC<CardButtonProps & PropsWithChildren> = ({
    children,
    isLoading,
    type,
    onClick,
}) => {
    const { t } = useTranslation();
    const { options } = useOptionsStore();
    const isDisabled = (() => {
        if (type === "pay" && options.lock_pay_token) return true;
        if (type === "receive" && options.lock_receive_token) return true;
        return false;
    })();
    return (
        <button
            disabled={isDisabled}
            onClick={isDisabled ? () => {} : onClick}
            {...{
                ...(isLoading && type === "pay"
                    ? { "data-skeleton": true }
                    : {}),
            }}
            data-testid={`card-button-${type}`}
            className={clsx(
                "selection-box-container",
                isLoading && "loading",
                type === "pay" && isLoading && "pay-loading",
                type === "receive" && isLoading && "receive-loading"
            )}
            style={{
                ...(isDisabled && { opacity: 0.7, cursor: "auto" }),
                ...(isLoading && type === "pay"
                    ? { color: `var(--text-black-color)` }
                    : {
                          background: `var(--input-token-color)`,
                          color: `var(--text-black-color)`,
                      }),
                ...{
                    "--skeleton-bg": `var(--input-token-color)`,
                    "--skeleton-shine": `var(--skeleton-shine-color)`,
                },
            }}
        >
            {!isLoading ? (
                children
            ) : type === "receive" ? (
                <>
                    {t("select")}{" "}
                    <div>
                        <MdKeyboardArrowDown />
                    </div>
                </>
            ) : (
                ""
            )}
        </button>
    );
};

export default CardButton;
