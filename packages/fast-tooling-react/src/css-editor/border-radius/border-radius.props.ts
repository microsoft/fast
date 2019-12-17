import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBorderRadiusClassNameContract } from "./border-radius.style";
import { CommonControlConfig } from "../../form/templates";
import { Omit } from "utility-types";

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

export interface CSSBorderRadiusUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

export interface CSSBorderRadiusHandledProps
    extends CommonControlConfig,
        ManagedClasses<CSSBorderRadiusClassNameContract> {}

export type CSSBorderRadiusProps = CSSBorderRadiusHandledProps &
    CSSBorderRadiusUnhandledProps;
