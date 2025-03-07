type BehaviorType = "dataBinding" | "directive";

type DirectiveName = "when" | "repeat";

interface BehaviorConfig {
    type: BehaviorType;
}

export interface ContentDataBindingBehaviorConfig extends BaseDataBindingBehaviorConfig {
    subtype: "content";
}

export interface AttributeDataBindingBehaviorConfig
    extends BaseDataBindingBehaviorConfig {
    subtype: "attribute";
    aspect: "@" | ":" | "?" | null;
}

export type DataBindingBehaviorConfig =
    | ContentDataBindingBehaviorConfig
    | AttributeDataBindingBehaviorConfig;

export interface BaseDataBindingBehaviorConfig extends BehaviorConfig {
    type: "dataBinding";
    openingStartIndex: number;
    openingEndIndex: number;
    closingStartIndex: number;
    closingEndIndex: number;
}

export interface DirectiveBehaviorConfig extends BehaviorConfig {
    type: "directive";
    name: DirectiveName;
    value: string;
    openingTagStartIndex: number;
    openingTagEndIndex: number;
    closingTagStartIndex: number;
    closingTagEndIndex: number;
}

const openBinding: string = "{{";

const closeBinding: string = "}}";

const openTagStartDirective: string = "<f-";

const tagEndDirective: string = ">";

const closeTagStartDirective: string = "</f-";

/**
 * Get the next directive
 * @param innerHTML - The innerHTML string to evaluate
 * @returns DirectiveBehaviorConfig - A configuration object
 */
function getNextDirectiveBehavior(innerHTML: string): DirectiveBehaviorConfig {
    const openingTagStartIndex = innerHTML.indexOf(openTagStartDirective);
    const openingTagStartSlice = innerHTML.slice(openingTagStartIndex);
    const openingTagEndIndex =
        openingTagStartSlice.indexOf(tagEndDirective) + openingTagStartIndex + 1;

    const directiveTag = innerHTML
        .slice(openingTagStartIndex + 3, openingTagEndIndex - 1)
        .split(" ")[0];
    const directiveValue = getNextDataBindingBehavior(innerHTML);

    const openingTag = `${openTagStartDirective}${directiveTag}`;
    const closingTag = `${closeTagStartDirective}${directiveTag}${tagEndDirective}`;

    let tagCount = 0;
    let matchingCloseTagIndex = -1;
    let nextSlice = openingTagStartSlice.slice(openingTag.length);
    let nextOpenTag = nextSlice.indexOf(openingTag);
    let nextCloseTag = nextSlice.indexOf(closingTag);
    let tagOffset = openingTagStartIndex + openingTag.length;

    do {
        if (nextOpenTag !== -1) {
            tagOffset += nextOpenTag;
        }

        // if there is the same open tag available and it occurs before the next closing of the
        // same tag increment the number of tags found
        if (nextOpenTag !== -1 && nextOpenTag < nextCloseTag) {
            tagCount++;
            // if a closing tag has been found for the next open tag, decrement the tag count
        } else if (nextOpenTag > nextCloseTag) {
            tagCount--;
        }

        if (tagCount === 0) {
            matchingCloseTagIndex = nextCloseTag + tagOffset;
        } else {
            nextSlice = nextSlice.slice(nextOpenTag);
            nextOpenTag = nextSlice.indexOf(openingTag);
            nextCloseTag = nextSlice.indexOf(closingTag);
        }
    } while (tagCount > 0);

    return {
        type: "directive",
        name: directiveTag as DirectiveName,
        value: innerHTML.slice(
            directiveValue.openingEndIndex,
            directiveValue.closingStartIndex
        ),
        openingTagStartIndex,
        openingTagEndIndex,
        closingTagStartIndex: matchingCloseTagIndex,
        closingTagEndIndex: matchingCloseTagIndex + closingTag.length,
    };
}

/**
 * Determine if this binding is an attribute binding
 * @param innerHTML - The innerHTML string to evaluate
 * @param openingStartIndex - The index of the binding opening marker
 * @returns boolean
 */
function isAttribute(innerHTML: string, openingStartIndex: number): boolean {
    return innerHTML.slice(openingStartIndex - 2, openingStartIndex - 1) === "=";
}

/**
 * Get the attribute binding config
 * @param innerHTML - The innerHTML string to evaluate
 * @param config - The base configuration of the binding
 * @returns AttributeDataBindingBehaviorConfig
 */
function getAttributeDataBindingConfig(
    innerHTML: string,
    config: BaseDataBindingBehaviorConfig
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

/**
 * Get the content data binding config
 * @param config - The base configuration of the binding
 * @returns ContentDataBindingBehaviorConfig
 */
function getContentDataBindingConfig(
    config: BaseDataBindingBehaviorConfig
): ContentDataBindingBehaviorConfig {
    return {
        ...config,
        subtype: "content",
    };
}

/**
 * Get the next data binding
 * @param innerHTML - The innerHTML string to evaluate
 * @returns DataBindingBehaviorConfig - A configuration object
 */
function getNextDataBindingBehavior(innerHTML: string): DataBindingBehaviorConfig {
    const openingStartIndex = innerHTML.indexOf(openBinding);
    const closingStartIndex = innerHTML.indexOf(closeBinding);
    const partialConfig: BaseDataBindingBehaviorConfig = {
        type: "dataBinding",
        openingStartIndex,
        openingEndIndex: openingStartIndex + 2,
        closingStartIndex,
        closingEndIndex: closingStartIndex + 2,
    };

    return isAttribute(innerHTML, openingStartIndex)
        ? getAttributeDataBindingConfig(innerHTML, partialConfig)
        : getContentDataBindingConfig(partialConfig);
}

/**
 * Get the next behavior
 * @param innerHTML - The innerHTML string to evaluate
 * @returns DataBindingBehaviorConfig | DirectiveBehaviorConfig | null - A configuration object or null
 */
export function getNextBehavior(
    innerHTML: string
): DataBindingBehaviorConfig | DirectiveBehaviorConfig | null {
    const dataBindingOpen = innerHTML.indexOf(openBinding);
    const directiveBindingOpen = innerHTML.indexOf(openTagStartDirective);

    if (dataBindingOpen === -1 && directiveBindingOpen === -1) {
        return null;
    }

    if (directiveBindingOpen !== -1 && dataBindingOpen > directiveBindingOpen) {
        return getNextDirectiveBehavior(innerHTML);
    }

    return getNextDataBindingBehavior(innerHTML);
}
