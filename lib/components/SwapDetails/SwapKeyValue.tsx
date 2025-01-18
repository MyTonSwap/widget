import { FC, ReactNode } from 'react';
type SwapKeyValueProps = {
    keyText: ReactNode;
    value: ReactNode;
};

const SwapKeyValue: FC<SwapKeyValueProps> = ({ keyText, value }) => {
    return (
        <div className="mts-flex mts-justify-between mts-items-center mts-font-medium mts-text-sm mts-font-inter">
            <div className="mts-opacity-60 mts-text-black">{keyText}</div>
            <div className="mts-text-black">{value}</div>
        </div>
    );
};

export default SwapKeyValue;
