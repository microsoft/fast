import * as React from "react";
import { ILabelClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export enum LabelTag {
    label = "label",
    legend = "legend"
}

export interface ILabelHandledProps {
    /**
     * Label content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * Use the appropriate HTML tag type depending on context
     */
    tag?: LabelTag;
}

export interface ILabelUnhandledProps extends React.HTMLAttributes<HTMLLabelElement> {}
export interface ILabelMangedClasses extends IManagedClasses<ILabelClassNameContract> {}
export type LabelProps = ILabelHandledProps & ILabelUnhandledProps & ILabelMangedClasses;
