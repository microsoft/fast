import { css as mdnCSS } from "mdn-data";
import {
    CombinatorType,
    mapCombinatorType,
    mapCSSProperties,
    mapGroupedEntities,
    mapMultiplierType,
    mapStringLiterals,
    MultiplierType,
    resolveCSSPropertyReference,
    resolveCSSPropertySyntax,
    resolveCSSPropertySyntaxSplit,
    resolveReferenceType,
} from "./mapping.mdn-data";

describe("mapStringLiterals,", () => {
    test("should keep track of '/' and ',' as literals", () => {
        expect(mapStringLiterals("/ <length-percentage>")).toEqual("/");
        expect(mapStringLiterals("<length-percentage>")).toEqual(null);
        expect(mapStringLiterals(", <length-percentage>")).toEqual(",");
    });
});

describe("mapGroupedEntities", () => {
    test("should group entities if they are surrounded by brackets", () => {
        expect(mapGroupedEntities("[ <length> | <percentage> | auto ]{1,4}")).toEqual(
            "<length> | <percentage> | auto"
        );
    });
});

describe("mapMultiplierType", () => {
    test("should find a zero or more multiplier type", () => {
        expect(mapMultiplierType("foo*")).toEqual({
            type: MultiplierType.zeroOrMore,
        });
    });
    test("should find a one or more multiplier type", () => {
        expect(mapMultiplierType("foo+")).toEqual({
            type: MultiplierType.oneOrMore,
        });
    });
    test("should find a zero or one multiplier type", () => {
        expect(mapMultiplierType("foo?")).toEqual({
            type: MultiplierType.zeroOrOne,
        });
    });
    test("should find an at least A times at most B times multiplier type", () => {
        expect(mapMultiplierType("foo{1,3}")).toEqual({
            type: MultiplierType.atLeastATimesAtMostBTimes,
            range: [1, 3],
        });
    });
    test("should find a one ore more separated by comma multiplier type", () => {
        expect(mapMultiplierType("foo#")).toEqual({
            type: MultiplierType.oneOrMoreSeparatedByComma,
        });
    });
    test("should find an  at least one value multiplier type", () => {
        expect(mapMultiplierType("foo!")).toEqual({
            type: MultiplierType.atLeastOne,
        });
    });
});

describe("mapCombinatorType", () => {
    test("should find a juxtaposition combination type", () => {
        expect(mapCombinatorType("foo bar bat")).toEqual(CombinatorType.juxtaposition);
        expect(
            mapCombinatorType("<length-percentage> [ / <length-percentage>{1,4} ]?")
        ).toEqual(CombinatorType.juxtaposition);
    });
    test("should find mandatory items in any order combination type", () => {
        expect(mapCombinatorType("foo && bar && bat")).toEqual(
            CombinatorType.mandatoryInAnyOrder
        );
    });
    test("should find at least one in any order combination type", () => {
        expect(mapCombinatorType("foo || bar || bat")).toEqual(
            CombinatorType.atLeastOneInAnyOrder
        );
    });
    test("should find exactly one combination type", () => {
        expect(mapCombinatorType("foo | bar | bat")).toEqual(CombinatorType.exactlyOne);
    });
    test("should find group combination type", () => {
        expect(mapCombinatorType("[foo bar bat]{1,4}")).toEqual(CombinatorType.brackets);
    });
    test("should find none if no combination types are found", () => {
        expect(mapCombinatorType("foo")).toEqual(CombinatorType.none);
    });
});

describe("resolveReferenceType", () => {
    test("should resolve a reference of type syntax", () => {
        expect(resolveReferenceType("<line-style>", ["line-style"], [])).toEqual(
            "syntax"
        );
    });
    test("should resolve a reference of type types", () => {
        expect(resolveReferenceType("<length>", [], ["length"])).toEqual("type");
    });
    test("should resolve a reference of type property", () => {
        expect(resolveReferenceType("<'margin-left'>", [], [])).toEqual("property");
    });
    test("should resolve a reference of type value", () => {
        expect(resolveReferenceType("<line-style>", [], [])).toEqual("value");
        expect(resolveReferenceType("<length>", [], [])).toEqual("value");
        expect(resolveReferenceType("auto", [], [])).toEqual("value");
    });
});

describe("resolveCSSPropertySyntaxSplit", () => {
    test("should split by at least one in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit(
                "foo || bar",
                CombinatorType.atLeastOneInAnyOrder
            )
        ).toEqual(["foo", "bar"]);
    });
    test("should split by exactly one", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo | bar", CombinatorType.juxtaposition)
        ).toEqual(["foo", "bar"]);
    });
    test("should split by juxtaposition", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo bar", CombinatorType.juxtaposition)
        ).toEqual(["foo", "bar"]);
    });
    test("should split by mandatory in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo && bar", CombinatorType.juxtaposition)
        ).toEqual(["foo", "bar"]);
    });
    test("should split by mandatory in any order", () => {
        expect(resolveCSSPropertySyntaxSplit("foobar", CombinatorType.none)).toEqual([
            "foobar",
        ]);
    });
});

describe("resolveCSSPropertyReference", () => {
    test("should resolve a simple string reference", () => {
        expect(resolveCSSPropertyReference("<length>", [], ["length"])).toEqual(
            "<length>"
        );
    });
    test("should resolve a reference with multipliers and prepended string literals", () => {
        expect(resolveCSSPropertyReference("/ <length>?", [], ["length"])).toEqual([
            {
                ref: "<length>",
                refCombinatorType: CombinatorType.none,
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: "/",
                type: "type",
            },
        ]);
    });
    test("should resolve a nested reference", () => {
        expect(
            resolveCSSPropertyReference(
                "<color>{1,4} , [ / <length-percentage>{1,4} ]?",
                [],
                ["color", "length-percentage"]
            )
        ).toEqual([
            {
                multiplier: {
                    range: [1, 4],
                    type: "atLeastATimesAtMostBTimes",
                },
                prepend: null,
                ref: "<color>",
                refCombinatorType: CombinatorType.none,
                type: "type",
            },
            {
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: ",",
                refCombinatorType: CombinatorType.none,
                ref: [
                    {
                        multiplier: {
                            type: "atLeastATimesAtMostBTimes",
                            range: [1, 4],
                        },
                        prepend: "/",
                        ref: "<length-percentage>",
                        refCombinatorType: CombinatorType.none,
                        type: "type",
                    },
                ],
                type: "group",
            },
        ]);
    });
});

describe("resolveCSSPropertySyntax", () => {
    test("should resolve a CSS properties syntax without shorthand properties", () => {
        expect(
            resolveCSSPropertySyntax(
                {
                    syntax: "<color>",
                    initial: "transparent",
                    percentages: "no",
                } as any,
                "background-color",
                [],
                ["color"]
            )
        ).toEqual([
            {
                mapsToProperty: "background-color",
                percentages: "no",
                ref: "<color>",
                multiplier: null,
                prepend: null,
                type: "type",
                refCombinatorType: CombinatorType.none,
            },
        ]);
    });
    test("should resolve a CSS properties syntax with shorthand properties", () => {
        expect(
            resolveCSSPropertySyntax(
                {
                    syntax: "[ <length> | <percentage> ]{1,4}",
                    initial: [
                        "padding-bottom",
                        "padding-left",
                        "padding-right",
                        "padding-top",
                    ],
                    percentages: "referToWidthOfContainingBlock",
                } as any,
                "padding",
                [],
                ["length", "percentage"]
            )
        ).toEqual([
            {
                mapsToProperty: "padding",
                percentages: "referToWidthOfContainingBlock",
                refCombinatorType: CombinatorType.exactlyOne,
                ref: [
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<length>",
                        refCombinatorType: CombinatorType.none,
                        type: "type",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<percentage>",
                        refCombinatorType: CombinatorType.none,
                        type: "type",
                    },
                ],
                multiplier: {
                    type: MultiplierType.atLeastATimesAtMostBTimes,
                    range: [1, 4],
                },
                type: "group",
                prepend: null,
            },
        ]);
    });
});

describe("mapCSSProperties", () => {
    test("should return a subset of MDN data into a subset of CSS properties ", () => {
        const subsetOfMDNCSS = {
            properties: {
                border: mdnCSS.properties.border,
            },
            syntaxes: mdnCSS.syntaxes,
            types: mdnCSS.types,
        } as any;

        expect(mapCSSProperties(subsetOfMDNCSS)).toEqual({
            border: {
                name: "border",
                appliesTo: "allElements",
                syntax: [
                    {
                        mapsToProperty: "border",
                        percentages: "no",
                        ref: [
                            {
                                type: "syntax",
                                ref: "<line-width>",
                                refCombinatorType: "none",
                                prepend: null,
                                multiplier: null,
                            },
                            {
                                type: "syntax",
                                ref: "<line-style>",
                                refCombinatorType: "none",
                                prepend: null,
                                multiplier: null,
                            },
                            {
                                type: "syntax",
                                ref: "<color>",
                                refCombinatorType: "none",
                                prepend: null,
                                multiplier: null,
                            },
                        ],
                        refCombinatorType: "atLeastOneInAnyOrder",
                        multiplier: null,
                        prepend: null,
                        type: "value",
                    },
                ],
            },
        });
    });
});
