/**
 * This file includes utilities to convert data from the mdn-data package
 * into a format that will be written to the src directory as part of
 * the exported package.
 *
 * The files follow the Value Definition Syntax
 * Defined here: https://developer.mozilla.org/en-US/docs/Web/CSS/Value_definition_syntax
 */
import {
    appliesto,
    MDNCSS,
    MDNCSSPropertyConfig,
    status,
} from "./mapping.mdn-data.types";
import { XOR } from "./type.utilities";
export interface CSSProperty {
    /**
     * The name of the CSS property
     */
    name: string;
    /**
     * The elements that this CSS property applies to
     */
    appliesTo: appliesto;
    /**
     * A list of syntaxes
     */
    syntax: CSSPropertySyntax;
}
/**
 * A dictionary of CSS properties
 */
export interface CSSPropertiesDictionary {
    [key: string]: CSSProperty;
}
/**
 * A dictionary of CSS declarations
 */
export interface CSSDeclarationDictionary {
    [key: string]: string;
}
/**
 * The refrences can be to:
 * - CSS syntax such as <line-style> which are specified in the CSS syntax dictionary
 * - CSS types such as <length> which are specified in the CSS type dictionary
 * - CSS property such as <'margin-left'> which refers to another CSS property
 * - CSS value, such as auto which is a direct value representation
 * - CSS group, for example [ auto <length> ]?
 * - mixed, for example any one of the previous values
 */
export declare type CSSPropertyRefType =
    | "syntax"
    | "type"
    | "property"
    | "value"
    | "group"
    | "mixed";
export interface CSSPropertyRef {
    /**
     * The type of reference this is
     */
    type: CSSPropertyRefType;
    /**
     * The reference
     */
    ref: XOR<string, CSSPropertyRef[]>;
    /**
     * The references combinator type
     */
    refCombinatorType: CombinatorType;
    /**
     * A string literal prepending this value
     */
    prepend: "/" | "," | null;
    /**
     * The multiplier this uses
     */
    multiplier: XOR<Multiplier, null>;
}
export interface CSSPropertySyntax extends CSSPropertyRef {
    /**
     * The name of the property this maps to
     */
    mapsToProperty: string;
    /**
     * The type of percentages configuration this property can accept
     */
    percentages: string;
}
export interface CSSBracketsSyntax {
    /**
     * The syntax string to evaluate
     */
    ref: XOR<string, CSSPropertyRef[]>;
    /**
     * The multiplier this sytax uses
     */
    multiplier: XOR<Multiplier, null>;
}
export interface CSSBracketsSyntaxItem {
    ref: CSSBracketsSyntax[];
    refCombinatorType: CombinatorType;
}
export declare enum CombinatorType {
    brackets = "brackets",
    juxtaposition = "juxtaposition",
    mandatoryInAnyOrder = "mandatoryInAnyOrder",
    atLeastOneInAnyOrder = "atLeastOneInAnyOrder",
    exactlyOne = "exactlyOne",
    none = "none",
}
export declare enum MultiplierType {
    zeroOrMore = "zeroOrMore",
    oneOrMore = "oneOrMore",
    zeroOrOne = "zeroOrOne",
    atLeastATimesAtMostBTimes = "atLeastATimesAtMostBTimes",
    oneOrMoreSeparatedByComma = "oneOrMoreSeparatedByComma",
    atLeastOne = "atLeastOne",
}
export interface MultiplierRange {
    /**
     * The start of the range
     */
    0: number;
    /**
     * The end of the range
     */
    1: number;
}
export interface Multiplier {
    /**
     * The type of multiplier this is
     */
    type: MultiplierType;
    /**
     * The values for this multiplier
     * currently only applies to atLeastATimesAtMostBTimes
     */
    range?: MultiplierRange;
}
export interface CSSSyntaxValue {
    /**
     * The name of the CSS syntax
     */
    name: string;
    /**
     * The value types for this syntax
     */
    values: string[];
}
export interface CSSSyntaxMap {
    [key: string]: CSSSyntaxValue;
}
export interface CSSSyntax {
    /**
     * The syntax name
     */
    name: string;
    /**
     * A list of syntaxes
     */
    value: CSSSyntaxRef;
}
export interface CSSSyntaxRef {
    /**
     * The reference
     */
    ref: XOR<string, CSSPropertyRef[]>;
    /**
     * The references combinator type
     */
    refCombinatorType: CombinatorType;
}
export interface CSSSyntaxDictionary {
    [key: string]: CSSSyntax;
}
export interface CSSPropertyMapOptions {
    status?: status;
}
/**
 * A range of syntax which includes brackets
 */
interface BracketSyntaxRange {
    /**
     * The start and end of the selected brackets
     */
    range: number[];
    /**
     * The syntax for this range
     */
    syntax: string;
    /**
     * The normalized syntax for this range
     */
    normalizedSyntax: string;
    /**
     * The id for this range
     */
    id: string;
    /**
     * Any bracket ranges contained by the selected range
     */
    contains?: BracketSyntaxRange[];
    /**
     * The multiplier for this range
     */
    multiplier: XOR<Multiplier, null>;
}
/**
 * Split items separated by combination types that are not brackets
 */
export declare function mapSplit(syntax: string): string[];
/**
 * Map information about string literals
 */
export declare function mapStringLiterals(syntax: string): "/" | "," | null;
/**
 * Identify a multiplier if one exists
 */
export declare function mapMultiplierType(syntax: string): Multiplier | null;
/**
 * Identify a combinator if one exists
 */
export declare function mapCombinatorType(syntax: string): CombinatorType;
/**
 * Maps mixed combinator types using brackets
 *
 * A pattern like "foo && bar bat"
 * should result in "[ foo && bar ] bat"
 */
export declare function mapMixedCombinatorTypes(syntax: string): string;
/**
 * Maps an entity group if one exists
 */
export declare function mapGroupedEntities(syntax: string): string;
export interface BracketAndMultiplier {
    endBracketIndex: number;
    endOfSyntaxIndex: number;
    multiplier: XOR<Multiplier, null>;
}
/**
 * Gets the location of grouped items in a syntax string
 *
 * Example:
 * "foo [ bar [ bat ] ] baz [ quux ]"
 *
 * Result:
 * [
 *     {
 *         id: "uuid4",
 *         range: [4, 18], // [ bar [ bat ] ]
 *         normalizedSyntax: "bar uuid4",
 *         syntax: "[ bar [ bat ] ]",
 *         contains: [
 *             {
 *                 id: "uuid10",
 *                 range: [10, 16] // [ bat ]
 *                 normalizedSyntax: "bat",
 *                 syntax: "[ bat ]"
 *             }
 *         ]
 *     },
 *     {
 *         id: "uuid24",
 *         range: [24, 31] // [ quux ]
 *         normalizedSyntax: "quux",
 *         syntax: "[ quux ]"
 *     }
 * ]
 */
export declare function mapCSSGroups(
    syntax: string,
    startingIndex?: number
): BracketSyntaxRange[];
/**
 * Determine the reference type
 */
export declare function resolveReferenceType(
    syntax: string,
    combinatorType: CombinatorType,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertyRefType;
/**
 * Resolve a syntax split using a combinator type
 */
export declare function resolveCSSPropertySyntaxSplit(
    syntax: string,
    type: CombinatorType
): string[];
/**
 * Takes a syntax string and creates a CSS group from it
 * then extrapolate the CSS groups into the CSSPropertyRef
 */
export declare function resolveCSSGroups(
    syntax: string,
    syntaxKeys: string[],
    typeKeys: string[],
    mappedGroups?: BracketSyntaxRange[]
): CSSPropertyRef[];
/**
 * Resolves to a CSS properties syntax
 */
export declare function resolveCSSPropertySyntax(
    mdnCSSPropertyConfig: MDNCSSPropertyConfig,
    cssProperty: string,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertySyntax;
/**
 * Maps MDN CSS properties to a CSS properties dictionary
 * for tooling consumption
 */
export declare function mapCSSProperties(
    mdnCSS: MDNCSS,
    cssPropertyMapOptions?: CSSPropertyMapOptions
): CSSPropertiesDictionary;
export declare function resolveCSSSyntax(
    value: string,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSSyntaxRef;
/**
 * Maps MDN CSS syntaxes to a CSS syntaxes dictionary
 * for tooling consumption
 */
export declare function mapCSSSyntaxes(mdnCSS: MDNCSS): CSSSyntaxDictionary;
/**
 * Converts an inline CSS string to a property dictionary data format
 */
export declare function mapCSSInlineStyleToCSSPropertyDictionary(
    style: string
): CSSDeclarationDictionary;
export {};
