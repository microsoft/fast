import { css as mdnCSS } from "mdn-data";
import {
    CombinatorType,
    mapCombinatorType,
    mapCSSProperties,
    mapCSSSyntaxes,
    mapGroupedEntities,
    mapMixedCombinatorTypes,
    mapMultiplierType,
    mapStringLiterals,
    MultiplierType,
    resolveCSSPropertyReference,
    resolveCSSPropertySyntax,
    resolveCSSPropertySyntaxSplit,
    resolveCSSSyntax,
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
        expect(
            mapCombinatorType("<'mask-border-width'>? [ / <'mask-border-outset'> ]")
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
        expect(mapCombinatorType("[ <custom-ident> <integer>? ]+ | none")).toEqual(
            CombinatorType.exactlyOne
        );
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
        expect(
            resolveReferenceType("<line-style>", CombinatorType.none, ["line-style"], [])
        ).toEqual("syntax");
    });
    test("should resolve a reference of type types", () => {
        expect(
            resolveReferenceType("<length>", CombinatorType.none, [], ["length"])
        ).toEqual("type");
    });
    test("should resolve a reference of type property", () => {
        expect(
            resolveReferenceType("<'margin-left'>", CombinatorType.none, [], [])
        ).toEqual("property");
    });
    test("should resolve a reference of type value", () => {
        expect(resolveReferenceType("<line-style>", CombinatorType.none, [], [])).toEqual(
            "value"
        );
        expect(resolveReferenceType("<length>", CombinatorType.none, [], [])).toEqual(
            "value"
        );
        expect(resolveReferenceType("auto", CombinatorType.none, [], [])).toEqual(
            "value"
        );
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
        expect(
            resolveCSSPropertySyntaxSplit(
                "[ <custom-ident> <integer>? ]+ | none",
                CombinatorType.juxtaposition
            )
        ).toEqual(["[ <custom-ident> <integer>? ]+", "none"]);
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

        expect(
            resolveCSSPropertyReference(
                "[ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]?",
                [],
                []
            )
        ).toEqual([
            {
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: "/",
                ref: [
                    {
                        multiplier: {
                            type: "zeroOrOne",
                        },
                        prepend: null,
                        ref: "<'mask-border-width'>",
                        refCombinatorType: "none",
                        type: "property",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: [
                            {
                                multiplier: null,
                                prepend: "/",
                                ref: "<'mask-border-outset'>",
                                refCombinatorType: "none",
                                type: "property",
                            },
                        ],
                        refCombinatorType: "none",
                        type: "property",
                    },
                ],
                refCombinatorType: "juxtaposition",
                type: "property",
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
        ).toEqual({
            mapsToProperty: "background-color",
            percentages: "no",
            ref: "<color>",
            multiplier: null,
            prepend: null,
            type: "type",
            refCombinatorType: CombinatorType.none,
        });
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
        ).toEqual({
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
            type: "mixed",
            prepend: null,
        });
    });
    test("should resolve a CSS properties syntax with a single syntax", () => {
        expect(
            resolveCSSPropertySyntax(
                {
                    syntax: "<foo>#",
                    percentages: "referToWidthOfContainingBlock",
                } as any,
                "bar",
                [],
                ["foo"]
            )
        ).toEqual({
            mapsToProperty: "bar",
            multiplier: {
                type: "oneOrMoreSeparatedByComma",
            },
            percentages: "referToWidthOfContainingBlock",
            prepend: null,
            ref: "<foo>",
            refCombinatorType: "none",
            type: "type",
        });
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
                syntax: {
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
                    type: "mixed",
                },
            },
        });
    });
    describe("options", () => {
        test("should check for status", () => {
            const subsetOfMDNCSS = {
                properties: {
                    "--*": mdnCSS.properties["--*"],
                    border: mdnCSS.properties.border,
                },
                syntaxes: mdnCSS.syntaxes,
                types: mdnCSS.types,
            } as any;

            expect(mapCSSProperties(subsetOfMDNCSS, { status: "standard" })).toEqual({
                border: {
                    name: "border",
                    appliesTo: "allElements",
                    syntax: {
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
                        type: "mixed",
                    },
                },
            });
        });
    });
});

describe("resolveCSSSyntax", () => {
    test("should resolve a CSS syntax without grouped items", () => {
        expect(resolveCSSSyntax("xx-small | x-small | small", [], [])).toEqual({
            ref: [
                {
                    multiplier: null,
                    prepend: null,
                    ref: "xx-small",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    multiplier: null,
                    prepend: null,
                    ref: "x-small",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    multiplier: null,
                    prepend: null,
                    ref: "small",
                    refCombinatorType: "none",
                    type: "value",
                },
            ],
            refCombinatorType: "exactlyOne",
        });
    });
    test("should resolve a CSS syntax with grouped items", () => {
        expect(
            resolveCSSSyntax("[ common-ligatures | no-common-ligatures ]", [], [])
        ).toEqual({
            ref: [
                {
                    multiplier: null,
                    prepend: null,
                    ref: "common-ligatures",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    multiplier: null,
                    prepend: null,
                    ref: "no-common-ligatures",
                    refCombinatorType: "none",
                    type: "value",
                },
            ],
            refCombinatorType: "exactlyOne",
        });
    });
});

describe("mapCSSSyntaxes", () => {
    test("should return a subset of MDN data into a subset of CSS syntaxes", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                "absolute-size": {
                    syntax: "xx-small | x-small | small",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).toEqual({
            "absolute-size": {
                name: "absolute-size",
                value: {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "xx-small",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "x-small",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "small",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                },
            },
        });
    });
    test("should return a subset of MDN data into a subset of CSS syntaxes with parenthesis", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                color: {
                    syntax:
                        "<rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>",
                },
                "rgb()": {
                    syntax: "foo",
                },
                "rgba()": {
                    syntax: "bar",
                },
                "hsl()": {
                    syntax: "baz",
                },
                "hsla()": {
                    syntax: "qux",
                },
                "deprecated-system-color": {
                    syntax: "quux",
                },
            },
            types: mdnCSS.types,
        } as any;

        expect(mapCSSSyntaxes(subsetOfMDNCSS).color).toEqual({
            name: "color",
            value: {
                ref: [
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<rgb()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<rgba()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<hsl()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<hsla()>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<hex-color>",
                        refCombinatorType: "none",
                        type: "value",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<named-color>",
                        refCombinatorType: "none",
                        type: "value",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "currentcolor",
                        refCombinatorType: "none",
                        type: "value",
                    },
                    {
                        multiplier: null,
                        prepend: null,
                        ref: "<deprecated-system-color>",
                        refCombinatorType: "none",
                        type: "syntax",
                    },
                ],
                refCombinatorType: "exactlyOne",
            },
        });
    });
    test("should return a subset of MDN data into a subset of CSS syntaxes with numerals", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                foo: {
                    syntax: "3d | 2d | 42",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).toEqual({
            foo: {
                name: "foo",
                value: {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "3d",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "2d",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "42",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                },
            },
        });
    });
    test("should return a subset of MDN data into a subset of CSS syntaxes with capital letters", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                foo: {
                    syntax: "Foo | bAr | baT",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).toEqual({
            foo: {
                name: "foo",
                value: {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "Foo",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "bAr",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "baT",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                },
            },
        });
    });
});

describe("mapMixedCombinatorTypes", () => {
    test("should add brackets if there are multiple combinator types", () => {
        const syntax1: string = "foo | bar bat";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual("foo | [ bar bat ]");
        const syntax2: string = "foo bar | bat";
        expect(mapMixedCombinatorTypes(syntax2)).toEqual("[ foo bar ] | bat");
        const syntax3: string = "foo && bar || bat";
        expect(mapMixedCombinatorTypes(syntax3)).toEqual("[ foo && bar ] || bat");
        const syntax4: string = "foo || bar && bat";
        expect(mapMixedCombinatorTypes(syntax4)).toEqual("[ foo || bar ] && bat");
    });
    test("should not add brackets if all combinator types match", () => {
        const syntax: string = "foo | bar | bat";
        expect(mapMixedCombinatorTypes(syntax)).toEqual(syntax);
    });
    test("should add brackets if brackets already exist and there are multiple combinator types", () => {
        const syntax1: string = "[ foo | bar ] bat && baz";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual("[ [ foo | bar ] bat ] && baz");
        const syntax2: string = "[ foo bar ] | bat && baz";
        expect(mapMixedCombinatorTypes(syntax2)).toEqual("[ foo bar ] | [ bat && baz ]");
        const syntax3: string = "foo && baz [ bar || bat ]";
        expect(mapMixedCombinatorTypes(syntax3)).toEqual("[ foo && baz ] [ bar || bat ]");
        const syntax4: string = "foo || [ bar && bat ] baz";
        expect(mapMixedCombinatorTypes(syntax4)).toEqual("[ foo || [ bar && bat ] ] baz");
    });
    test("should not add brackets if brackets already exist and all combinator types match", () => {
        const syntax1: string = "[ [ foo | bar ] bat ] && baz";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual(syntax1);
        const syntax2: string = "[ [ foo bar ] | bat ] && baz";
        expect(mapMixedCombinatorTypes(syntax2)).toEqual(syntax2);
        const syntax3: string = "[ foo && baz ] [ bar || bat ]";
        expect(mapMixedCombinatorTypes(syntax3)).toEqual(syntax3);
        const syntax4: string = "[ foo || [ bar && bat ] ] baz";
        expect(mapMixedCombinatorTypes(syntax4)).toEqual(syntax4);
    });
    test("should not add brackets if multiple brackets exist and all combinator types match", () => {
        const syntax1: string =
            "foo | [ [ bar | baz ] || [ qux | quux | quuz | corge | grault ] ] | garply";
        expect(mapMixedCombinatorTypes(syntax1)).toEqual(syntax1);
    });
});
