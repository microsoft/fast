import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { HeadingProps, ParagraphProps } from "@microsoft/fast-components-react-msft";
import { ColumnHandledProps } from "@microsoft/fast-layouts-react";

/**
 * The class name contract for the content placement component
 */
export interface ContentPlacementClassNameContract {
    /**
     * The root of the content placement component
     */
    contentPlacement?: string;

    /**
     * The content placement content container
     */
    contentPlacement_contentContainer?: string;

    /**
     * The content placement heading
     */
    contentPlacement_heading?: string;

    /**
     * The content placement paragraph
     */
    contentPlacement_paragraph?: string;

    /**
     * The content placement action
     */
    contentPlacement_action?: string;

    /**
     * The content placement image
     */
    contentPlacement_image?: string;
}

/**
 * An interface for the content placement managed classes
 */
export interface ContentPlacementManagedClasses extends ManagedClasses<ContentPlacementClassNameContract> {}

/**
 * An interface for the content placement prop contract
 */
export interface ContentPlacementHandledProps extends ColumnHandledProps, ContentPlacementManagedClasses {
    /**
     * The content placement heading
     */
    heading: HeadingProps;

    /**
     * The content placement paragraph
     */
    paragraph: ParagraphProps;

    /**
     * The content placement action
     * This is a render prop
     */
    action?: (className: string) => React.ReactNode;

    /**
     * The content placement image
     * This is a render prop
     */
    image?: (className: string) => React.ReactNode;
}

/**
 * An interface for the content placement unhnadled prop contract
 */
/* tslint:disable-next-line:no-empty-interface */
export interface ContentPlacementUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * An interface for the Content placement prop contract
 */
export type ContentPlacementProps = ContentPlacementHandledProps & ContentPlacementUnhandledProps;
