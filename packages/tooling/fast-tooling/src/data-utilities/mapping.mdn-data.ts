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

/* eslint-disable  @typescript-eslint/no-use-before-define */

// Capture prepended string literals
const stringLiteralRegex = new RegExp(/(?<!.)(\/?,?) /);
const removeStringLiteralRegex = new RegExp(/((?:\/\s)?(,\s)?)/g);
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
const removeAllMultiplierRegex = new RegExp(/(?:\*|\+|\?|{\d*,\d*}|#|!)/g);

/**
 * Combinators regex
 */
const bracketsCombinatorRegex = new RegExp(
    /(?<!.)(?:\/|, )?\[(.*)\](#|\?|\*|!|\+|{\d*,\d*})?(?!.)/
);
const juxtapositionCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-zA-Z-\d?]*(?!})(?:\(\))?'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: )(?!\||&))/
);
const mandatoryInAnyOrderCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-zA-Z-\d?]*(?!})(?:\(\))?'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: && ))/
);
const atLeastOneInAnyOrderCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-zA-Z-\d?]*(?!})(?:\(\))?'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: \|\| ))/
);
const exactlyOneCombinatorRegex = new RegExp(
    /(?<!.)((?:(<?'?[a-zA-Z-\d?]*(?!})(?:\(\))?'?>?)|((?:\/|, )?\[(.*)\]))(#|\?|\*|!|\+|{\d*,\d*})?(?: \| ))/
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
    /((\[.*\])(?:\*|\+|\?|{\d*,\d*}|#|!)?)|((?:(?:\/ |, )?<?'?[a-zA-Z-\d?]*(?!})(?:\(\))?'?>?)(?:\*|\+|\?|{\d*,\d*}|#|!)?)/g
);

/**
 * The starting string for unique IDs used in syntax strings as placeholders
 */
const uuidPlaceholder: string = "uuid";

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

interface IsolatedSyntaxGroups {
    ref: XOR<string, IsolatedSyntaxGroups[]>;
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
    const normalizeSyntax = syntax
        .replace(removeAllMultiplierRegex, "")
        .replace(removeStringLiteralRegex, "");

    if (normalizeSyntax.match(bracketsCombinatorRegex) !== null) {
        return CombinatorType.brackets;
    }

    if (normalizeSyntax.match(mandatoryInAnyOrderCombinatorRegex) !== null) {
        return CombinatorType.mandatoryInAnyOrder;
    }

    if (normalizeSyntax.match(atLeastOneInAnyOrderCombinatorRegex) !== null) {
        return CombinatorType.atLeastOneInAnyOrder;
    }

    if (normalizeSyntax.match(exactlyOneCombinatorRegex) !== null) {
        return CombinatorType.exactlyOne;
    }

    if (normalizeSyntax.match(juxtapositionCombinatorRegex) !== null) {
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

export interface BracketAndMultiplier {
    endBracketIndex: number;
    endOfSyntaxIndex: number;
    multiplier: XOR<Multiplier, null>;
}

function resolveNextMultiplier(
    syntax: string,
    index: number,
    startingIndex: number
): BracketAndMultiplier {
    const nextCharacter = syntax[index + 1];
    const endBracketIndex: number = index + startingIndex;
    const multiplierOnlySyntax: string = syntax.slice(index + 1);

    for (
        let i = 0, multiplierOnlySyntaxLength = multiplierOnlySyntax.length;
        i < multiplierOnlySyntaxLength;
        i++
    ) {
        if (multiplierOnlySyntax[i] === undefined || multiplierOnlySyntax[i] === " ") {
            break;
        }
    }

    switch (nextCharacter) {
        case "#":
            return {
                endBracketIndex,
                endOfSyntaxIndex: endBracketIndex + 1,
                multiplier: {
                    type: MultiplierType.oneOrMoreSeparatedByComma,
                },
            };
        case "?":
            return {
                endBracketIndex,
                endOfSyntaxIndex: endBracketIndex + 1,
                multiplier: {
                    type: MultiplierType.zeroOrOne,
                },
            };
        case "!":
            return {
                endBracketIndex,
                endOfSyntaxIndex: endBracketIndex + 1,
                multiplier: {
                    type: MultiplierType.atLeastOne,
                },
            };
        case "*":
            return {
                endBracketIndex,
                endOfSyntaxIndex: endBracketIndex + 1,
                multiplier: {
                    type: MultiplierType.zeroOrMore,
                },
            };
        case "+":
            return {
                endBracketIndex,
                endOfSyntaxIndex: endBracketIndex + 1,
                multiplier: {
                    type: MultiplierType.oneOrMore,
                },
            };
        case "{":
            for (
                let i = index, syntaxItemLength = syntax.length;
                i < syntaxItemLength;
                i++
            ) {
                if (syntax[i] === "}") {
                    const matchedRange: RegExpMatchArray = syntax
                        .slice(0, i + 1)
                        .match(atLeastATimesAtMostBTimesMultiplierRegex);

                    return {
                        endBracketIndex,
                        endOfSyntaxIndex: i + startingIndex,
                        multiplier: {
                            type: MultiplierType.atLeastATimesAtMostBTimes,
                            range: [
                                parseInt(matchedRange[1], 10),
                                parseInt(matchedRange[2], 10),
                            ],
                        },
                    };
                }
            }
        default:
            return {
                endBracketIndex,
                endOfSyntaxIndex: index + startingIndex,
                multiplier: null,
            };
    }
}

function resolveEndOfGroupAndGroupMultiplier(
    syntax: string,
    startingIndex: number
): BracketAndMultiplier {
    let endOfGroupAndGroupMultiplier: BracketAndMultiplier;
    let openCount: number = 0;

    for (let i = 0, syntaxLength = syntax.length; i < syntaxLength; i++) {
        if (syntax[i] === "[") {
            openCount++;
        } else if (syntax[i] === "]") {
            openCount--;

            if (openCount === 0) {
                endOfGroupAndGroupMultiplier = resolveNextMultiplier(
                    syntax,
                    i,
                    startingIndex
                );

                break;
            }
        }
    }

    return endOfGroupAndGroupMultiplier;
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
export function mapCSSGroups(
    syntax: string,
    startingIndex: number = 0
): BracketSyntaxRange[] {
    const brackets: BracketSyntaxRange[] = [];

    for (let i = 0, syntaxLength = syntax.length; i < syntaxLength; i++) {
        if (syntax[i] === "[") {
            const endOfGroupAndGroupMultiplier: BracketAndMultiplier = resolveEndOfGroupAndGroupMultiplier(
                syntax.slice(i),
                i
            );
            const lastBracket: number = brackets.length - 1;

            if (
                brackets[lastBracket] &&
                endOfGroupAndGroupMultiplier.endOfSyntaxIndex <
                    brackets[lastBracket].range[1] &&
                brackets[lastBracket].contains === undefined
            ) {
                const locationsOfGroups: BracketSyntaxRange[] = mapCSSGroups(
                    syntax.slice(i, endOfGroupAndGroupMultiplier.endOfSyntaxIndex + 1),
                    i + startingIndex
                );
                let normalizedSyntax: string = brackets[lastBracket].syntax.slice(
                    2,
                    brackets[lastBracket].normalizedSyntax.length -
                        brackets[lastBracket].syntax.length +
                        2
                );
                brackets[lastBracket].contains = locationsOfGroups;

                for (
                    let i = 0, containedLength = brackets[lastBracket].contains.length;
                    i < containedLength;
                    i++
                ) {
                    normalizedSyntax = normalizedSyntax.replace(
                        brackets[lastBracket].contains[i].syntax,
                        locationsOfGroups[i].id
                    );
                }
                brackets[lastBracket].normalizedSyntax = normalizedSyntax;
            } else if (
                brackets.length === 0 ||
                brackets.findIndex((bracketItem: BracketSyntaxRange) => {
                    return (
                        bracketItem.range[1] <
                        endOfGroupAndGroupMultiplier.endOfSyntaxIndex + startingIndex
                    );
                }) !== -1
            ) {
                brackets.push({
                    id: `${uuidPlaceholder}${i + startingIndex}`,
                    syntax: syntax.slice(
                        i,
                        endOfGroupAndGroupMultiplier.endOfSyntaxIndex + 1
                    ),
                    normalizedSyntax: syntax.slice(
                        i + 2,
                        endOfGroupAndGroupMultiplier.endBracketIndex - 1
                    ),
                    range: [
                        i + startingIndex,
                        endOfGroupAndGroupMultiplier.endOfSyntaxIndex + startingIndex,
                    ],
                    multiplier: endOfGroupAndGroupMultiplier.multiplier,
                });
            }
        }
    }

    return brackets;
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

    if (combinatorType !== CombinatorType.none) {
        return "mixed";
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

function resolveCSS(
    syntax: string,
    combinatorType: CombinatorType,
    stringLiteral: "/" | "," | null,
    multiplier: Multiplier | null,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertyRef {
    return {
        ref: syntax.replace(stringLiteralRegex, "").replace(allMultiplierRegex, ""),
        type: resolveReferenceType(syntax, combinatorType, syntaxKeys, typeKeys),
        refCombinatorType: CombinatorType.none,
        prepend: stringLiteral,
        multiplier,
    };
}

function resolveCombinatorSplitCSSItems(
    splitByCombinatorType: string[],
    groups: BracketSyntaxRange[],
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertyRef[] {
    return splitByCombinatorType.map(
        (splitSyntaxItem: string): CSSPropertyRef => {
            const groupItemIndex = groups.findIndex((group: BracketSyntaxRange) => {
                return group.id === splitSyntaxItem;
            });

            if (groupItemIndex !== -1) {
                const stringLiteral: "/" | "," | null = mapStringLiterals(
                    groups[groupItemIndex].syntax
                );
                const multiplier: Multiplier | null = mapMultiplierType(
                    groups[groupItemIndex].syntax
                );
                const groupCombinatorType: CombinatorType = mapCombinatorType(
                    groups[groupItemIndex].normalizedSyntax
                );

                return {
                    ref: resolveCSSGroups(
                        groups[groupItemIndex].normalizedSyntax,
                        syntaxKeys,
                        typeKeys,
                        groups[groupItemIndex].contains
                    ),
                    refCombinatorType: groupCombinatorType,
                    type: "group",
                    prepend: stringLiteral,
                    multiplier,
                };
            } else {
                const stringLiteral: "/" | "," | null = mapStringLiterals(
                    splitSyntaxItem
                );
                const multiplier: Multiplier | null = mapMultiplierType(splitSyntaxItem);
                const normalizedSplitSyntaxItem = splitSyntaxItem
                    .replace(removeAllMultiplierRegex, "")
                    .replace(removeStringLiteralRegex, "");
                const itemCombinatorType: CombinatorType = mapCombinatorType(
                    normalizedSplitSyntaxItem
                );

                return resolveCSS(
                    splitSyntaxItem,
                    itemCombinatorType,
                    stringLiteral,
                    multiplier,
                    syntaxKeys,
                    typeKeys
                );
            }
        }
    );
}

function resolveCombinatorSplitCSS(
    syntax: string,
    syntaxKeys: string[],
    typeKeys: string[]
): CSSPropertyRef[] {
    const stringLiteral: "/" | "," | null = mapStringLiterals(syntax);
    const multiplier: Multiplier | null = mapMultiplierType(syntax);
    const combinatorType: CombinatorType = mapCombinatorType(syntax);
    const resolveSplitSyntax = resolveCSSPropertySyntaxSplit(
        syntax.trim(),
        combinatorType
    );

    return resolveSplitSyntax.map((resolvedSyntax: string) => {
        return resolveCSS(
            resolvedSyntax,
            mapCombinatorType(resolvedSyntax),
            stringLiteral,
            multiplier,
            syntaxKeys,
            typeKeys
        );
    });
}

function resolveCombinatorSplitCSSWithGroups(
    syntax: string,
    syntaxKeys: string[],
    typeKeys: string[],
    groups: BracketSyntaxRange[]
): CSSPropertyRef[] {
    const combinatorType: CombinatorType = mapCombinatorType(syntax);
    const splitByCombinatorType: string[] = resolveCSSPropertySyntaxSplit(
        syntax,
        combinatorType
    );

    return resolveCombinatorSplitCSSItems(
        splitByCombinatorType,
        groups,
        syntaxKeys,
        typeKeys
    );
}

/**
 * Takes a syntax string and creates a CSS group from it
 * then extrapolate the CSS groups into the CSSPropertyRef
 */
export function resolveCSSGroups(
    syntax: string,
    syntaxKeys: string[],
    typeKeys: string[],
    mappedGroups: BracketSyntaxRange[] = mapCSSGroups(syntax)
): CSSPropertyRef[] {
    if (mappedGroups.length === 0) {
        return resolveCombinatorSplitCSS(syntax, syntaxKeys, typeKeys);
    }

    let normalizedSyntax = syntax;

    mappedGroups.forEach(mappedGroup => {
        if (!normalizedSyntax.includes(mappedGroup.id)) {
            normalizedSyntax = normalizedSyntax.replace(
                mappedGroup.syntax,
                mappedGroup.id
            );
        }
    });

    return resolveCombinatorSplitCSSWithGroups(
        normalizedSyntax,
        syntaxKeys,
        typeKeys,
        mappedGroups
    );
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
    const ref = resolveCSSGroups(mdnCSSPropertyConfig.syntax, syntaxKeys, typeKeys);
    const type = resolveReferenceType(
        mdnCSSPropertyConfig.syntax,
        combinatorType,
        syntaxKeys,
        typeKeys
    );

    if ((combinatorType === "none" && typeof ref !== "string") || type === "group") {
        return {
            mapsToProperty: cssProperty,
            percentages: mdnCSSPropertyConfig.percentages,
            ...ref[0],
        };
    }

    return {
        mapsToProperty: cssProperty,
        percentages: mdnCSSPropertyConfig.percentages,
        ref: resolveCSSGroups(mdnCSSPropertyConfig.syntax, syntaxKeys, typeKeys),
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
            if (conformsToOptions(cssPropertyMapOptions, currentCSSProperty[1])) {
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
    const refCombinatorType = mapCombinatorType(value);

    return {
        ref: resolveCSSGroups(value, syntaxKeys, typeKeys),
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
