import * as React from "react";
import { ICardClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Card HTML tags
 */
export enum CardHTMLTags {
    article = "article",
    div = "div",
    section = "section"
}

export interface ICardUnhandledProps extends React.HTMLAttributes<HTMLDivElement | HTMLElement> {}
export interface ICardManagedClasses extends IManagedClasses<ICardClassNameContract> {}
export interface ICardHandledProps {
    /**
     * The card content
     */
    children?: React.ReactNode;

    /**
     * Use the appropriate HTML tag type depending on context
     */
    tag?: CardHTMLTags;
}

export type CardProps = ICardHandledProps & ICardUnhandledProps & ICardManagedClasses;
