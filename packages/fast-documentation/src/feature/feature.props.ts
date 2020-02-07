import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { HeadingProps, ParagraphProps } from "@microsoft/fast-components-react-msft";
import { ColumnHandledProps } from "@microsoft/fast-layouts-react";

/**
 * The class name contract for the feature component
 */
export interface FeatureClassNameContract {
    /**
     * The root of the feature component
     */
    feature?: string;

    /**
     * The content container
     */
    feature_contentContainer?: string;

    /**
     * The content
     */
    feature_content?: string;

    /**
     * The feature badge
     */
    feature_badge?: string;

    /**
     * The feature heading
     */
    feature_heading?: string;

    /**
     * The feature paragraph
     */
    feature_paragraph?: string;

    /**
     * The feature action
     */
    feature_action?: string;

    /**
     * The feature image
     */
    feature_image?: string;
}

/**
 * An interface for the feature managed classes
 */
export interface FeatureManagedClasses extends ManagedClasses<FeatureClassNameContract> {}

/**
 * An interface for the feature prop contract
 */
export interface FeatureHandledProps extends ColumnHandledProps, FeatureManagedClasses {
    /**
     * The feature heading
     */
    badge?: string;

    /**
     * The feature heading
     */
    heading: HeadingProps;

    /**
     * The feature paragraph
     */
    paragraph: ParagraphProps;

    /**
     * The feature action
     * This is a render prop
     */
    action?: (className: string) => React.ReactNode;

    /**
     * The feature image
     * This is a render prop
     */
    image?: (className: string) => React.ReactNode;
}

/**
 * An interface for the feature unhnadled prop contract
 */
/* tslint:disable-next-line:no-empty-interface */
export interface FeatureUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * An interface for the Feature prop contract
 */
export type FeatureProps = FeatureHandledProps & FeatureUnhandledProps;
