import React from "react";

function chevron(rotate: number): (className?: string) => JSX.Element {
    return (className?: string): JSX.Element => {
        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="https://www.w3.org/2000/svg"
                className={className}
                style={{ transform: `rotate(${rotate}deg)` }}
            >
                <path d="M13.4551 10.9824L8 5.5332L2.54492 10.9824L2.01758 10.4551L8 4.4668L13.9824 10.4551L13.4551 10.9824Z" />
            </svg>
        );
    };
}

export const upChevron: ReturnType<typeof chevron> = chevron(0);
export const downChevron: ReturnType<typeof chevron> = chevron(180);
