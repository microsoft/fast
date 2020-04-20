import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBorderRadiusClassNameContract } from "./border-radius.style";

export interface CSSBorderRadiusState {
    individualValues?: boolean;
    hasFocus?: BorderRadiusValue | void;
    data?: CSSBorderRadiusValues;
}

export enum BorderRadiusValue {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
}

export interface CSSBorderRadiusValues {
    borderRadius?: string;
}

export type CSSBorderRadiusUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSBorderRadiusHandledProps
    extends ManagedClasses<CSSBorderRadiusClassNameContract> {
    /**
     * The data
     */
    data?: CSSBorderRadiusValues;

    /**
     * The onChange callback
     */
    onChange?: (borderRadius: CSSBorderRadiusValues) => void;
}

export type CSSBorderRadiusProps = CSSBorderRadiusHandledProps &
    CSSBorderRadiusUnhandledProps;
