import {
    attributeDirectivePrefix,
    clientSideCloseExpression,
    clientSideOpenExpression,
    closeExpression,
    openExpression,
    repeatDirectiveClose,
    repeatDirectiveOpen,
    unescapedCloseExpression,
    unescapedOpenExpression,
    whenDirectiveClose,
    whenDirectiveOpen,
} from "./syntax.js";
import type {
    AttributeDataBindingBehaviorConfig,
    AttributeDirectiveBindingBehaviorConfig,
    BaseDataBindingBehaviorConfig,
    DataBindingBehaviorConfig,
    DataBindingBindingType,
    TemplateDirective,
    TemplateDirectiveBehaviorConfig,
} from "./utilities.js";

/**
 * Get the index of the next matching tag
 * @param openingTagStartSlice - The slice starting from the opening tag
 * @param openingTag - The opening tag string
 * @param closingTag - The closing tag
 * @param openingTagStartIndex - The opening tag start index derived from the innerHTML
 * @returns index
 * @public
 */
export function getIndexOfNextMatchingTag(
    openingTagStartSlice: string,
    openingTag: string,
    closingTag: string,
    openingTagStartIndex: number,
): number {
    let tagCount = 1;
    let matchingCloseTagIndex = -1;
    const openingTagLength = openingTag.length;
    const closingTagLength = closingTag.length;
    let nextSlice = openingTagStartSlice.slice(openingTagLength);
    let nextOpenTag = nextSlice.indexOf(openingTag);
    let nextCloseTag = nextSlice.indexOf(closingTag);
    let tagOffset = openingTagStartIndex + openingTagLength;

    do {
        // if a closing tag has been found for the last open tag, decrement the tag count
        if (nextOpenTag > nextCloseTag || nextOpenTag === -1) {
            tagCount--;

            if (tagCount === 0) {
                matchingCloseTagIndex = nextCloseTag + tagOffset;
                break;
            }

            tagOffset += nextCloseTag + closingTagLength;
            nextSlice = nextSlice.slice(nextCloseTag + closingTagLength);
            nextOpenTag = nextSlice.indexOf(openingTag);
            nextCloseTag = nextSlice.indexOf(closingTag);
        } else if (nextOpenTag !== -1) {
            tagCount++;
            tagOffset += nextOpenTag + openingTagLength;
            nextSlice = nextSlice.slice(nextOpenTag + openingTagLength);
            nextOpenTag = nextSlice.indexOf(openingTag);
            nextCloseTag = nextSlice.indexOf(closingTag);
        }

        if (tagCount === 0) {
            matchingCloseTagIndex = nextCloseTag + tagOffset;
            break;
        }
    } while (tagCount > 0);

    return matchingCloseTagIndex;
}

function getNextDirectiveBehavior(
    innerHTML: string,
    searchHTML: string,
): TemplateDirectiveBehaviorConfig {
    const whenIndex = searchHTML.indexOf(whenDirectiveOpen);
    const repeatIndex = searchHTML.indexOf(repeatDirectiveOpen);
    const isWhen = whenIndex !== -1 && (repeatIndex === -1 || whenIndex < repeatIndex);
    const openingTag = isWhen ? whenDirectiveOpen : repeatDirectiveOpen;
    const closingTag = isWhen ? whenDirectiveClose : repeatDirectiveClose;
    const directiveTag: TemplateDirective = isWhen ? "when" : "repeat";
    const openingTagStartIndex = isWhen ? whenIndex : repeatIndex;
    const openingTagStartSlice = innerHTML.slice(openingTagStartIndex);
    const openingTagEndIndex =
        openingTagStartSlice.indexOf(`">`) + openingTagStartIndex + 2;
    const directiveValue = getNextDataBindingBehavior(innerHTML, searchHTML);
    const matchingCloseTagIndex = getIndexOfNextMatchingTag(
        searchHTML.slice(openingTagStartIndex),
        openingTag,
        closingTag,
        openingTagStartIndex,
    );

    return {
        type: "templateDirective",
        name: directiveTag,
        value: innerHTML.slice(
            directiveValue.openingEndIndex,
            directiveValue.closingStartIndex,
        ),
        openingTagStartIndex,
        openingTagEndIndex,
        closingTagStartIndex: matchingCloseTagIndex,
        closingTagEndIndex: matchingCloseTagIndex + closingTag.length,
    };
}

export function isAttribute(innerHTML: string, openingStartIndex: number): boolean {
    return innerHTML.slice(openingStartIndex - 2, openingStartIndex - 1) === "=";
}

function isAttributeDirective(innerHTML: string, openingStartIndex: number): boolean {
    const splitHTML = innerHTML.slice(0, openingStartIndex - 2).split(" ");
    return splitHTML[splitHTML.length - 1].startsWith(attributeDirectivePrefix);
}

function getAttributeDataBindingConfig(
    innerHTML: string,
    config: BaseDataBindingBehaviorConfig,
): AttributeDataBindingBehaviorConfig {
    const splitInnerHTML = innerHTML.slice(0, config.openingStartIndex).split(" ");
    const firstCharOfAttribute = splitInnerHTML[splitInnerHTML.length - 1][0];
    const aspect =
        firstCharOfAttribute === "?" ||
        firstCharOfAttribute === "@" ||
        firstCharOfAttribute === ":"
            ? firstCharOfAttribute
            : null;

    return {
        ...config,
        subtype: "attribute",
        aspect,
    };
}

function getAttributeDirectiveDataBindingConfig(
    innerHTML: string,
    config: BaseDataBindingBehaviorConfig,
): AttributeDirectiveBindingBehaviorConfig {
    const splitInnerHTML = innerHTML.slice(0, config.openingStartIndex).split(" ");
    const lastItem = splitInnerHTML[splitInnerHTML.length - 1];
    const equals = lastItem.indexOf("=");
    const name = lastItem.slice(2, equals);

    return {
        ...config,
        subtype: "attributeDirective",
        name: name as AttributeDirectiveBindingBehaviorConfig["name"],
    };
}

interface NextDataBindingBehaviorConfig {
    openingStartIndex: number;
    closingStartIndex: number;
    bindingType: DataBindingBindingType;
}

function getIndexAndBindingTypeOfNextDataBindingBehavior(
    innerHTML: string,
): NextDataBindingBehaviorConfig {
    const openingUnescapedStartIndex = innerHTML.indexOf(unescapedOpenExpression);
    const closingUnescapedStartIndex = innerHTML.indexOf(unescapedCloseExpression);
    const openingContentStartIndex = innerHTML.indexOf(openExpression);
    const closingContentStartIndex = innerHTML.indexOf(closeExpression);
    const openingClientStartIndex = innerHTML.indexOf(clientSideOpenExpression);
    const closingClientStartIndex = innerHTML.indexOf(clientSideCloseExpression);

    if (
        openingUnescapedStartIndex !== -1 &&
        openingUnescapedStartIndex <= openingContentStartIndex &&
        openingUnescapedStartIndex <= openingClientStartIndex
    ) {
        return {
            openingStartIndex: openingUnescapedStartIndex,
            closingStartIndex: closingUnescapedStartIndex,
            bindingType: "unescaped",
        };
    } else if (
        openingContentStartIndex !== -1 &&
        openingContentStartIndex <= openingClientStartIndex
    ) {
        return {
            openingStartIndex: openingContentStartIndex,
            closingStartIndex: closingContentStartIndex,
            bindingType: "default",
        };
    }

    return {
        openingStartIndex: openingClientStartIndex,
        closingStartIndex: closingClientStartIndex,
        bindingType: "client",
    };
}

function getNextDataBindingBehavior(
    innerHTML: string,
    searchHTML: string,
): DataBindingBehaviorConfig {
    const { openingStartIndex, closingStartIndex, bindingType } =
        getIndexAndBindingTypeOfNextDataBindingBehavior(searchHTML);
    const bindingLength =
        bindingType === "client" ? 1 : bindingType === "default" ? 2 : 3;
    const partialConfig: BaseDataBindingBehaviorConfig = {
        type: "dataBinding",
        bindingType,
        openingStartIndex,
        openingEndIndex: openingStartIndex + bindingLength,
        closingStartIndex,
        closingEndIndex: closingStartIndex + bindingLength,
    };

    return isAttributeDirective(innerHTML, openingStartIndex)
        ? getAttributeDirectiveDataBindingConfig(innerHTML, partialConfig)
        : isAttribute(innerHTML, openingStartIndex)
          ? getAttributeDataBindingConfig(innerHTML, partialConfig)
          : { ...partialConfig, subtype: "content" };
}

function maskHTMLComments(innerHTML: string): string {
    if (!innerHTML.includes("<!--")) return innerHTML;

    let result = "";
    let lastEnd = 0;
    let cursor = 0;
    while ((cursor = innerHTML.indexOf("<", cursor)) !== -1) {
        if (innerHTML.startsWith("<!--", cursor)) {
            const closing = innerHTML.indexOf("-->", cursor + 4);
            const end = closing === -1 ? innerHTML.length : closing + 3;
            // Keep offsets stable while excluding comment contents from behavior discovery.
            result += innerHTML.slice(lastEnd, cursor) + " ".repeat(end - cursor);
            lastEnd = cursor = end;
        } else if (
            /[A-Za-z]/.test(
                innerHTML.charAt(cursor + (innerHTML.charAt(cursor + 1) === "/" ? 2 : 1)),
            )
        ) {
            cursor++;
            while (cursor < innerHTML.length) {
                const character = innerHTML.charAt(cursor++);
                if (character === '"' || character === "'") {
                    const closing = innerHTML.indexOf(character, cursor);
                    cursor = closing === -1 ? innerHTML.length : closing + 1;
                } else if (character === ">") {
                    break;
                }
            }
        } else {
            cursor++;
        }
    }
    return lastEnd === 0 ? innerHTML : result + innerHTML.slice(lastEnd);
}

/**
 * Discover comments once for an immutable source. Each scan returns indices relative
 * to its source window so recursive template resolution can reuse the same mask.
 */
export function createBehaviorScanner(innerHTML: string) {
    const searchHTML = maskHTMLComments(innerHTML);
    return (start = 0, end = innerHTML.length, offset = 0) =>
        getNextBehaviorInHTML(
            innerHTML.slice(start, end),
            searchHTML.slice(start, end),
            offset,
        );
}

function getNextBehaviorInHTML(
    innerHTML: string,
    searchHTML: string,
    offset: number,
): DataBindingBehaviorConfig | TemplateDirectiveBehaviorConfig | null {
    while (true) {
        const currentSlice = innerHTML.slice(offset);
        const searchSlice = searchHTML.slice(offset);
        const dataBindingOpen = searchSlice.indexOf(clientSideOpenExpression);
        const whenDirectiveIndex = searchSlice.indexOf(whenDirectiveOpen);
        const repeatDirectiveIndex = searchSlice.indexOf(repeatDirectiveOpen);
        const directiveBindingOpen =
            whenDirectiveIndex === -1
                ? repeatDirectiveIndex
                : repeatDirectiveIndex === -1
                  ? whenDirectiveIndex
                  : Math.min(whenDirectiveIndex, repeatDirectiveIndex);
        const nextDataBindingBehavior = getNextDataBindingBehavior(
            currentSlice,
            searchSlice,
        );

        if (dataBindingOpen === -1 && directiveBindingOpen === -1) {
            return null;
        }

        if (
            dataBindingOpen !== -1 &&
            nextDataBindingBehavior.bindingType === "client" &&
            !isLegitimateClientSideBinding(nextDataBindingBehavior)
        ) {
            offset = nextDataBindingBehavior.closingEndIndex + offset;
            continue;
        }

        if (
            directiveBindingOpen !== -1 &&
            (dataBindingOpen === -1 || dataBindingOpen > directiveBindingOpen)
        ) {
            return offsetDirective(
                getNextDirectiveBehavior(currentSlice, searchSlice),
                offset,
            );
        }

        return offsetDataBinding(nextDataBindingBehavior, offset);
    }
}

function offsetDataBinding(
    config: DataBindingBehaviorConfig,
    offset: number,
): DataBindingBehaviorConfig {
    config.openingStartIndex = config.openingStartIndex + offset;
    config.openingEndIndex = config.openingEndIndex + offset;
    config.closingStartIndex = config.closingStartIndex + offset;
    config.closingEndIndex = config.closingEndIndex + offset;
    return config;
}

function offsetDirective(
    config: TemplateDirectiveBehaviorConfig,
    offset: number,
): TemplateDirectiveBehaviorConfig {
    config.openingTagStartIndex = config.openingTagStartIndex + offset;
    config.openingTagEndIndex = config.openingTagEndIndex + offset;
    config.closingTagStartIndex = config.closingTagStartIndex + offset;
    config.closingTagEndIndex = config.closingTagEndIndex + offset;
    return config;
}

function isLegitimateClientSideBinding(result: DataBindingBehaviorConfig): boolean {
    return (
        (result.subtype === "attribute" &&
            (result.aspect === "@" || result.aspect === ":")) ||
        result.subtype === "attributeDirective"
    );
}
