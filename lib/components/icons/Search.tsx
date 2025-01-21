import React from 'react';

type Props = {
    className?: string;
};

const Search = ({ className }: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            className={className}
            viewBox="0 0 24 24"
        >
            <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx={11.5} cy={11.5} r={9.5}></circle>
                <path strokeLinecap="round" d="M18.5 18.5L22 22"></path>
            </g>
        </svg>
    );
};

export default Search;
