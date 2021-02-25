# Mapping MDN data

## Build script

The package should have a `devDependency` for [MDN data](https://www.npmjs.com/package/mdn-data) and re-interpret the properties based on this. To only require what is needed there should be a build script which takes the MDN data and converts it to a `.ts` file with exports conforming to an interface which defines the example provided in [Properties](#properties).

## Properties

There should be a list of CSS properties. The structure should look like this:

MDN structure (`border`):
```json
{
    "syntax": "<line-width> || <line-style> || <color>",
    "animationType": [
      "border-color",
      "border-style",
      "border-width"
    ],
    "percentages": "no",
    "initial": [
      "border-width",
      "border-style",
      "border-color"
    ],
    "appliesto": "allElements",
    "order": "orderOfAppearance",
    "alsoAppliesTo": [
      "::first-letter"
    ],
    "status": "standard",
}
```

FAST tooling mapped structure:
```typescript
{
    name: "border", // The CSS property name
    appliesTo: "allElements",
    syntax: [ // these must be in order, taken from the `initial` MDN property
        {
            mapsToProperty: "border-width",
            ref: [
                {
                    type: "syntax",
                    ref: "<line-width>"
                }
            ],
            percentages: false,
            optional: true,
        },
        {
            mapsToProperty: "border-style",
            ref: [
                {
                    type: "syntax",
                    ref: "<line-style>"
                }
            ],
            percentages: false,
            optional: true,
        },
        {
            mapsToProperty: "border-color",
            ref: [
                {
                    type: "type",
                    ref: "<color>",
                }
            ],
            percentages: false,
            optional: true,
        }
    ]
}
```

Example for grouped items:
MDN structure (`align-items`):
```json
{
    "syntax": "normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]",
    "percentages": "no",
    "initial": "normal",
    "appliesto": "allElements",
    "computed": "asSpecified",
    "order": "uniqueOrder",
    "status": "standard",
}
```

FAST tooling mapped structure:
```typescript
{
    name: "align-items",
    appliesTo: "allElements",
    syntax: [
        {
            mapsToProperty: "align-items",
            ref: [
                {
                    type: "value",
                    ref: "normal"
                },
                {
                    type: "value",
                    ref: "stretch"
                },
                {
                    type: "syntax",
                    ref: "<baseline-position>"
                },
                {
                    type: "group",
                    ref: [
                        {
                            type: "syntax",
                            ref: "<overflow-position>",
                            multiplier: {
                                type: "zeroOrOne"
                            },
                        },
                        {
                            type: "syntax",
                            ref: "<self-position>",
                        }
                    ]
                }
            ],
            percentages: false,
            optional: true,
        },
    ]
}
```

From this structure we can construct via the UI generated from the below methods: `border: 1px solid red`.

MDN structure (`margin`):
```json
{
    "syntax": "[ <length> | <percentage> | auto ]{1,4}",
    "media": "visual",
    "inherited": false,
    "animationType": "length",
    "percentages": "referToWidthOfContainingBlock",
    "groups": [
      "CSS Box Model"
    ],
    "initial": [
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top"
    ],
    "appliesto": "allElementsExceptTableDisplayTypes",
    "computed": [
      "margin-bottom",
      "margin-left",
      "margin-right",
      "margin-top"
    ],
    "order": "uniqueOrder",
    "alsoAppliesTo": [
      "::first-letter",
      "::first-line"
    ],
    "status": "standard",
    "mdn_url": "https://developer.mozilla.org/docs/Web/CSS/margin"
}
```

FAST tooling mapped structure:
```typescript
{
    name: "margin",
    appliesTo: "allElementsExceptTableDisplayTypes",
    syntax: [
        {
            mapsToProperty: "margin-bottom",
            ref: [
                {
                    type: "type",
                    ref: "<length>",
                },
                {
                    type: "type",
                    ref: "<percentage>",
                },
                {
                    type: "string",
                    ref: "auto",
                }
            ],
            percentages: true,
        },
        {
            mapsToProperty: "margin-left",
            ref: [
                {
                    type: "type",
                    ref: "<length>",
                },
                {
                    type: "type",
                    ref: "<percentage>",
                },
                {
                    type: "string",
                    ref: "auto",
                }
            ],
            percentages: true,
        },
        {
            mapsToProperty: "margin-right",
            ref: [
                {
                    type: "type",
                    ref: "<length>",
                },
                {
                    type: "type",
                    ref: "<percentage>",
                },
                {
                    type: "string",
                    ref: "auto",
                }
            ],
            percentages: true,
        },
        {
            mapsToProperty: "margin-top",
            ref: [
                {
                    type: "type",
                    ref: "<length>",
                },
                {
                    type: "type",
                    ref: "<percentage>",
                },
                {
                    type: "string",
                    ref: "auto"
                }
            ],
            percentages: true,
        },
    ]
}
```

## Syntax

There should be a list of syntaxes that map the syntax. The structure should look like this:

```typescript
{
    "<color>": {
        name: "color",
        values: [
            "<rgb()>",
            "<rgba()>",
            "<hsl()>",
            "<hsla()>",
            "<hex-color>",
            "<named-color>",
            "currentcolor",
            "<deprecated-system-color>"
        ]
    }
}
```
