import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSHeightClassNameContract } from "./height.style";
import { CommonControlConfig } from "../../form/templates";
import { Omit } from "utility-types";

export interface CSSHeightValues {
    height?: string;
}

export interface CSSHeightUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

export interface CSSHeightHandledProps
    extends CommonControlConfig,
        ManagedClasses<CSSHeightClassNameContract> {}

export type CSSHeightProps = CSSHeightHandledProps & CSSHeightUnhandledProps;
