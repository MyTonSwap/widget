import { FC, PropsWithChildren } from "react";
import { useThemeStore } from "../../store/theme.store";
import clsx from "clsx";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./CardButton.scss";
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
    const { colors } = useThemeStore();
    return (
        <button
            onClick={onClick}
            {...{
                ...(isLoading && type === "pay"
                    ? { "data-skeleton": true }
                    : {}),
            }}
            className={clsx(
                "selection-box-container",
                isLoading && "loading",
                type === "pay" && isLoading && "pay-loading",
                type === "receive" && isLoading && "receive-loading"
            )}
            style={{
                ...(isLoading && type === "pay"
                    ? { color: colors.text_black }
                    : {
                          background: colors.input_token,
                          color: colors.text_black,
                      }),
                ...{
                    "--skeleton-bg": colors.input_token,
                    "--skeleton-shine": colors.skeleton_shine,
                },
            }}
        >
            {!isLoading ? (
                children
            ) : type === "receive" ? (
                <>
                    SELECT{" "}
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
