import type { SVGProps } from "react";

export function TokenTon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                d="m21.624 6.688l-8.718 13.883a1.176 1.176 0 0 1-1.566.4a1.2 1.2 0 0 1-.428-.406L2.365 6.682A2.46 2.46 0 0 1 2 5.388a2.547 2.547 0 0 1 2.582-2.506H19.43C20.847 2.882 22 4 22 5.382c0 .46-.13.912-.377 1.306m-17.16-.464l6.36 9.805V5.235H5.128c-.658 0-.953.436-.664.989m8.712 9.805l6.36-9.805c.293-.553-.007-.989-.665-.989h-5.695z"
            ></path>
        </svg>
    );
}
