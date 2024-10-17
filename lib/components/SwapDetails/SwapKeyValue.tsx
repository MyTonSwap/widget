import { FC, ReactNode } from "react";
import { useThemeStore } from "../../store/theme.store";
import "./SwapKeyValue.scss";
type SwapKeyValueProps = {
    keyText: ReactNode;
    value: ReactNode;
};

const SwapKeyValue: FC<SwapKeyValueProps> = ({ keyText, value }) => {
    const { colors } = useThemeStore();
    return (
        <div className="details-key-value" style={{ color: colors.text_fade }}>
            <div style={{ color: colors.text_black }}>{keyText}</div>
            <div>{value}</div>
        </div>
    );
};

export default SwapKeyValue;
