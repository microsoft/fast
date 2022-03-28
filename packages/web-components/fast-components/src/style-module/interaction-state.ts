import { CSSDirective, cssPartial } from "@microsoft/fast-element";
import { CSSDesignToken, focusVisible } from "@microsoft/fast-foundation";
import { StyleModuleEvaluate, StyleModuleEvaluateParameters } from "./style-module";

function attributeValue(attribute: string, value: CSSDesignToken<any>): CSSDirective {
    return cssPartial`${attribute}: ${value};`;
}

function makeSelector(params: StyleModuleEvaluateParameters, state?: string) {
    const selector = state ? params.interactivitySelector + ":" + state : "";
    if (params.baseSelector.indexOf("STATE") > -1) {
        console.log("makeSelector - regex", params.baseSelector, selector);

        return params.baseSelector.replace(/STATE/g, selector);
    } else {
        console.log("makeSelector - append", params.baseSelector, selector);

        return params.baseSelector + selector;
    }
}

export function interactionState(
    attribute: string,
    rest: CSSDesignToken<any>,
    hover?: CSSDesignToken<any>,
    active?: CSSDesignToken<any>,
    focus?: CSSDesignToken<any>,
    focusSelector: string = focusVisible
): StyleModuleEvaluate {
    return (params: StyleModuleEvaluateParameters): CSSDirective => cssPartial`
        ${makeSelector(params)} {
            ${attributeValue(attribute, rest)}
        }
        ${
            hover
                ? cssPartial`
            ${makeSelector(params, "hover")} {
                ${attributeValue(attribute, hover)}
            }`
                : ``
        }
        ${
            active
                ? cssPartial`
            ${makeSelector(params, "active")} {
                ${attributeValue(attribute, active)}
            }`
                : ``
        }
        ${
            focus
                ? cssPartial`
            ${makeSelector(params, focusSelector)} {
                ${attributeValue(attribute, focus)}
            }`
                : ``
        }
    `;
}
