import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBoxShadowClassNameContract } from "./box-shadow.style";

export interface CSSBoxShadowState {
    boxShadowColor?: string;
    boxShadowOpacity?: number;
    boxShadowOffsetX?: string;
    boxShadowOffsetY?: string;
    boxShadowBlurRadius?: string;
}

export interface CSSBoxShadowValues {
    boxShadow?: string;
}

export interface CSSBoxShadowUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSBoxShadowHandledProps
    extends ManagedClasses<CSSBoxShadowClassNameContract> {
    /**
     * The data
     */
    data?: CSSBoxShadowValues;

    /**
     * The onChange callback
     */
    onChange?: (boxShadow: CSSBoxShadowValues) => void;
}

export type CSSBoxShadowProps = CSSBoxShadowHandledProps & CSSBoxShadowUnhandledProps;
