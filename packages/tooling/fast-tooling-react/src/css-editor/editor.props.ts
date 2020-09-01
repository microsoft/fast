import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { CSSEditorClassNameContract } from "./editor.style";
import { CSSSpacingValues } from "./spacing";
import { CSSPositionValues } from "./position";
import { CSSWidthValues } from "./width";
import { CSSHeightValues } from "./height";
import { CSSColorValues } from "./color";
import { CSSBorderValues } from "./border";
import { CSSBoxShadowValues } from "./box-shadow";
import { CSSBackgroundValues } from "./background";
import { CSSBorderRadiusValues } from "./border-radius";

export enum CSSComponent {
    spacing,
    position,
    width,
    height,
    color,
    border,
    boxShadow,
    background,
    borderRadius,
}

export interface CSSEditorValues
    extends CSSSpacingValues,
        CSSPositionValues,
        CSSWidthValues,
        CSSHeightValues,
        CSSColorValues,
        CSSBorderValues,
        CSSBoxShadowValues,
        CSSBackgroundValues,
        CSSBorderRadiusValues {}

export type CSSOnChange = (CSS: CSSEditorValues) => void;

export type CSSEditorUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface CSSEditorHandledProps
    extends ManagedClasses<CSSEditorClassNameContract> {
    /**
     * The onChange event for updating the data
     */
    onChange?: CSSOnChange;

    /**
     * The CSS data
     */
    data?: CSSEditorValues;
}

export type CSSEditorProps = CSSEditorHandledProps & CSSEditorUnhandledProps;
