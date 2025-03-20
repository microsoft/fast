type BehaviorType = "dataBinding" | "templateDirective";

type TemplateDirective = "when" | "repeat" | "apply";

export type AttributeDirective = "children" | "slotted" | "ref";

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

export interface AttributeDirectiveBindingBehaviorConfig
    extends BaseDataBindingBehaviorConfig {
    subtype: "attributeDirective";
    name: AttributeDirective;
}

export type DataBindingBehaviorConfig =
    | ContentDataBindingBehaviorConfig
    | AttributeDataBindingBehaviorConfig
    | AttributeDirectiveBindingBehaviorConfig;

export interface BaseDataBindingBehaviorConfig extends BehaviorConfig {
    type: "dataBinding";
    openingStartIndex: number;
    openingEndIndex: number;
    closingStartIndex: number;
    closingEndIndex: number;
}

export interface TemplateDirectiveBehaviorConfig extends BehaviorConfig {
    type: "templateDirective";
    name: TemplateDirective;
    value: string;
    openingTagStartIndex: number;
    openingTagEndIndex: number;
    closingTagStartIndex: number;
    closingTagEndIndex: number;
}

interface PartialTemplateConfig {
    innerHTML: string;
    startIndex: number;
    endIndex: number;
}

const openBinding: string = "{{";

const closeBinding: string = "}}";

const openTagStart: string = "<f-";

const tagEnd: string = ">";

const closeTagStart: string = "</f-";

const attributeDirectivePrefix: string = "f-";

/**
 * Get the index of the next matching tag
 * @param openingTagStartSlice - The slice starting from the opening tag
 * @param openingTag - The opening tag string
 * @param closingTag - The closing tag
 * @param openingTagStartIndex - The opening tag start index derived from the innerHTML
 * @returns index
 */
export function getIndexOfNextMatchingTag(
    openingTagStartSlice: string,
    openingTag: string,
    closingTag: string,
    openingTagStartIndex: number
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

/**
 * Get the next directive
 * @param innerHTML - The innerHTML string to evaluate
 * @returns DirectiveBehaviorConfig - A configuration object
 */
function getNextDirectiveBehavior(innerHTML: string): TemplateDirectiveBehaviorConfig {
    const openingTagStartIndex = innerHTML.indexOf(openTagStart);
    const openingTagStartSlice = innerHTML.slice(openingTagStartIndex);
    const openingTagEndIndex =
        openingTagStartSlice.indexOf(tagEnd) + openingTagStartIndex + 1;

    const directiveTag = innerHTML
        .slice(openingTagStartIndex + 3, openingTagEndIndex - 1)
        .split(" ")[0];
    const directiveValue = getNextDataBindingBehavior(innerHTML);

    const openingTag = `${openTagStart}${directiveTag}`;
    const closingTag = `${closeTagStart}${directiveTag}${tagEnd}`;

    const matchingCloseTagIndex = getIndexOfNextMatchingTag(
        openingTagStartSlice,
        openingTag,
        closingTag,
        openingTagStartIndex
    );

    return {
        type: "templateDirective",
        name: directiveTag as TemplateDirective,
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
 * Determine if this binding is an attribute directive binding
 * @param innerHTML - The innerHTML string to evaluate
 * @param openingStartIndex - The index of the binding opening marker
 * @returns boolean
 */
function isAttributeDirective(innerHTML: string, openingStartIndex: number): boolean {
    const splitHTML = innerHTML.slice(0, openingStartIndex - 2).split(" ");
    return splitHTML[splitHTML.length - 1].startsWith(attributeDirectivePrefix);
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
 * Get the attribute directive binding config
 * @param innerHTML - The innerHTML string to evaluate
 * @param config - The base configuration of the binding
 * @returns AttributeDirectiveBindingBehaviorConfig
 */
function getAttributeDirectiveDataBindingConfig(
    innerHTML: string,
    config: BaseDataBindingBehaviorConfig
): AttributeDirectiveBindingBehaviorConfig {
    const splitInnerHTML = innerHTML.slice(0, config.openingStartIndex).split(" ");
    const lastItem = splitInnerHTML[splitInnerHTML.length - 1];
    const equals = lastItem.indexOf("=");
    const name = lastItem.slice(2, equals);

    return {
        ...config,
        subtype: "attributeDirective",
        name: name as AttributeDirective,
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

    return isAttributeDirective(innerHTML, openingStartIndex)
        ? getAttributeDirectiveDataBindingConfig(innerHTML, partialConfig)
        : isAttribute(innerHTML, openingStartIndex)
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
): DataBindingBehaviorConfig | TemplateDirectiveBehaviorConfig | null {
    const dataBindingOpen = innerHTML.indexOf(openBinding);
    const directiveBindingOpen = innerHTML.indexOf(openTagStart);

    if (dataBindingOpen === -1 && directiveBindingOpen === -1) {
        return null;
    }

    if (directiveBindingOpen !== -1 && dataBindingOpen > directiveBindingOpen) {
        return getNextDirectiveBehavior(innerHTML);
    }

    return getNextDataBindingBehavior(innerHTML);
}

/**
 * Gets all the partials with their IDs
 * @param innerHTML - The innerHTML string to evaluate
 * @param offset - The index offset from the innerHTML
 * @param partials - The partials found
 * @returns {[key: string]: PartialTemplateConfig}
 */
export function getAllPartials(
    innerHTML: string,
    offset: number = 0,
    partials: { [key: string]: PartialTemplateConfig } = {}
): { [key: string]: PartialTemplateConfig } {
    const openingTag = `${openTagStart}partial`;
    const openingTagStartIndex = innerHTML.indexOf(openingTag);

    if (openingTagStartIndex >= 0) {
        const openingTagStartSlice = innerHTML.slice(openingTagStartIndex);
        const closingTag = `${closeTagStart}partial${tagEnd}`;
        const closingTagLength = closingTag.length;
        const matchingCloseTagIndex =
            getIndexOfNextMatchingTag(
                openingTagStartSlice,
                openingTag,
                closingTag,
                openingTagStartIndex
            ) + closingTagLength;
        const startId = openingTagStartIndex + ' id="'.length + openingTag.length;
        const endId = innerHTML.slice(startId).indexOf('"') + startId;
        const id = innerHTML.slice(startId, endId);
        const openingTagEndIndex =
            openingTagStartSlice.indexOf(">") + 1 + openingTagStartIndex;
        const closingTagStartIndex = matchingCloseTagIndex - closingTagLength;

        partials[id] = {
            innerHTML: innerHTML.slice(openingTagEndIndex, closingTagStartIndex),
            startIndex: openingTagEndIndex + offset,
            endIndex: closingTagStartIndex + offset,
        };

        offset += matchingCloseTagIndex;

        return getAllPartials(innerHTML.slice(matchingCloseTagIndex), offset, partials);
    }

    return partials;
}

type AccessibleObject = { [key: string]: AccessibleObject };

/**
 * Create a function to resolve a value from an object using a path with dot syntax.
 * e.g. "foo.bar"
 * @param path - The dot syntax path to an objects property.
 * @param self - Where the first item in the path path refers to the item itself (used by repeat).
 * @returns A function to access the value from a given path.
 */
export function pathResolver(
    path: string,
    self: boolean = false
): (accessibleObject: any) => any {
    let splitPath = path.split(".");

    if (self) {
        if (splitPath.length > 1) {
            splitPath = splitPath.slice(1);
        } else {
            return (accessibleObject: AccessibleObject) => {
                return accessibleObject;
            };
        }
    }

    if (splitPath.length === 1) {
        return (accessibleObject: AccessibleObject) => {
            return accessibleObject?.[splitPath[0]];
        };
    }

    return (accessibleObject: AccessibleObject) => {
        return splitPath.reduce((previousAccessors, pathItem) => {
            return previousAccessors?.[pathItem];
        }, accessibleObject);
    };
}
