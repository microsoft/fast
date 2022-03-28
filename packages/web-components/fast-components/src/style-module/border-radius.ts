import { CSSDirective, cssPartial } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { StyleModuleEvaluate, StyleModuleEvaluateParameters } from "./style-module";

export function borderRadius(
    ...radius: Array<number | CSSDesignToken<number>>
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): CSSDirective => {
        let value: CSSDirective;
        if (radius.length === 4) {
            value = cssPartial`calc(${radius[0]} * 1px) calc(${radius[1]} * 1px) calc(${radius[2]} * 1px) calc(${radius[3]} * 1px);`;
        } else if (radius.length === 3) {
            value = cssPartial`calc(${radius[0]} * 1px) calc(${radius[1]} * 1px) calc(${radius[2]} * 1px);`;
        } else if (radius.length === 2) {
            value = cssPartial`calc(${radius[0]} * 1px) calc(${radius[1]} * 1px);`;
        } else {
            value = cssPartial`calc(${radius[0]} * 1px);`;
        }
        return cssPartial`
        ${params.baseSelector} {
            border-radius: ${value};
        }`;
    };
}
