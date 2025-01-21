import { FC, ReactNode } from 'react';
type SwapKeyValueProps = {
    keyText: ReactNode;
    value: ReactNode;
};

const SwapKeyValue: FC<SwapKeyValueProps> = ({ keyText, value }) => {
    return (
        <div className="mts-flex mts-justify-between mts-items-center mts-font-medium mts-text-xs mts-font-inter">
            <div className=" mts-text-primary-900">{keyText}</div>
            <div className="mts-text-primary-900/70">{value}</div>
        </div>
    );
};

export default SwapKeyValue;
