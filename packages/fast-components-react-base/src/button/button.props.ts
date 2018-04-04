import * as React from "react";
import {IButtonClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

/**
 * Button HTML tags
 */
export enum ButtonHTMLTags {
    a = "a",
    button = "button"
}

export interface IButtonHandledProps {
    /**
     * The HTML tag (defaults to ButtonHTMLTags.button)
     */
    tag?: ButtonHTMLTags;

    children?: React.ReactNode | React.ReactNode[];
}

export interface IButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IButtonMangedClasses extends IManagedClasses<IButtonClassNameContract> {}
export type ButtonProps = IButtonHandledProps & IButtonUnhandledProps & IButtonMangedClasses;
