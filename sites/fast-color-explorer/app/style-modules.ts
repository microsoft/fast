import {
    StyleModuleEvaluate,
    StyleModuleEvaluateParameters,
    Swatch,
} from "@microsoft/fast-components";
import { CSSDirective, cssPartial } from "@microsoft/fast-element";
import { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";

function attributeValue(
    attribute: string,
    value: string | number | CSSDesignToken<any>
): CSSDirective {
    return cssPartial`${attribute}: ${value};`;
}

export function angledBorder(
    radius: string,
    color: string | CSSDesignToken<Swatch>,
    weight: number
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): CSSDirective => cssPartial`
        ${params.baseSelector} {
            ${attributeValue("--corner-radius", radius)}
            ${attributeValue("--paint-color", color)}
            ${attributeValue("--stroke-weight", weight)}
            ${attributeValue("-webkit-mask", "paint(angled-corners, filled)")}
            ${attributeValue(
                "border-image",
                "paint(angled-corners, outlined) 0 fill !important"
            )}
        }
    `;
}

export function cornerShape(radius: string, shape: string): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): CSSDirective => cssPartial`
        ${params.baseSelector} {
            ${attributeValue("border-radius", 0)}
            ${attributeValue("--corner-radius", radius)}
            ${attributeValue("--corner-shape", shape)}
            ${attributeValue("-webkit-mask-image", "paint(corner-shape)")}
        }
    `;
}
