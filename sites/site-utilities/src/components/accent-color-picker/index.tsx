import React from "react";
import { labelStyle } from "../style";
import { AccentColorPickerProps } from "./accent-color-picker.props";

export const AccentColorPicker: React.FC<AccentColorPickerProps> = ({
    accentBaseColor,
    onAccentColorPickerChange,
    id,
    disabled,
}: React.PropsWithChildren<AccentColorPickerProps>): React.ReactElement => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor={id} style={labelStyle}>
                Accent color
            </label>
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
                disabled={disabled}
            />
        </div>
    );
};

export * from "./accent-color-picker.props";
