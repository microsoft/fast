import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSColorClassNameContract } from "./color.style";

export interface CSSColorValues {
    color?: string;
}

export type CSSColorUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSColorHandledProps extends ManagedClasses<CSSColorClassNameContract> {
    /**
     * The data
     */
    data?: CSSColorValues;

    /**
     * The onChange callback
     */
    onChange?: (color: CSSColorValues) => void;
}

export type CSSColorProps = CSSColorHandledProps & CSSColorUnhandledProps;
