import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSColorClassNameContract } from "./color.style";
import { CommonControlConfig } from "../../form/templates";
import { Omit } from "utility-types";

export interface CSSColorValues {
    color?: string;
}

export interface CSSColorUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

/* tslint:disable-next-line */
export interface CSSColorHandledProps
    extends CommonControlConfig,
        ManagedClasses<CSSColorClassNameContract> {}

export type CSSColorProps = CSSColorHandledProps & CSSColorUnhandledProps;
