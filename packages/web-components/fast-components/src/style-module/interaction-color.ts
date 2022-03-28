import { CSSDirective } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch";
import { interactionState } from "./interaction-state";
import { StyleModuleEvaluate, StyleModuleEvaluateParameters } from "./style-module";

export function interactionColor(
    attribute: string,
    rest: CSSDesignToken<Swatch>,
    hover: CSSDesignToken<Swatch>,
    active: CSSDesignToken<Swatch>,
    focus: CSSDesignToken<Swatch>
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): CSSDirective =>
        interactionState(attribute, rest, hover, active, focus)(params);
}
