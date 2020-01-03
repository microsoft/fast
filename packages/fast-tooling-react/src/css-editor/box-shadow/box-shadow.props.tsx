import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBoxShadowClassNameContract } from "./box-shadow.style";
import { CommonControlConfig } from "../../form/templates";
import { Omit } from "utility-types";

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
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

export interface CSSBoxShadowHandledProps
    extends CommonControlConfig,
        ManagedClasses<CSSBoxShadowClassNameContract> {}

export type CSSBoxShadowProps = CSSBoxShadowHandledProps & CSSBoxShadowUnhandledProps;
