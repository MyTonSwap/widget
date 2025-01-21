import { FC } from 'react';

type Props = {
    className?: string;
};

const Menu: FC<Props> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={'1em'}
            height={'1em'}
            className={className}
            viewBox="0 0 24 24"
        >
            <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx={5} cy={12} r={2}></circle>
                <circle cx={12} cy={12} r={2} opacity={0.5}></circle>
                <circle cx={19} cy={12} r={2}></circle>
            </g>
        </svg>
    );
};

export default Menu;
