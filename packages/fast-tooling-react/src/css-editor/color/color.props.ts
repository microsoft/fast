import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSColorClassNameContract } from "./color.style";
import { ControlOnChangeConfig } from "src/form/templates";
import { Omit } from "utility-types";

export interface CSSColorValues {
    color?: string;
}

export interface CSSColorUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

export interface CSSColorHandledProps extends ManagedClasses<CSSColorClassNameContract> {
    /**
     * The data
     */
    data?: CSSColorValues;

    /**
     * The onChange callback
     */
    onChange?: (config: ControlOnChangeConfig) => void;
}

export type CSSColorProps = CSSColorHandledProps & CSSColorUnhandledProps;
