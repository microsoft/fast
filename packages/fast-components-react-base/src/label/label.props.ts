import * as React from "react";
import { ILabelClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

export enum LabelTag {
    div = "div",
    label = "label",
    legend = "legend",
    p = "p",
    span = "span"
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

export interface ILabelUnhandledProps extends React.HTMLAttributes<HTMLLabelElement | HTMLPictureElement> {}
export interface ILabelMangedClasses extends IManagedClasses<ILabelClassNameContract> {}
export type LabelProps = ILabelHandledProps & ILabelUnhandledProps & ILabelMangedClasses;
