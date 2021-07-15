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
const uuidPlaceholder = "uuid";
export var CombinatorType;
(function (CombinatorType) {
    CombinatorType["brackets"] = "brackets";
    CombinatorType["juxtaposition"] = "juxtaposition";
    CombinatorType["mandatoryInAnyOrder"] = "mandatoryInAnyOrder";
    CombinatorType["atLeastOneInAnyOrder"] = "atLeastOneInAnyOrder";
    CombinatorType["exactlyOne"] = "exactlyOne";
    CombinatorType["none"] = "none";
})(CombinatorType || (CombinatorType = {}));
const combinatorTypeJuxtaposition = " ";
const combinatorTypeMandatoryInAnyOrder = " && ";
const combinatorTypeAtLeastOneInAnyOrder = " || ";
const combinatorTypeExactyleOne = " | ";
export var MultiplierType;
(function (MultiplierType) {
    MultiplierType["zeroOrMore"] = "zeroOrMore";
    MultiplierType["oneOrMore"] = "oneOrMore";
    MultiplierType["zeroOrOne"] = "zeroOrOne";
    MultiplierType["atLeastATimesAtMostBTimes"] = "atLeastATimesAtMostBTimes";
    MultiplierType["oneOrMoreSeparatedByComma"] = "oneOrMoreSeparatedByComma";
    MultiplierType["atLeastOne"] = "atLeastOne";
})(MultiplierType || (MultiplierType = {}));
/**
 * Split items separated by combination types that are not brackets
 */
export function mapSplit(syntax) {
    return syntax.match(splitRegex).filter(syntaxItem => {
        return syntaxItem !== "";
    });
}
/**
 * Map information about string literals
 */
export function mapStringLiterals(syntax) {
    const stringLiteral = syntax.match(stringLiteralRegex);
    if (stringLiteral !== null) {
        return stringLiteral[1];
    }
    return null;
}
/**
 * Identify a multiplier if one exists
 */
export function mapMultiplierType(syntax) {
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
export function mapCombinatorType(syntax) {
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
function getCombinatorSplitString(combinatorType) {
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
function normalizeSplitForGroupedItems(syntaxSplitByCombinatorType) {
    // In the case of grouped items already being present, the split will cause incorrect results
    if (
        syntaxSplitByCombinatorType.find(syntaxItem => {
            return (
                syntaxItem.match(openBracketRegex) || syntaxItem.match(closeBracketRegex)
            );
        })
    ) {
        const firstOpenBracket = syntaxSplitByCombinatorType.findIndex(syntaxItem => {
            return syntaxItem.match(openBracketRegex);
        });
        let bracketCount = 0;
        let matchingCloseBracket = 0;
        syntaxSplitByCombinatorType.forEach((syntaxItem, index) => {
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
    containsMixedCombinatorTypes,
    indexLastSplitOccured,
    syntaxSplitByAllCombinatorTypes,
    firstCombinatorType,
    syntaxSplitByCombinatorType
) {
    if (firstCombinatorType === CombinatorType.juxtaposition) {
        let nextCombinatorAndSyntax = null;
        syntaxSplitByCombinatorType.forEach((syntaxItem, index) => {
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
export function mapMixedCombinatorTypes(syntax) {
    // determine the first combinator type
    let mixedCombinatorTypes = syntax.trim();
    const firstCombinatorType = mapCombinatorType(mixedCombinatorTypes);
    const combinatorSplitString = getCombinatorSplitString(firstCombinatorType);
    let syntaxSplitByCombinatorType = mixedCombinatorTypes.split(combinatorSplitString);
    let adjoiningCombinatorSplitString = "";
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
    syntaxSplitByCombinatorType.forEach((syntaxItem, index) => {
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
                .map(syntaxItem => {
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
export function mapGroupedEntities(syntax) {
    const groupedEntities = syntax.match(bracketsCombinatorRegex);
    return groupedEntities[1].trim();
}
function resolveNextMultiplier(syntax, index, startingIndex) {
    const nextCharacter = syntax[index + 1];
    const endBracketIndex = index + startingIndex;
    const multiplierOnlySyntax = syntax.slice(index + 1);
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
                    const matchedRange = syntax
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
function resolveEndOfGroupAndGroupMultiplier(syntax, startingIndex) {
    let endOfGroupAndGroupMultiplier;
    let openCount = 0;
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
export function mapCSSGroups(syntax, startingIndex = 0) {
    const brackets = [];
    for (let i = 0, syntaxLength = syntax.length; i < syntaxLength; i++) {
        if (syntax[i] === "[") {
            const endOfGroupAndGroupMultiplier = resolveEndOfGroupAndGroupMultiplier(
                syntax.slice(i),
                i
            );
            const lastBracket = brackets.length - 1;
            if (
                brackets[lastBracket] &&
                endOfGroupAndGroupMultiplier.endOfSyntaxIndex <
                    brackets[lastBracket].range[1] &&
                brackets[lastBracket].contains === undefined
            ) {
                const locationsOfGroups = mapCSSGroups(
                    syntax.slice(i, endOfGroupAndGroupMultiplier.endOfSyntaxIndex + 1),
                    i + startingIndex
                );
                let normalizedSyntax = brackets[lastBracket].syntax.slice(
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
                brackets.findIndex(bracketItem => {
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
export function resolveReferenceType(syntax, combinatorType, syntaxKeys, typeKeys) {
    const syntaxOrType = syntax.match(syntaxOrTypeRefRegex);
    if (syntax.match(propertyRefRegex) !== null) {
        return "property";
    }
    if (syntax.match(bracketsCombinatorRegex) !== null) {
        return "group";
    }
    if (syntaxOrType !== null) {
        if (
            syntaxKeys.find(syntaxKey => {
                return syntaxKey === syntaxOrType[1];
            }) !== void 0
        ) {
            return "syntax";
        }
        if (
            typeKeys.find(typeKey => {
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
export function resolveCSSPropertySyntaxSplit(syntax, type) {
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
    syntax,
    combinatorType,
    stringLiteral,
    multiplier,
    syntaxKeys,
    typeKeys
) {
    return {
        ref: syntax.replace(stringLiteralRegex, "").replace(allMultiplierRegex, ""),
        type: resolveReferenceType(syntax, combinatorType, syntaxKeys, typeKeys),
        refCombinatorType: CombinatorType.none,
        prepend: stringLiteral,
        multiplier,
    };
}
function resolveCombinatorSplitCSSItems(
    splitByCombinatorType,
    groups,
    syntaxKeys,
    typeKeys
) {
    return splitByCombinatorType.map(splitSyntaxItem => {
        const groupItemIndex = groups.findIndex(group => {
            return group.id === splitSyntaxItem;
        });
        if (groupItemIndex !== -1) {
            const stringLiteral = mapStringLiterals(groups[groupItemIndex].syntax);
            const multiplier = mapMultiplierType(groups[groupItemIndex].syntax);
            const groupCombinatorType = mapCombinatorType(
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
            const stringLiteral = mapStringLiterals(splitSyntaxItem);
            const multiplier = mapMultiplierType(splitSyntaxItem);
            const normalizedSplitSyntaxItem = splitSyntaxItem
                .replace(removeAllMultiplierRegex, "")
                .replace(removeStringLiteralRegex, "");
            const itemCombinatorType = mapCombinatorType(normalizedSplitSyntaxItem);
            return resolveCSS(
                splitSyntaxItem,
                itemCombinatorType,
                stringLiteral,
                multiplier,
                syntaxKeys,
                typeKeys
            );
        }
    });
}
function resolveCombinatorSplitCSS(syntax, syntaxKeys, typeKeys) {
    const stringLiteral = mapStringLiterals(syntax);
    const multiplier = mapMultiplierType(syntax);
    const combinatorType = mapCombinatorType(syntax);
    const resolveSplitSyntax = resolveCSSPropertySyntaxSplit(
        syntax.trim(),
        combinatorType
    );
    return resolveSplitSyntax.map(resolvedSyntax => {
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
function resolveCombinatorSplitCSSWithGroups(syntax, syntaxKeys, typeKeys, groups) {
    const combinatorType = mapCombinatorType(syntax);
    const splitByCombinatorType = resolveCSSPropertySyntaxSplit(syntax, combinatorType);
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
    syntax,
    syntaxKeys,
    typeKeys,
    mappedGroups = mapCSSGroups(syntax)
) {
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
    mdnCSSPropertyConfig,
    cssProperty,
    syntaxKeys,
    typeKeys
) {
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
        return Object.assign(
            {
                mapsToProperty: cssProperty,
                percentages: mdnCSSPropertyConfig.percentages,
            },
            ref[0]
        );
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
function conformsToOptions(cssPropertyMapOptions, value) {
    let validatesAgainstOptions = true;
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
export function mapCSSProperties(mdnCSS, cssPropertyMapOptions = {}) {
    const syntaxKeys = Object.keys(mdnCSS.syntaxes);
    const typeKeys = Object.keys(mdnCSS.types);
    return Object.entries(mdnCSS.properties).reduce(
        (resolvedDictionary, currentCSSProperty) => {
            if (conformsToOptions(cssPropertyMapOptions, currentCSSProperty[1])) {
                return Object.assign(Object.assign({}, resolvedDictionary), {
                    [currentCSSProperty[0]]: {
                        name: currentCSSProperty[0],
                        appliesTo: currentCSSProperty[1].appliesto,
                        syntax: resolveCSSPropertySyntax(
                            Object.assign(Object.assign({}, currentCSSProperty[1]), {
                                syntax: mapMixedCombinatorTypes(
                                    currentCSSProperty[1].syntax
                                ),
                            }),
                            currentCSSProperty[0],
                            syntaxKeys,
                            typeKeys
                        ),
                    },
                });
            }
            return resolvedDictionary;
        },
        {}
    );
}
export function resolveCSSSyntax(value, syntaxKeys, typeKeys) {
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
export function mapCSSSyntaxes(mdnCSS) {
    const syntaxKeys = Object.keys(mdnCSS.syntaxes);
    const typeKeys = Object.keys(mdnCSS.types);
    return Object.entries(mdnCSS.syntaxes)
        .map(([key, value]) => {
            return {
                name: key,
                value: resolveCSSSyntax(value.syntax, syntaxKeys, typeKeys),
            };
        })
        .reduce((resolvedDictionary, currentCSSSyntax) => {
            return Object.assign(Object.assign({}, resolvedDictionary), {
                [currentCSSSyntax.name]: currentCSSSyntax,
            });
        }, {});
}
/**
 * Converts an inline CSS string to a property dictionary data format
 */
export function mapCSSInlineStyleToCSSPropertyDictionary(style) {
    const cssPropertyDictionary = {};
    if (style) {
        style.split(";").forEach(cssDeclaration => {
            const cssPropertyAndValue = cssDeclaration.split(":");
            if (cssPropertyAndValue.length === 2) {
                cssPropertyDictionary[
                    cssPropertyAndValue[0].trim()
                ] = cssPropertyAndValue[1].trim();
            }
        });
    }
    return cssPropertyDictionary;
}
