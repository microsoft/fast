import React from "react";
import { accentColor, toggleStyle } from "../style";
import { TransparencyToggleProps } from "./transparency-toggle.props";

export const TransparencyToggle: React.FC<TransparencyToggleProps> = ({
    className,
    id,
    transparency,
    onUpdateTransparency,
    disabled,
}: React.PropsWithChildren<TransparencyToggleProps>): React.ReactElement => {
    return (
        <button
            className={className}
            onClick={onUpdateTransparency}
            title={"Toggle transparency"}
            style={toggleStyle}
            disabled={disabled}
        >
            <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M14 3H16V14H3V12H14V3ZM13 11H0V0H13V11ZM4 9.38281L4.61719 10H6.38281L4 7.61719V9.38281ZM4 6.38281L7.61719 10H9.38281L4 4.61719V6.38281ZM10.6172 10H12V9.61719L6.38281 4H4.61719L10.6172 10ZM9.38281 4H7.61719L12 8.38281V6.61719L9.38281 4ZM12 5.38281V4H10.6172L12 5.38281ZM1 10H3V3H12V1H1V10Z"
                    fill={`${transparency ? accentColor : "white"}`}
                />
            </svg>
        </button>
    );
};
