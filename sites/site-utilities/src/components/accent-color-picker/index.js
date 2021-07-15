import React from "react";
import { labelStyle } from "../style";
export const AccentColorPicker = ({
    accentBaseColor,
    onAccentColorPickerChange,
    id,
    disabled,
}) => {
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
