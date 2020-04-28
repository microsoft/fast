import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBorderClassNameContract } from "./border.style";

export enum BorderStyleValue {
    dashed = "dashed",
    dotted = "dotted",
    double = "double",
    groove = "groove",
    hidden = "hidden",
    inherit = "inherit",
    initial = "initial",
    inset = "inset",
    none = "none",
    outset = "outset",
    ridge = "ridge",
    solid = "solid",
    unset = "unset",
}

/**
 * The CSS border keys
 */
export enum BorderProperty {
    borderColor = "borderColor",
    borderStyle = "borderStyle",
    borderWidth = "borderWidth",
}

export interface CSSBorderValues {
    borderColor?: string;
    borderStyle?: BorderStyleValue;
    borderWidth?: string;
}

export type CSSBorderUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSBorderHandledProps
    extends ManagedClasses<CSSBorderClassNameContract> {
    /**
     * The data
     */
    data?: CSSBorderValues;

    /**
     * The onChange callback
     */
    onChange?: (border: CSSBorderValues) => void;
}

export type CSSBorderProps = CSSBorderHandledProps & CSSBorderUnhandledProps;
