import * as React from "react";
import {
    CardClassNameContract,
    ManagedClasses
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Card HTML tags
 */
export enum CardTag {
    article = "article",
    div = "div",
    section = "section"
}

export interface CardManagedClasses extends ManagedClasses<CardClassNameContract> {}
export interface CardUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement | HTMLElement> {}
export interface CardHandledProps extends CardManagedClasses {
    /**
     * The card children
     */
    children?: React.ReactNode;

    /**
     * Use the appropriate HTML tag type depending on context
     */
    tag?: CardTag;
}

export type CardProps = CardHandledProps & CardUnhandledProps;
