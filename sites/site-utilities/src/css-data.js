/**
 * This file is generated from build/generate-mdn-data-files.js
 * any modifications will be overwritten.
 */
export const properties = {
    color: {
        name: "color",
        appliesTo: "allElements",
        syntax: {
            mapsToProperty: "color",
            percentages: "no",
            ref: "<color>",
            type: "syntax",
            refCombinatorType: "none",
            prepend: null,
            multiplier: null,
        },
    },
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
    border: {
        name: "border",
        appliesTo: "allElements",
        syntax: {
            mapsToProperty: "border",
            percentages: "no",
            ref: [
                {
                    ref: "<line-width>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<line-style>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
                {
                    ref: "<color>",
                    type: "syntax",
                    refCombinatorType: "none",
                    prepend: null,
                    multiplier: null,
                },
            ],
            refCombinatorType: "atLeastOneInAnyOrder",
            multiplier: null,
            prepend: null,
            type: "mixed",
        },
    },
};
