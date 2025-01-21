import { FC } from 'react';

type Props = {
    className?: string;
};

const Link: FC<Props> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            className={className}
            viewBox="0 0 24 24"
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={1.5}
            >
                <path
                    strokeLinejoin="round"
                    d="m13 11l9-9m0 0h-5.344M22 2v5.344"
                ></path>
                <path
                    d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2"
                    opacity={0.5}
                ></path>
            </g>
        </svg>
    );
};

export default Link;
