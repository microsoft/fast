import { expect } from "chai";
import { css as mdnCSS } from "mdn-data";
import {
    CombinatorType,
    mapCombinatorType,
    mapCSSGroups,
    mapCSSProperties,
    mapCSSSyntaxes,
    mapMixedCombinatorTypes,
    mapMultiplierType,
    mapStringLiterals,
    MultiplierType,
    resolveCSSGroups,
    resolveCSSPropertySyntax,
    resolveCSSPropertySyntaxSplit,
    resolveCSSSyntax,
    resolveReferenceType,
} from "./mapping.mdn-data";

describe("mapStringLiterals,", () => {
    it("should keep track of '/' and ',' as literals", () => {
        expect(mapStringLiterals("/ <length-percentage>")).to.equal("/");
        expect(mapStringLiterals("<length-percentage>")).to.equal(null);
        expect(mapStringLiterals(", <length-percentage>")).to.equal(",");
    });
});

describe("mapCSSGroups", () => {
    it("should map a single group", () => {
        expect(mapCSSGroups("foo [ bar ]+ baz")).to.deep.equal([
            {
                id: "uuid4",
                range: [4, 11],
                multiplier: {
                    type: MultiplierType.oneOrMore,
                },
                syntax: "[ bar ]+",
                normalizedSyntax: "bar",
            },
        ]);
    });
    it("should map multiple groups", () => {
        expect(mapCSSGroups("foo [ bar ]! baz [ quux ]")).to.deep.equal([
            {
                id: "uuid4",
                range: [4, 11],
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
                syntax: "[ bar ]!",
                normalizedSyntax: "bar",
            },
            {
                id: "uuid17",
                range: [17, 24],
                multiplier: null,
                syntax: "[ quux ]",
                normalizedSyntax: "quux",
            },
        ]);
    });
    it("should map a single nesting group", () => {
        expect(mapCSSGroups("foo [ bar [ bat ]? ]* baz")).to.deep.equal([
            {
                id: "uuid4",
                range: [4, 20],
                multiplier: {
                    type: MultiplierType.zeroOrMore,
                },
                syntax: "[ bar [ bat ]? ]*",
                normalizedSyntax: "bar uuid10",
                contains: [
                    {
                        id: "uuid10",
                        range: [10, 17],
                        multiplier: {
                            type: MultiplierType.zeroOrOne,
                        },
                        syntax: "[ bat ]?",
                        normalizedSyntax: "bat",
                    },
                ],
            },
        ]);
    });
    it("should map multiple nestings groups with multipliers", () => {
        expect(mapCSSGroups("foo [ bar [ bat [ baz ]{1,2} ]+ ]! quux")).to.deep.equal([
            {
                id: "uuid4",
                range: [4, 33],
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
                syntax: "[ bar [ bat [ baz ]{1,2} ]+ ]!",
                normalizedSyntax: "bar uuid10",
                contains: [
                    {
                        id: "uuid10",
                        range: [10, 30],
                        multiplier: {
                            type: MultiplierType.oneOrMore,
                        },
                        syntax: "[ bat [ baz ]{1,2} ]+",
                        normalizedSyntax: "bat uuid16",
                        contains: [
                            {
                                id: "uuid16",
                                range: [16, 27],
                                multiplier: {
                                    type: MultiplierType.atLeastATimesAtMostBTimes,
                                    range: [1, 2],
                                },
                                syntax: "[ baz ]{1,2}",
                                normalizedSyntax: "baz",
                            },
                        ],
                    },
                ],
            },
        ]);
    });
    it("should map multiple groups with nesting", () => {
        expect(mapCSSGroups("foo [ bar [ bat ] ] baz [ quux ]")).to.deep.equal([
            {
                id: "uuid4",
                range: [4, 18],
                multiplier: null,
                syntax: "[ bar [ bat ] ]",
                normalizedSyntax: "bar uuid10",
                contains: [
                    {
                        id: "uuid10",
                        range: [10, 16],
                        multiplier: null,
                        syntax: "[ bat ]",
                        normalizedSyntax: "bat",
                    },
                ],
            },
            {
                id: "uuid24",
                range: [24, 31],
                multiplier: null,
                syntax: "[ quux ]",
                normalizedSyntax: "quux",
            },
        ]);
    });
    it("should map groups with multipliers", () => {
        expect(
            mapCSSGroups(
                "foo [ bar ]# baz [ quux ]{1,4} bat [ fuzz ]? [ fazz ]* [ buzz ]! [ corge ]+ [ quz ]{1,6}"
            )
        ).to.deep.equal([
            {
                id: "uuid4",
                range: [4, 11],
                syntax: "[ bar ]#",
                normalizedSyntax: "bar",
                multiplier: {
                    type: MultiplierType.oneOrMoreSeparatedByComma,
                },
            },
            {
                id: "uuid17",
                range: [17, 29],
                syntax: "[ quux ]{1,4}",
                normalizedSyntax: "quux",
                multiplier: {
                    type: MultiplierType.atLeastATimesAtMostBTimes,
                    range: [1, 4],
                },
            },
            {
                id: "uuid35",
                range: [35, 43],
                syntax: "[ fuzz ]?",
                normalizedSyntax: "fuzz",
                multiplier: {
                    type: MultiplierType.zeroOrOne,
                },
            },
            {
                id: "uuid45",
                range: [45, 53],
                syntax: "[ fazz ]*",
                normalizedSyntax: "fazz",
                multiplier: {
                    type: MultiplierType.zeroOrMore,
                },
            },
            {
                id: "uuid55",
                range: [55, 63],
                syntax: "[ buzz ]!",
                normalizedSyntax: "buzz",
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
            },
            {
                id: "uuid65",
                range: [65, 74],
                syntax: "[ corge ]+",
                normalizedSyntax: "corge",
                multiplier: {
                    type: MultiplierType.oneOrMore,
                },
            },
            {
                id: "uuid76",
                range: [76, 87],
                syntax: "[ quz ]{1,6}",
                normalizedSyntax: "quz",
                multiplier: {
                    type: MultiplierType.atLeastATimesAtMostBTimes,
                    range: [1, 6],
                },
            },
        ]);
    });
});

describe("mapMultiplierType", () => {
    it("should find a zero or more multiplier type", () => {
        expect(mapMultiplierType("foo*")).to.deep.equal({
            type: MultiplierType.zeroOrMore,
        });
    });
    it("should find a one or more multiplier type", () => {
        expect(mapMultiplierType("foo+")).to.deep.equal({
            type: MultiplierType.oneOrMore,
        });
    });
    it("should find a zero or one multiplier type", () => {
        expect(mapMultiplierType("foo?")).to.deep.equal({
            type: MultiplierType.zeroOrOne,
        });
    });
    it("should find an at least A times at most B times multiplier type", () => {
        expect(mapMultiplierType("foo{1,3}")).to.deep.equal({
            type: MultiplierType.atLeastATimesAtMostBTimes,
            range: [1, 3],
        });
    });
    it("should find a one ore more separated by comma multiplier type", () => {
        expect(mapMultiplierType("foo#")).to.deep.equal({
            type: MultiplierType.oneOrMoreSeparatedByComma,
        });
    });
    it("should find an  at least one value multiplier type", () => {
        expect(mapMultiplierType("foo!")).to.deep.equal({
            type: MultiplierType.atLeastOne,
        });
    });
});

describe("mapCombinatorType", () => {
    it("should find a juxtaposition combination type", () => {
        expect(mapCombinatorType("foo bar bat")).to.equal(CombinatorType.juxtaposition);
        expect(
            mapCombinatorType("/ <length-percentage>! [ / <length-percentage>{1,4} ]?")
        ).to.equal(CombinatorType.juxtaposition);
        expect(
            mapCombinatorType("<'mask-border-width'>? [ / <'mask-border-outset'> ]")
        ).to.equal(CombinatorType.juxtaposition);
    });
    it("should find mandatory items in any order combination type", () => {
        expect(mapCombinatorType("foo && bar && bat")).to.equal(
            CombinatorType.mandatoryInAnyOrder
        );
    });
    it("should find at least one in any order combination type", () => {
        expect(mapCombinatorType("foo || bar || bat")).to.equal(
            CombinatorType.atLeastOneInAnyOrder
        );
    });
    it("should find exactly one combination type", () => {
        expect(mapCombinatorType("foo | bar | bat")).to.equal(CombinatorType.exactlyOne);
        expect(mapCombinatorType("[ <custom-ident> <integer>? ]+ | none")).to.equal(
            CombinatorType.exactlyOne
        );
    });
    it("should find group combination type", () => {
        expect(mapCombinatorType("[foo bar bat]{1,4}")).to.equal(CombinatorType.brackets);
    });
    it("should find none if no combination types are found", () => {
        expect(mapCombinatorType("foo")).to.equal(CombinatorType.none);
    });
});

describe("resolveReferenceType", () => {
    it("should resolve a reference of type syntax", () => {
        expect(
            resolveReferenceType("<line-style>", CombinatorType.none, ["line-style"], [])
        ).to.equal("syntax");
    });
    it("should resolve a reference of type types", () => {
        expect(
            resolveReferenceType("<length>", CombinatorType.none, [], ["length"])
        ).to.equal("type");
    });
    it("should resolve a reference of type property", () => {
        expect(
            resolveReferenceType("<'margin-left'>", CombinatorType.none, [], [])
        ).to.equal("property");
    });
    it("should resolve a reference of type value", () => {
        expect(
            resolveReferenceType("<line-style>", CombinatorType.none, [], [])
        ).to.equal("value");
        expect(resolveReferenceType("<length>", CombinatorType.none, [], [])).to.equal(
            "value"
        );
        expect(resolveReferenceType("auto", CombinatorType.none, [], [])).to.equal(
            "value"
        );
    });
});

describe("resolveCSSPropertySyntaxSplit", () => {
    it("should split by at least one in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit(
                "foo || bar",
                CombinatorType.atLeastOneInAnyOrder
            )
        ).to.deep.equal(["foo", "bar"]);
    });
    it("should split by exactly one", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo | bar", CombinatorType.juxtaposition)
        ).to.deep.equal(["foo", "bar"]);
        expect(
            resolveCSSPropertySyntaxSplit(
                "[ <custom-ident> <integer>? ]+ | none",
                CombinatorType.juxtaposition
            )
        ).to.deep.equal(["[ <custom-ident> <integer>? ]+", "none"]);
    });
    it("should split by juxtaposition", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo bar", CombinatorType.juxtaposition)
        ).to.deep.equal(["foo", "bar"]);
    });
    it("should split by mandatory in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foo && bar", CombinatorType.juxtaposition)
        ).to.deep.equal(["foo", "bar"]);
    });
    it("should split by mandatory in any order", () => {
        expect(
            resolveCSSPropertySyntaxSplit("foobar", CombinatorType.none)
        ).to.deep.equal(["foobar"]);
    });
});

describe("resolveCSSGroups", () => {
    it("should resolve a simple string referece", () => {
        expect(resolveCSSGroups("<length>", [], [])).to.deep.equal([
            {
                multiplier: null,
                prepend: null,
                ref: "<length>",
                refCombinatorType: CombinatorType.none,
                type: "value",
            },
        ]);
    });
    it("should resolve a reference with multipliers and prepended string literals", () => {
        expect(resolveCSSGroups("/ <length>?", [], ["length"])).to.deep.equal([
            {
                multiplier: {
                    type: MultiplierType.zeroOrOne,
                },
                prepend: "/",
                ref: "<length>",
                refCombinatorType: CombinatorType.none,
                type: "type",
            },
        ]);
    });
    it("should resolve a nested reference", () => {
        resolveCSSGroups(
            "<color>{1,4} [ / <length-percentage>{1,4} ]?",
            [],
            ["color", "length-percentage"]
        );
        expect(
            resolveCSSGroups(
                "<color>{1,4} [ / <length-percentage>{1,4} ]?",
                [],
                ["color", "length-percentage"]
            )
        ).to.deep.equal([
            {
                multiplier: {
                    range: [1, 4],
                    type: "atLeastATimesAtMostBTimes",
                },
                prepend: null,
                ref: "<color>",
                refCombinatorType: "none",
                type: "type",
            },
            {
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: null,
                ref: [
                    {
                        multiplier: {
                            range: [1, 4],
                            type: "atLeastATimesAtMostBTimes",
                        },
                        prepend: "/",
                        ref: "<length-percentage>",
                        refCombinatorType: "none",
                        type: "type",
                    },
                ],
                refCombinatorType: "none",
                type: "group",
            },
        ]);

        expect(
            resolveCSSGroups(
                "[ / <'mask-border-width'>! [ / <'mask-border-outset'> ]? ]?",
                [],
                []
            )
        ).to.deep.equal([
            {
                multiplier: {
                    type: "zeroOrOne",
                },
                prepend: null,
                ref: [
                    {
                        multiplier: {
                            type: "atLeastOne",
                        },
                        prepend: "/",
                        ref: "<'mask-border-width'>",
                        refCombinatorType: "none",
                        type: "property",
                    },
                    {
                        multiplier: {
                            type: "zeroOrOne",
                        },
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
                        type: "group",
                    },
                ],
                refCombinatorType: "juxtaposition",
                type: "group",
            },
        ]);
    });
});

describe("resolveCSSPropertySyntax", () => {
    it("should resolve a CSS properties syntax without shorthand properties", () => {
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
        ).to.deep.equal({
            mapsToProperty: "background-color",
            percentages: "no",
            ref: "<color>",
            multiplier: null,
            prepend: null,
            type: "type",
            refCombinatorType: CombinatorType.none,
        });
    });
    it("should resolve a CSS properties syntax with shorthand properties", () => {
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
        ).to.deep.equal({
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
        });
    });
    it("should resolve a CSS properties syntax with a single syntax", () => {
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
        ).to.deep.equal({
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
    it("should return a subset of MDN data into a subset of CSS properties ", () => {
        const subsetOfMDNCSS = {
            properties: {
                border: mdnCSS.properties.border,
            },
            syntaxes: mdnCSS.syntaxes,
            types: mdnCSS.types,
        } as any;

        expect(mapCSSProperties(subsetOfMDNCSS)).to.deep.equal({
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
        it("should check for status", () => {
            const subsetOfMDNCSS = {
                properties: {
                    "--*": mdnCSS.properties["--*"],
                    border: mdnCSS.properties.border,
                },
                syntaxes: mdnCSS.syntaxes,
                types: mdnCSS.types,
            } as any;

            expect(
                mapCSSProperties(subsetOfMDNCSS, { status: "standard" })
            ).to.deep.equal({
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
    it("should resolve a CSS syntax without grouped items", () => {
        expect(resolveCSSSyntax("xx-small | x-small | small", [], [])).to.deep.equal({
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
    it("should resolve a CSS syntax with grouped items", () => {
        expect(resolveCSSSyntax("foo [ bar | bat ]", [], [])).to.deep.equal({
            ref: [
                {
                    multiplier: null,
                    prepend: null,
                    ref: "foo",
                    refCombinatorType: "none",
                    type: "value",
                },
                {
                    ref: [
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "bar",
                            refCombinatorType: "none",
                            type: "value",
                        },
                        {
                            multiplier: null,
                            prepend: null,
                            ref: "bat",
                            refCombinatorType: "none",
                            type: "value",
                        },
                    ],
                    refCombinatorType: "exactlyOne",
                    multiplier: null,
                    prepend: null,
                    type: "group",
                },
            ],
            refCombinatorType: "juxtaposition",
        });
    });
});

describe("mapCSSSyntaxes", () => {
    it("should return a subset of MDN data into a subset of CSS syntaxes", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                "absolute-size": {
                    syntax: "xx-small | x-small | small",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).to.deep.equal({
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
    it("should return a subset of MDN data into a subset of CSS syntaxes with parenthesis", () => {
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

        expect(mapCSSSyntaxes(subsetOfMDNCSS).color).to.deep.equal({
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
    it("should return a subset of MDN data into a subset of CSS syntaxes with numerals", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                foo: {
                    syntax: "3d | 2d | 42",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).to.deep.equal({
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
    it("should return a subset of MDN data into a subset of CSS syntaxes with capital letters", () => {
        const subsetOfMDNCSS = {
            properties: {},
            syntaxes: {
                foo: {
                    syntax: "Foo | bAr | baT",
                },
            },
            types: mdnCSS.types,
        } as any;
        expect(mapCSSSyntaxes(subsetOfMDNCSS)).to.deep.equal({
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
    it("should add brackets if there are multiple combinator types", () => {
        const syntax1: string = "foo | bar bat";
        expect(mapMixedCombinatorTypes(syntax1)).to.equal("foo | [ bar bat ]");
        const syntax2: string = "foo bar | bat";
        expect(mapMixedCombinatorTypes(syntax2)).to.equal("[ foo bar ] | bat");
        const syntax3: string = "foo && bar || bat";
        expect(mapMixedCombinatorTypes(syntax3)).to.equal("[ foo && bar ] || bat");
        const syntax4: string = "foo || bar && bat";
        expect(mapMixedCombinatorTypes(syntax4)).to.equal("[ foo || bar ] && bat");
    });
    it("should not add brackets if all combinator types match", () => {
        const syntax: string = "foo | bar | bat";
        expect(mapMixedCombinatorTypes(syntax)).to.equal(syntax);
    });
    it("should add brackets if brackets already exist and there are multiple combinator types", () => {
        const syntax1: string = "[ foo | bar ] bat && baz";
        expect(mapMixedCombinatorTypes(syntax1)).to.equal("[ [ foo | bar ] bat ] && baz");
        const syntax2: string = "[ foo bar ] | bat && baz";
        expect(mapMixedCombinatorTypes(syntax2)).to.equal("[ foo bar ] | [ bat && baz ]");
        const syntax3: string = "foo && baz [ bar || bat ]";
        expect(mapMixedCombinatorTypes(syntax3)).to.equal(
            "[ foo && baz ] [ bar || bat ]"
        );
        const syntax4: string = "foo || [ bar && bat ] baz";
        expect(mapMixedCombinatorTypes(syntax4)).to.equal(
            "[ foo || [ bar && bat ] ] baz"
        );
    });
    it("should not add brackets if brackets already exist and all combinator types match", () => {
        const syntax1: string = "[ [ foo | bar ] bat ] && baz";
        expect(mapMixedCombinatorTypes(syntax1)).to.equal(syntax1);
        const syntax2: string = "[ [ foo bar ] | bat ] && baz";
        expect(mapMixedCombinatorTypes(syntax2)).to.equal(syntax2);
        const syntax3: string = "[ foo && baz ] [ bar || bat ]";
        expect(mapMixedCombinatorTypes(syntax3)).to.equal(syntax3);
        const syntax4: string = "[ foo || [ bar && bat ] ] baz";
        expect(mapMixedCombinatorTypes(syntax4)).to.equal(syntax4);
    });
    it("should not add brackets if multiple brackets exist and all combinator types match", () => {
        const syntax1: string =
            "foo | [ [ bar | baz ] || [ qux | quux | quuz | corge | grault ] ] | garply";
        expect(mapMixedCombinatorTypes(syntax1)).to.equal(syntax1);
    });
});
