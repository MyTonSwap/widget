import { FC, ReactNode } from "react";
import "./SwapKeyValue.scss";
type SwapKeyValueProps = {
    keyText: ReactNode;
    value: ReactNode;
};

const SwapKeyValue: FC<SwapKeyValueProps> = ({ keyText, value }) => {
    return (
        <div className="details-key-value">
            <div className="details-key-value-key">{keyText}</div>
            <div>{value}</div>
        </div>
    );
};

export default SwapKeyValue;
