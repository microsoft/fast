import React from "react";
import { ActionTrigger, NumberField } from "@microsoft/fast-components-react-msft";
import { rotateGlyph } from "../../icons/rotate";
import { DimensionProps } from "./dimension.props";

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
            <NumberField
                value={width}
                onChange={onDimensionChange(onUpdateWidth)}
                style={{
                    width: "64px",
                }}
                disabled={disabled}
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
            <NumberField
                value={height}
                onChange={onDimensionChange(onUpdateHeight)}
                style={{
                    width: "64px",
                    marginRight: 4,
                }}
                disabled={disabled}
            />
            <ActionTrigger
                glyph={rotateGlyph}
                aria-label={"Rotate axis"}
                onClick={onUpdateOrientation}
                disabled={disabled}
            />
        </div>
    );
};

export * from "./dimension.props";
