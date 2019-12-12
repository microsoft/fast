import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSBackgroundClassNameContract } from "./background.style";
import { CommonControlConfig } from "../../form/templates";
import { Omit } from "utility-types";

export interface CSSBackgroundValues {
    background?: string;
}

export interface CSSBackgroundUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

export interface CSSBackgroundHandledProps
    extends CommonControlConfig,
        ManagedClasses<CSSBackgroundClassNameContract> {}

export type CSSBackgroundProps = CSSBackgroundHandledProps & CSSBackgroundUnhandledProps;
