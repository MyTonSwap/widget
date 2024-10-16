import { FC, ReactNode } from "react";
import { useThemeStore } from "../../store/theme.store";

type SwapKeyValueProps = {
    keyText: ReactNode;
    value: ReactNode;
};

const SwapKeyValue: FC<SwapKeyValueProps> = ({ keyText, value }) => {
    const { colors } = useThemeStore();
    return (
        <div
            className="flex items-center justify-between px-1"
            style={{ color: colors.text_fade }}
        >
            <div style={{ color: colors.text_black }}>{keyText}</div>
            <div>{value}</div>
        </div>
    );
};

export default SwapKeyValue;
