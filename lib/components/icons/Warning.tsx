import { FC } from 'react';

type WarningProps = {
    className?: string;
};

const Warning: FC<WarningProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            className={className}
            viewBox="0 0 24 24"
        >
            <g fill="none">
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth={1.5}
                    d="M6.31 9C8.594 5 9.967 3 12 3c2.31 0 3.77 2.587 6.688 7.762l.364.644c2.425 4.3 3.638 6.45 2.542 8.022S17.786 21 12.364 21h-.728c-5.422 0-8.134 0-9.23-1.572c-.951-1.364-.163-3.165 1.648-6.428M12 8v5"
                ></path>
                <circle cx={12} cy={16} r={1} fill="currentColor"></circle>
            </g>
        </svg>
    );
};

export default Warning;
