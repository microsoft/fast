import { RenderControlConfig } from "./control.css.utilities.props";
import React from "react";
import {
    CSSPropertyRef,
    CSSPropertySyntax,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
export interface RenderPropertyControlConfig extends RenderControlConfig {
    property: string;
    syntax: CSSPropertySyntax | CSSPropertyRef;
}
/**
 * The property control for syntaxes that refer to other
 * CSS properties, for a list refer to:
 * https://github.com/mdn/data/blob/master/css/properties.json
 */
export declare function renderPropertyControl(
    config: RenderPropertyControlConfig
): React.ReactNode;
