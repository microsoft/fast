import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSColorClassNameContract } from "./color.style";
import { ControlOnChangeConfig } from "src/form/templates";
import { FormEvent } from "react";

export interface CSSColorValues {
    color?: string;
}

export interface CSSColorUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSColorHandledProps extends ManagedClasses<CSSColorClassNameContract> {
    /**
     * The data
     */
    data?: CSSColorValues;

    /**
     * The onChange callback
     */
    onColorChange?: (config: ControlOnChangeConfig) => void;
}

export type CSSColorProps = CSSColorHandledProps & CSSColorUnhandledProps;
