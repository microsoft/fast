import React from "react";
import { Direction } from "@microsoft/fast-web-utilities";
import { accentColor, toggleStyle } from "../style";
import { DirectionSwitchProps } from "./direction-switch.props";

export const DirectionSwitch: React.FC<DirectionSwitchProps> = ({
    className,
    id,
    direction,
    onUpdateDirection,
    disabled,
}: React.PropsWithChildren<DirectionSwitchProps>): React.ReactElement => {
    return (
        <button
            className={className}
            onClick={onUpdateDirection}
            title={"Toggle direction"}
            style={toggleStyle}
            disabled={disabled}
        >
            <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.1667 8.99967C13.4428 8.99967 13.6667 9.22354 13.6667 9.49967C13.6667 9.77581 13.4428 9.99967 13.1667 9.99967H6.16667C5.89053 9.99967 5.66667 9.77581 5.66667 9.49967C5.66667 9.22354 5.89053 8.99967 6.16667 8.99967H13.1667ZM13.1667 4.66634C13.4428 4.66634 13.6667 4.89021 13.6667 5.16634C13.6667 5.41946 13.4786 5.62867 13.2345 5.66178L13.1667 5.66634H0.833332C0.557192 5.66634 0.333332 5.44247 0.333332 5.16634C0.333332 4.91322 0.521437 4.70402 0.765485 4.67091L0.833332 4.66634H13.1667ZM13.1667 0.333008C13.4428 0.333008 13.6667 0.556868 13.6667 0.833008C13.6667 1.10915 13.4428 1.33301 13.1667 1.33301H2.83333C2.55719 1.33301 2.33333 1.10915 2.33333 0.833008C2.33333 0.556868 2.55719 0.333008 2.83333 0.333008H13.1667Z"
                    fill={`${direction === Direction.rtl ? accentColor : "white"}`}
                />
            </svg>
        </button>
    );
};

export * from "./direction-switch.props";
