import React from "react";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { accentColor, toggleStyle } from "../style";
import { ThemeSelectorProps } from "./theme-selector.props";

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    className,
    id,
    theme,
    onUpdateTheme,
    disabled,
}: React.PropsWithChildren<ThemeSelectorProps>): React.ReactElement => {
    return (
        <button
            className={className}
            onClick={onUpdateTheme}
            title={"Toggle theme"}
            style={toggleStyle}
            disabled={disabled}
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6.99992 13.6673C10.6818 13.6673 13.6666 10.6825 13.6666 7.00065C13.6666 3.31875 10.6818 0.333984 6.99992 0.333984C3.31802 0.333984 0.333252 3.31875 0.333252 7.00065C0.333252 10.6825 3.31802 13.6673 6.99992 13.6673ZM6.99992 12.6673V1.33398C10.1295 1.33398 12.6666 3.87104 12.6666 7.00065C12.6666 10.1303 10.1295 12.6673 6.99992 12.6673Z"
                    fill={`${
                        theme === StandardLuminance.DarkMode ? accentColor : "white"
                    }`}
                />
            </svg>
        </button>
    );
};

export * from "./theme-selector.props";
