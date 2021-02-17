/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { FASTButton, FASTNumberField } from "@microsoft/fast-components";
import { RotateGlyph } from "../../icons/rotate";
import h from "../../web-components/pragma";
import { DimensionProps } from "./dimension.props";

FASTButton;
FASTNumberField;

export const Dimension: React.FC<DimensionProps> = ({
    width,
    height,
    onDimensionChange,
    onUpdateWidth,
    onUpdateHeight,
    onUpdateOrientation,
    disabled,
}: React.PropsWithChildren<DimensionProps>): React.ReactElement => {
    return (
        <div style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
            <fast-number-field
                value={width}
                events={{
                    input: onDimensionChange(onUpdateWidth),
                }}
                style={{
                    width: "85px",
                }}
                disabled={disabled ? "true" : undefined}
            />
            <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden={true}
                style={{ marginRight: 4, marginLeft: 4 }}
            >
                <path
                    d="M3.5 3.49997L10.5 10.5"
                    stroke="#F2F2F2"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                />
                <path
                    d="M3.5 10.5L10.5 3.49997"
                    stroke="#F2F2F2"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                />
            </svg>
            <fast-number-field
                value={height}
                events={{
                    input: onDimensionChange(onUpdateHeight),
                }}
                style={{
                    width: "85px",
                    marginRight: 4,
                }}
                disabled={disabled ? "true" : undefined}
            />
            <fast-button
                aria-label={"Rotate axis"}
                events={{
                    click: onUpdateOrientation,
                }}
                disabled={disabled ? "true" : undefined}
                style={{
                    padding: "0 6px",
                    height: "24px",
                    border: "2px solid transparent",
                    borderRadius: "2px",
                    background: "#454545",
                    minWidth: "initial",
                }}
            >
                <RotateGlyph />
            </fast-button>
        </div>
    );
};

export * from "./dimension.props";
