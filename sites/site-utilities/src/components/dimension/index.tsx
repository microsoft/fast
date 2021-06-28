/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { fastButton, fastNumberField } from "@microsoft/fast-components";
import { RotateGlyph } from "../../icons/rotate";
import h from "../../web-components/pragma";
import { DimensionProps } from "./dimension.props";

fastButton;
fastNumberField;

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
        <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
            <fast-number-field
                value={width}
                size={6}
                events={{
                    input: onDimensionChange(onUpdateWidth),
                }}
                disabled={disabled ? "true" : undefined}
                hide-step={true}
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
                size={6}
                events={{
                    input: onDimensionChange(onUpdateHeight),
                }}
                style={{
                    marginRight: 8,
                }}
                disabled={disabled ? "true" : undefined}
                hide-step={true}
            />
            <fast-button
                aria-label={"Rotate axis"}
                events={{
                    click: onUpdateOrientation,
                }}
                disabled={disabled ? "true" : undefined}
            >
                {RotateGlyph()}
            </fast-button>
        </div>
    );
};

export * from "./dimension.props";
