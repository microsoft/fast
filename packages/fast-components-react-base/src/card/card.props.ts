import * as React from "react";
import { ICardClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Card HTML tags
 */
export enum CardTag {
    article = "article",
    div = "div",
    section = "section"
}

export interface ICardManagedClasses extends IManagedClasses<ICardClassNameContract> {}
export interface ICardUnhandledProps extends React.HTMLAttributes<HTMLDivElement | HTMLElement> {}
export interface ICardHandledProps extends ICardManagedClasses {
    /**
     * The card children
     */
    children?: React.ReactNode;

    /**
     * Use the appropriate HTML tag type depending on context
     */
    tag?: CardTag;
}

export type CardProps = ICardHandledProps & ICardUnhandledProps;
