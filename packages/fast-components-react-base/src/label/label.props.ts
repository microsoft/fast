import * as React from "react";
import { ILabelClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export enum LabelTag {
    label = "label",
    legend = "legend"
}

export interface ILabelManagedClasses extends IManagedClasses<ILabelClassNameContract> {}
export interface ILabelUnhandledProps extends React.HTMLAttributes<HTMLLabelElement> {}
export interface ILabelHandledProps extends ILabelManagedClasses {
    /**
     * Label content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * If label is hidden (needed in contexts such as glyph-only search inputs)
     */
    hidden?: boolean;

    /**
     * Use the appropriate HTML tag type depending on context
     */
    tag?: LabelTag;
}

export type LabelProps = ILabelHandledProps & ILabelUnhandledProps;
