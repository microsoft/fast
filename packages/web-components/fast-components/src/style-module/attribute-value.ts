import { CSSDirective, cssPartial } from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { StyleModuleEvaluate, StyleModuleEvaluateParameters } from "./style-module";

export function attributeValue(
    attribute: string,
    value: string | number | CSSDesignToken<any>
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): CSSDirective => {
        return cssPartial`
        ${params.baseSelector} {
            ${attribute}: ${value};
        }`;
    };
}
