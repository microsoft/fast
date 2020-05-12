import React from "react";
import { Label } from "@microsoft/fast-components-react-msft";
import { selectorStyle } from "../style";
import { AccentColorPickerProps } from "./accent-color-picker.props";

export const AccentColorPicker: React.FC<AccentColorPickerProps> = ({
    accentBaseColor,
    onAccentColorPickerChange,
    id,
}: React.PropsWithChildren<AccentColorPickerProps>): React.ReactElement => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Label htmlFor={id} style={selectorStyle}>
                Accent color
            </Label>
            <input
                type={"color"}
                id={id}
                value={accentBaseColor}
                onChange={onAccentColorPickerChange}
                style={{
                    padding: "0",
                    background: "#454545",
                    width: "22px",
                    height: "22px",
                    border: "none",
                }}
            />
        </div>
    );
};

export * from "./accent-color-picker.props";
