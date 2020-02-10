import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { Omit } from "utility-types";
import { BackgroundHandledProps, HeadingProps, ParagraphProps } from "@microsoft/fast-components-react-msft";
import { ButtonProps } from "@microsoft/fast-components-react-base";

/**
 * The class name contract for the banner component
 */
export interface BannerClassNameContract {
    /**
     * The root of the banner component
     */
    banner?: string;

    /**
     * The banner title
     */
    banner_title?: string;

    /**
     * The banner abstract
     */
    banner_abstract?: string;

    /**
     * The banner action
     */
    banner_action?: string;

    /**
     * The banner content region
     */
    banner_contentRegion?: string;
}

/**
 * An interface for the banner managed classes
 */
export interface BannerManagedClasses extends ManagedClasses<BannerClassNameContract> {}

/**
 * An interface for the banner prop contract
 */
export interface BannerHandledProps extends BackgroundHandledProps, BannerManagedClasses {
    /**
     * The banner title
     */
    title: HeadingProps;

    /**
     * The banner abstract
     */
    abstract: ParagraphProps;

    /**
     * The banner background color
     */
    backgroundColor?: string;

    /**
     * The banner action
     */
    action: Omit<ButtonProps, "children">;
}

/**
 * An interface for the banner unhnadled prop contract
 */
/* tslint:disable-next-line:no-empty-interface */
export interface BannerUnhandledProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {}

/**
 * An interface for the banner prop contract
 */
export type BannerProps = BannerHandledProps & BannerUnhandledProps;
