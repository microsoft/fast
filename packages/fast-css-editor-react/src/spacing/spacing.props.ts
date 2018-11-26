import { ManagedClasses } from "@microsoft/fast-jss-manager";
import { CSSSpacingClassNameContract } from "./spacing.style";

export enum SpacingType {
    margin = "margin",
    padding = "padding",
}

export enum SpacingKey {
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
    marginLeft?: string;
    marginBottom?: string;
    marginRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
}

export interface CSSSpacingHandledProps
    extends ManagedClasses<CSSSpacingClassNameContract>,
        CSSSpacingValues {
    /**
     * The type of spacing margin/padding
     */
    spacingType?: SpacingType;

    /**
     * The spacing update callback
     */
    onSpacingUpdate?: (spacing: CSSSpacingValues) => void;

    /**
     * The spacing type update callback
     */
    onSpacingTypeUpdate?: (spacingType: SpacingType) => void;
}

export type CSSSpacingProps = CSSSpacingHandledProps & CSSSpacingUnhandledProps;
