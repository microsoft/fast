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

export interface CSSBorderState {
    borderColor?: string;
    borderStyle?: BorderStyleValue;
    borderWidth?: string;
}

export interface CSSBorderValues {
    border?: string;
    borderColor?: string;
    borderStyle?: BorderStyleValue;
    borderWidth?: string;
}

export interface CSSBorderUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

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
