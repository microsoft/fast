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
    MDNCSSSyntaxConfig,
    status,
} from "./mapping.mdn-data.types";
import { XOR } from "./type.utilities";

// Capture prepended string literals
const stringLiteralRegex = new RegExp(/(?<!.)(\/?,?) /);

/**
 * Multipliers regex
 */
const zeroOrMoreMultiplierRegex = new RegExp(/\*(?!.)/);
const oneOrMoreMultiplierRegex = new RegExp(/\+(?!.)/);
const zeroOrOneMultiplierRegex = new RegExp(/\?(?!.)/);
const atLeastATimesAtMostBTimesMultiplierRegex = new RegExp(/{(\d*),(\d*)}(?!.)/); // e.g. {1,4}
const oneOrMoreSeparatedByCommaMultiplierRegex = new RegExp(/#(?!.)/);
const atLeastOneMultiplierRegex = new RegExp(/!(?!.)/);
const allMultiplierRegex = new RegExp(/(?:\*|\+|\?|{\d*,\d*}|#|!)(?!.)/);

/**
 * Combinators regex
 */
const bracketsCombinatorRegex = new RegExp(
    /(?<!.)(?:\/|, )?\[(.*)\](#|\?|\*|!|\+|{\d*,\d*})?(?!.)/
);
const juxtapositionCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-z-]*'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: )(?!\||&))/
);
const mandatoryInAnyOrderCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-z-]*'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: && ))/
);
const atLeastOneInAnyOrderCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-z-]*'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: \|\| ))/
);
const exactlyOneCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-z-]*'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: \| ))/
);

/**
 * Brackets regex
 */
const openBracketRegex = new RegExp(/(\[)/g);
const closeBracketRegex = new RegExp(/(\])/g);

/**
 * Reference types regex
 */
const propertyRefRegex = new RegExp(/<'(.*)'>/);
const syntaxOrTypeRefRegex = new RegExp(/<(.*)>/);

/**
 * Split regex (splits all combination types)
 */
const splitRegex = new RegExp(
    /((?:\/|, )?(\[.*\])(?:\*|\+|\?|{\d*,\d*}|#|!)?)|((?:<?'?[a-z-]*'?>?)(?:\*|\+|\?|{\d*,\d*}|#|!)?)/g
);

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
 * The refrences can be to:
 * - CSS syntax such as <line-style> which are specified in the CSS syntax dictionary
 * - CSS types such as <length> which are specified in the CSS type dictionary
 * - CSS property such as <'margin-left'> which refers to another CSS property
 * - CSS value, such as auto which is a direct value representation
 * - CSS group, for example [ auto <length> ]?
 * - mixed, for example any one of the previous values
 */
export type CSSPropertyRefType =
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
    multiplier: Multiplier | null;
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
    multiplier: Multiplier | null;
}

export interface CSSBracketsSyntaxItem {
    ref: CSSBracketsSyntax[];
    refCombinatorType: CombinatorType;
}

export enum CombinatorType {
    brackets = "brackets",
    juxtaposition = "juxtaposition",
    mandatoryInAnyOrder = "mandatoryInAnyOrder",
    atLeastOneInAnyOrder = "atLeastOneInAnyOrder",
    exactlyOne = "exactlyOne",
    none = "none",
}

const combinatorTypeJuxtaposition: string = " ";
const combinatorTypeMandatoryInAnyOrder: string = " && ";
const combinatorTypeAtLeastOneInAnyOrder: string = " || ";
const combinatorTypeExactyleOne: string = " | ";

export enum MultiplierType {
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
 * Split items separated by combination types that are not brackets
 */
export function mapSplit(syntax: string): string[] {
    return syntax.match(splitRegex).filter((syntaxItem: string) => {
        return syntaxItem !== "";
    });
}

/**
 * Map information about string literals
 */
export function mapStringLiterals(syntax: string): "/" | "," | null {
    const stringLiteral = syntax.match(stringLiteralRegex);

    if (stringLiteral !== null) {
        return stringLiteral[1] as "/" | ",";
    }

    return null;
}

/**
 * Identify a multiplier if one exists
 */
export function mapMultiplierType(syntax: string): Multiplier | null {
    const zeroOrMore = syntax.match(zeroOrMoreMultiplierRegex);
    const oneOrMore = syntax.match(oneOrMoreMultiplierRegex);
    const zeroOrOne = syntax.match(zeroOrOneMultiplierRegex);
    const atLeastATimesAtMostBTimes = syntax.match(
        atLeastATimesAtMostBTimesMultiplierRegex
    );
    const oneOrMoreSeparatedByComma = syntax.match(
        oneOrMoreSeparatedByCommaMultiplierRegex
    );
    const atLeastOne = syntax.match(atLeastOneMultiplierRegex);

    if (zeroOrMore !== null) {
        return {
            type: MultiplierType.zeroOrMore,
        };
    }

    if (oneOrMore !== null) {
        return {
            type: MultiplierType.oneOrMore,
        };
    }

    if (zeroOrOne !== null) {
        return {
            type: MultiplierType.zeroOrOne,
        };
    }

    if (atLeastATimesAtMostBTimes !== null) {
        return {
            type: MultiplierType.atLeastATimesAtMostBTimes,
            range: [
                parseInt(atLeastATimesAtMostBTimes[1], 10),
                parseInt(atLeastATimesAtMostBTimes[2], 10),
            ],
        };
    }

    if (oneOrMoreSeparatedByComma !== null) {
        return {
            type: MultiplierType.oneOrMoreSeparatedByComma,
        };
    }

    if (atLeastOne !== null) {
        return {
            type: MultiplierType.atLeastOne,
        };
    }

    return null;
}

/**
 * Identify a combinator if one exists
 */
export function mapCombinatorType(syntax: string): CombinatorType {
    if (syntax.match(bracketsCombinatorRegex) !== null) {
        return CombinatorType.brackets;
    }

    if (syntax.match(mandatoryInAnyOrderCombinatorRegex) !== null) {
        return CombinatorType.mandatoryInAnyOrder;
    }

    if (syntax.match(atLeastOneInAnyOrderCombinatorRegex) !== null) {
        return CombinatorType.atLeastOneInAnyOrder;
    }

    if (syntax.match(exactlyOneCombinatorRegex) !== null) {
        return CombinatorType.exactlyOne;
    }

    if (syntax.match(juxtapositionCombinatorRegex) !== null) {
        return CombinatorType.juxtaposition;
    }

    return CombinatorType.none;
}

function getCombinatorSplitString(combinatorType: CombinatorType): string {
    switch (combinatorType) {
        case CombinatorType.juxtaposition:
            return combinatorTypeJuxtaposition;
        case CombinatorType.atLeastOneInAnyOrder:
            return combinatorTypeAtLeastOneInAnyOrder;
        case CombinatorType.exactlyOne:
            return combinatorTypeExactyleOne;
        case CombinatorType.mandatoryInAnyOrder:
            return combinatorTypeMandatoryInAnyOrder;
    }
}

/**
 * This normalizes already grouped items by ignoring them and their contents
 * by treating them as a single value
 */
function normalizeSplitForGroupedItems(syntaxSplitByCombinatorType: string[]): string[] {
    // In the case of grouped items already being present, the split will cause incorrect results
    if (
        syntaxSplitByCombinatorType.find((syntaxItem: string) => {
            return (
                syntaxItem.match(openBracketRegex) || syntaxItem.match(closeBracketRegex)
            );
        })
    ) {
        const firstOpenBracket: number = syntaxSplitByCombinatorType.findIndex(
            (syntaxItem: string) => {
                return syntaxItem.match(openBracketRegex);
            }
        );
        let bracketCount = 0;
        let matchingCloseBracket = 0;
        syntaxSplitByCombinatorType.forEach((syntaxItem: string, index: number) => {
            const matchedOpenBrackets = syntaxItem.match(openBracketRegex);
            const matchedCloseBrackets = syntaxItem.match(closeBracketRegex);

            if (matchedOpenBrackets) {
                bracketCount = bracketCount + matchedOpenBrackets.length;
            }

            if (matchedCloseBrackets) {
                bracketCount = bracketCount - matchedCloseBrackets.length;

                if (bracketCount === 0) {
                    matchingCloseBracket = index;
                }
            }
        });
        syntaxSplitByCombinatorType = [
            ...syntaxSplitByCombinatorType.slice(0, firstOpenBracket),
            syntaxSplitByCombinatorType
                .slice(firstOpenBracket, matchingCloseBracket + 1)
                .join(" "),
        ].concat(syntaxSplitByCombinatorType.slice(matchingCloseBracket + 1));
    }

    return syntaxSplitByCombinatorType;
}

/**
 * This normalizes some variables that might be incorrect due to juxtaposition,
 * which because it is a single space interferes with methods of splitting
 * that the other CombinatorTypes do not (" | ", " && ", " || ")
 */
function normalizeSplitForJuxtapositionedItems(
    containsMixedCombinatorTypes: boolean,
    indexLastSplitOccured: number,
    syntaxSplitByAllCombinatorTypes: string[],
    firstCombinatorType: CombinatorType,
    syntaxSplitByCombinatorType: string[]
): {
    containsMixedCombinatorTypes: boolean;
    indexLastSplitOccured: number;
    syntaxSplitByAllCombinatorTypes: string[];
} {
    if (firstCombinatorType === CombinatorType.juxtaposition) {
        let nextCombinatorAndSyntax: string | null = null;

        syntaxSplitByCombinatorType.forEach((syntaxItem: string, index: number) => {
            if (syntaxItem === "|" || syntaxItem === "||" || syntaxItem === "&&") {
                containsMixedCombinatorTypes = true;
                indexLastSplitOccured = index - 1;
                nextCombinatorAndSyntax = ` ${syntaxSplitByCombinatorType
                    .slice(index)
                    .join(" ")}`;
            }
        });

        if (nextCombinatorAndSyntax !== null) {
            syntaxSplitByAllCombinatorTypes = syntaxSplitByAllCombinatorTypes
                .slice(0, indexLastSplitOccured + 1)
                .concat([nextCombinatorAndSyntax]);
        }
    }

    return {
        containsMixedCombinatorTypes,
        indexLastSplitOccured,
        syntaxSplitByAllCombinatorTypes,
    };
}

/**
 * Maps mixed combinator types using brackets
 *
 * A pattern like "foo && bar bat"
 * should result in "[ foo && bar ] bat"
 */
export function mapMixedCombinatorTypes(syntax: string): string {
    // determine the first combinator type
    let mixedCombinatorTypes: string = syntax.trim();
    const firstCombinatorType: CombinatorType = mapCombinatorType(mixedCombinatorTypes);
    const combinatorSplitString: string = getCombinatorSplitString(firstCombinatorType);
    let syntaxSplitByCombinatorType: string[] = mixedCombinatorTypes.split(
        combinatorSplitString
    );
    let adjoiningCombinatorSplitString: string = "";

    syntaxSplitByCombinatorType = normalizeSplitForGroupedItems(
        syntaxSplitByCombinatorType
    );
    const normalizedForJuxtaposition = normalizeSplitForJuxtapositionedItems(
        false,
        0,
        mapSplit(mixedCombinatorTypes),
        firstCombinatorType,
        syntaxSplitByCombinatorType
    );
    let {
        containsMixedCombinatorTypes,
        indexLastSplitOccured,
    } = normalizedForJuxtaposition;
    const { syntaxSplitByAllCombinatorTypes } = normalizedForJuxtaposition;

    // go through, ignore grouped items but save them for recursion later,
    // until the next combinator that does not match is found
    syntaxSplitByCombinatorType.forEach((syntaxItem: string, index: number) => {
        const mappedCombinatorType = mapCombinatorType(syntaxItem);

        if (mappedCombinatorType !== "none" && mappedCombinatorType !== "brackets") {
            indexLastSplitOccured = index;
            adjoiningCombinatorSplitString = getCombinatorSplitString(
                mappedCombinatorType
            );
            containsMixedCombinatorTypes =
                typeof adjoiningCombinatorSplitString !== "undefined";

            return;
        }
    });

    // determine if there are multiple combinator types
    if (containsMixedCombinatorTypes) {
        // if the split is exactly one, wrap each item in the split
        if (firstCombinatorType === CombinatorType.exactlyOne) {
            mixedCombinatorTypes = `${syntaxSplitByCombinatorType
                .map((syntaxItem: string) => {
                    const mappedCombinatorType = mapCombinatorType(syntaxItem);

                    if (
                        mappedCombinatorType !== "none" &&
                        mappedCombinatorType !== "brackets"
                    ) {
                        return `[ ${syntaxItem} ]`;
                    }

                    return syntaxItem;
                })
                .join(combinatorSplitString)}`;
        } else {
            mixedCombinatorTypes = `[ ${syntaxSplitByAllCombinatorTypes
                .slice(0, indexLastSplitOccured + 1)
                .join(
                    combinatorSplitString
                )} ]${adjoiningCombinatorSplitString}${syntaxSplitByAllCombinatorTypes
                .slice(indexLastSplitOccured + 1)
                .join(combinatorSplitString)}`;
        }
    }

    return mixedCombinatorTypes;
}

/**
 * Maps an entity group if one exists
 */
export function mapGroupedEntities(syntax: string): string {
    const groupedEntities = syntax.match(bracketsCombinatorRegex);

    return groupedEntities[1].trim();
}

/**
 * Determine the reference type
 */
export function resolveReferenceType(
    syntax: string,
    combinatorType: CombinatorType,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertyRefType {
    if (combinatorType !== "none") {
        return "mixed";
    }

    const syntaxOrType = syntax.match(syntaxOrTypeRefRegex);

    if (syntax.match(propertyRefRegex) !== null) {
        return "property";
    }

    if (syntax.match(bracketsCombinatorRegex) !== null) {
        return "group";
    }

    if (syntaxOrType !== null) {
        if (
            syntaxKeys.find((syntaxKey: string) => {
                return syntaxKey === syntaxOrType[1];
            }) !== void 0
        ) {
            return "syntax";
        }

        if (
            typeKeys.find((typeKey: string) => {
                return typeKey === syntaxOrType[1];
            }) !== void 0
        ) {
            return "type";
        }
    }

    return "value";
}

/**
 * Resolve a syntax split using a combinator type
 */
export function resolveCSSPropertySyntaxSplit(
    syntax: string,
    type: CombinatorType
): string[] {
    switch (type) {
        case CombinatorType.atLeastOneInAnyOrder:
        case CombinatorType.exactlyOne:
        case CombinatorType.juxtaposition:
        case CombinatorType.mandatoryInAnyOrder:
            return mapSplit(syntax);
        default:
            return [syntax];
    }
}

/**
 * Resolve a properties reference
 */
export function resolveCSSPropertyReference(
    syntax: string,
    syntaxKeys: string[],
    typeKeys: string[]
): XOR<string, CSSPropertyRef[]> {
    const combinatorType: CombinatorType = mapCombinatorType(syntax);

    switch (combinatorType) {
        case CombinatorType.none: {
            const stringLiteral: "/" | "," | null = mapStringLiterals(syntax);
            const multiplier: Multiplier | null = mapMultiplierType(syntax);

            if (stringLiteral === null && multiplier === null) {
                return syntax;
            }

            const normalizedSyntax = syntax
                .replace(stringLiteralRegex, "")
                .replace(allMultiplierRegex, "");
            const refCombinatorType = mapCombinatorType(normalizedSyntax);

            return [
                {
                    type: resolveReferenceType(
                        syntax,
                        combinatorType,
                        syntaxKeys,
                        typeKeys
                    ),
                    ref:
                        refCombinatorType === CombinatorType.none
                            ? normalizedSyntax
                            : resolveCSSPropertyReference(
                                  normalizedSyntax,
                                  syntaxKeys,
                                  typeKeys
                              ),
                    refCombinatorType,
                    prepend: stringLiteral,
                    multiplier,
                },
            ];
        }
        case CombinatorType.brackets:
            return resolveCSSPropertyReference(
                mapGroupedEntities(syntax),
                syntaxKeys,
                typeKeys
            );
        default:
            return resolveCSSPropertySyntaxSplit(syntax.trim(), combinatorType).map(
                (itemSyntax: string) => {
                    const stringLiteral: "/" | "," | null = mapStringLiterals(itemSyntax);
                    const itemMultiplier = mapMultiplierType(itemSyntax);
                    const nSyntax = itemSyntax
                        .replace(stringLiteralRegex, "")
                        .replace(allMultiplierRegex, "");
                    const normalizedSyntax =
                        mapCombinatorType(nSyntax) === CombinatorType.brackets
                            ? mapGroupedEntities(nSyntax)
                            : nSyntax;
                    const itemCombinatorType = mapCombinatorType(normalizedSyntax);

                    return {
                        type: resolveReferenceType(
                            itemSyntax,
                            itemCombinatorType,
                            syntaxKeys,
                            typeKeys
                        ),
                        ref: resolveCSSPropertyReference(nSyntax, syntaxKeys, typeKeys),
                        refCombinatorType: itemCombinatorType,
                        prepend: stringLiteral,
                        multiplier: itemMultiplier,
                    };
                }
            );
    }
}

/**
 * Resolves to a CSS properties syntax
 */
export function resolveCSSPropertySyntax(
    mdnCSSPropertyConfig: MDNCSSPropertyConfig,
    cssProperty: string,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertySyntax {
    const normalizedSyntax =
        mapCombinatorType(mdnCSSPropertyConfig.syntax) === CombinatorType.brackets
            ? mapGroupedEntities(mdnCSSPropertyConfig.syntax)
            : mdnCSSPropertyConfig.syntax;
    const combinatorType = mapCombinatorType(normalizedSyntax);

    return {
        mapsToProperty: cssProperty,
        percentages: mdnCSSPropertyConfig.percentages,
        ref: resolveCSSPropertyReference(
            mdnCSSPropertyConfig.syntax,
            syntaxKeys,
            typeKeys
        ),
        refCombinatorType: combinatorType,
        multiplier: mapMultiplierType(mdnCSSPropertyConfig.syntax),
        prepend: mapStringLiterals(mdnCSSPropertyConfig.syntax),
        type: resolveReferenceType(
            mdnCSSPropertyConfig.syntax,
            combinatorType,
            syntaxKeys,
            typeKeys
        ),
    };
}

function conformsToOptions(
    cssPropertyMapOptions: CSSPropertyMapOptions,
    key: string,
    value: MDNCSSPropertyConfig
): boolean {
    let validatesAgainstOptions: boolean = true;

    if (
        cssPropertyMapOptions.status !== undefined &&
        cssPropertyMapOptions.status !== value.status
    ) {
        validatesAgainstOptions = false;
    }

    return validatesAgainstOptions;
}

/**
 * Maps MDN CSS properties to a CSS properties dictionary
 * for tooling consumption
 */
export function mapCSSProperties(
    mdnCSS: MDNCSS,
    cssPropertyMapOptions: CSSPropertyMapOptions = {}
): CSSPropertiesDictionary {
    const syntaxKeys: string[] = Object.keys(mdnCSS.syntaxes);
    const typeKeys: string[] = Object.keys(mdnCSS.types);

    return Object.entries(mdnCSS.properties).reduce<CSSPropertiesDictionary>(
        (
            resolvedDictionary: CSSPropertiesDictionary,
            currentCSSProperty: [string, MDNCSSPropertyConfig]
        ) => {
            if (
                conformsToOptions(
                    cssPropertyMapOptions,
                    currentCSSProperty[0],
                    currentCSSProperty[1]
                )
            ) {
                return {
                    ...resolvedDictionary,
                    [currentCSSProperty[0]]: {
                        name: currentCSSProperty[0],
                        appliesTo: currentCSSProperty[1].appliesto,
                        syntax: resolveCSSPropertySyntax(
                            {
                                ...currentCSSProperty[1],
                                syntax: mapMixedCombinatorTypes(
                                    currentCSSProperty[1].syntax
                                ),
                            },
                            currentCSSProperty[0],
                            syntaxKeys,
                            typeKeys
                        ),
                    },
                };
            }

            return resolvedDictionary;
        },
        {}
    );
}

export function resolveCSSSyntax(
    value: string,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSSyntaxRef {
    const normalizedSyntax =
        mapCombinatorType(value) === CombinatorType.brackets
            ? mapGroupedEntities(value)
            : value;
    const refCombinatorType = mapCombinatorType(normalizedSyntax);

    return {
        ref: resolveCSSPropertyReference(value, syntaxKeys, typeKeys),
        refCombinatorType,
    };
}

/**
 * Maps MDN CSS syntaxes to a CSS syntaxes dictionary
 * for tooling consumption
 */
export function mapCSSSyntaxes(mdnCSS: MDNCSS): CSSSyntaxDictionary {
    const syntaxKeys: string[] = Object.keys(mdnCSS.syntaxes);
    const typeKeys: string[] = Object.keys(mdnCSS.types);

    return Object.entries(mdnCSS.syntaxes)
        .map(
            ([key, value]: [string, MDNCSSSyntaxConfig]): CSSSyntax => {
                return {
                    name: key,
                    value: resolveCSSSyntax(value.syntax, syntaxKeys, typeKeys),
                };
            }
        )
        .reduce<CSSSyntaxDictionary>(
            (
                resolvedDictionary: CSSSyntaxDictionary,
                currentCSSSyntax: CSSSyntax
            ): CSSSyntaxDictionary => {
                return {
                    ...resolvedDictionary,
                    [currentCSSSyntax.name]: currentCSSSyntax,
                };
            },
            {}
        );
}
