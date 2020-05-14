import React from "react";
import { Label, Toggle } from "@microsoft/fast-components-react-msft";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { selectorStyle } from "../style";
import { ThemeSelectorProps } from "./theme-selector.props";

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    id,
    theme,
    onUpdateTheme,
    disabled,
}: React.PropsWithChildren<ThemeSelectorProps>): React.ReactElement => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Label htmlFor={id} style={selectorStyle}>
                Dark mode
            </Label>
            <Toggle
                inputId={id}
                onClick={onUpdateTheme}
                selectedMessage={""}
                unselectedMessage={""}
                statusMessageId={"theme"}
                selected={theme === StandardLuminance.DarkMode}
                disabled={disabled}
            />
        </div>
    );
};

export * from "./theme-selector.props";
