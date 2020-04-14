import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSSpacingClassNameContract } from "./spacing.style";

/**
 * Spacing can be either "margin" or "padding"
 * this component should be able to control both
 * for a more efficient UI
 */
export enum SpacingType {
    margin = "margin",
    padding = "padding",
}

/**
 * The CSS property keys
 */
export enum SpacingProperty {
    marginTop = "marginTop",
    marginLeft = "marginLeft",
    marginRight = "marginRight",
    marginBottom = "marginBottom",
    paddingTop = "paddingTop",
    paddingBottom = "paddingBottom",
    paddingLeft = "paddingLeft",
    paddingRight = "paddingRight",
}

export interface CSSSpacingState {
    activeType: SpacingType;

    hoverType: SpacingType | undefined;
}

export interface CSSSpacingUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CSSSpacingValues {
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
}

export interface CSSSpacingHandledProps
    extends ManagedClasses<CSSSpacingClassNameContract> {
    /**
     * The data
     */
    data?: CSSSpacingValues;

    /**
     * The update callback
     */
    onChange?: (data: CSSSpacingValues) => void;
}

export type CSSSpacingProps = CSSSpacingHandledProps & CSSSpacingUnhandledProps;
