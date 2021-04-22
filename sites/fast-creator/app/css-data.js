/**
 * This file is generated from build/generate-mdn-data-files.js
 * any modifications will be overwritten.
 *
 * Last modified: 4/22/2021
 */
export const properties = {
    "background-color": {
        name: "background-color",
        appliesTo: "allElements",
        syntax: {
            mapsToProperty: "background-color",
            percentages: "no",
            ref: "<color>",
            type: "syntax",
            refCombinatorType: "none",
            prepend: null,
            multiplier: null,
        },
    },
    display: {
        name: "display",
        appliesTo: "allElements",
        syntax: {
            mapsToProperty: "display",
            percentages: "no",
            ref: [
                {
                    ref: [
                        {
                            ref: "<display-outside>",
                            type: "syntax",
                            refCombinatorType: "none",
                            prepend: null,
                            multiplier: null,
                        },
                        {
                            ref: "<display-inside>",
                            type: "syntax",
                            refCombinatorType: "none",
                            prepend: null,
                            multiplier: null,
                        },
                    ],
                    refCombinatorType: "atLeastOneInAnyOrder",
                    type: "group",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<display-listitem>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<display-internal>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<display-box>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<display-legacy>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
            ],
            refCombinatorType: "exactlyOne",
            multiplier: null,
            prepend: null,
            type: "mixed",
        },
    },
    margin: {
        name: "margin",
        appliesTo: "allElementsExceptTableDisplayTypes",
        syntax: {
            mapsToProperty: "margin",
            percentages: "referToWidthOfContainingBlock",
            ref: [
                {
                    ref: "<length>",
                    type: "type",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<percentage>",
                    type: "type",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "auto",
                    type: "value",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
            ],
            refCombinatorType: "exactlyOne",
            type: "group",
            prepend: null,
            multiplier: {
                type: "atLeastATimesAtMostBTimes",
                range: [1, 4],
            },
        },
    },
    overflow: {
        name: "overflow",
        appliesTo: "blockContainersFlexContainersGridContainers",
        syntax: {
            mapsToProperty: "overflow",
            percentages: "no",
            ref: [
                {
                    ref: "visible",
                    type: "value",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "hidden",
                    type: "value",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "clip",
                    type: "value",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "scroll",
                    type: "value",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "auto",
                    type: "value",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
            ],
            refCombinatorType: "exactlyOne",
            type: "group",
            prepend: null,
            multiplier: {
                type: "atLeastATimesAtMostBTimes",
                range: [1, 2],
            },
        },
    },
    padding: {
        name: "padding",
        appliesTo: "allElementsExceptInternalTableDisplayTypes",
        syntax: {
            mapsToProperty: "padding",
            percentages: "referToWidthOfContainingBlock",
            ref: [
                {
                    ref: "<length>",
                    type: "type",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<percentage>",
                    type: "type",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
            ],
            refCombinatorType: "exactlyOne",
            type: "group",
            prepend: null,
            multiplier: {
                type: "atLeastATimesAtMostBTimes",
                range: [1, 4],
            },
        },
    },
};
