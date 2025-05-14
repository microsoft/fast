type BehaviorType = "dataBinding" | "templateDirective";

type TemplateDirective = "when" | "repeat" | "apply";

export type AttributeDirective = "children" | "slotted" | "ref";

type DataBindingBindingType = "client" | "default" | "unescaped";

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
    bindingType: DataBindingBindingType;
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

const openClientSideBinding: string = "{";

const closeClientSideBinding: string = "}";

const openContentBinding: string = "{{";

const closeContentBinding: string = "}}";

const openUnescapedBinding: string = "{{{";

const closeUnescapedBinding: string = "}}}";

const openTagStart: string = "<f-";

const tagEnd: string = ">";

const closeTagStart: string = "</f-";

const attributeDirectivePrefix: string = "f-";

const startInnerHTMLDiv = `<div :innerHTML="{{`;

const startInnerHTMLDivLength = startInnerHTMLDiv.length;

const endInnerHTMLDiv = `}}"></div>`;

const endInnerHTMLDivLength = endInnerHTMLDiv.length;

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
    const openingTagEndIndex = // account for f-when which may include >= or > as operators, but will always include a condition attr
        openingTagStartSlice.indexOf(`"${tagEnd}`) + openingTagStartIndex + 2;

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

interface NextDataBindingBehaviorConfig {
    openingStartIndex: number;
    closingStartIndex: number;
    bindingType: DataBindingBindingType;
}

function getIndexAndBindingTypeOfNextDataBindingBehavior(
    innerHTML: string
): NextDataBindingBehaviorConfig {
    // {{{}}} binding
    const openingUnescapedStartIndex = innerHTML.indexOf(openUnescapedBinding);
    const closingUnescapedStartIndex = innerHTML.indexOf(closeUnescapedBinding);
    // {{}} binding
    const openingContentStartIndex = innerHTML.indexOf(openContentBinding);
    const closingContentStartIndex = innerHTML.indexOf(closeContentBinding);
    // {} binding
    const openingClientStartIndex = innerHTML.indexOf(openClientSideBinding);
    const closingClientStartIndex = innerHTML.indexOf(closeClientSideBinding);

    if (
        openingUnescapedStartIndex !== -1 &&
        openingUnescapedStartIndex <= openingContentStartIndex &&
        openingUnescapedStartIndex <= openingClientStartIndex
    ) {
        // is unescaped {{{}}}
        return {
            openingStartIndex: openingUnescapedStartIndex,
            closingStartIndex: closingUnescapedStartIndex,
            bindingType: "unescaped",
        };
    } else if (
        openingContentStartIndex !== -1 &&
        openingContentStartIndex <= openingClientStartIndex
    ) {
        // is default {{}}
        return {
            openingStartIndex: openingContentStartIndex,
            closingStartIndex: closingContentStartIndex,
            bindingType: "default",
        };
    }

    // is client {}
    return {
        openingStartIndex: openingClientStartIndex,
        closingStartIndex: closingClientStartIndex,
        bindingType: "client",
    };
}

/**
 * Get the next data binding
 * @param innerHTML - The innerHTML string to evaluate
 * @returns DataBindingBehaviorConfig - A configuration object
 */
function getNextDataBindingBehavior(innerHTML: string): DataBindingBehaviorConfig {
    const { openingStartIndex, closingStartIndex, bindingType } =
        getIndexAndBindingTypeOfNextDataBindingBehavior(innerHTML);
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
    const dataBindingOpen = innerHTML.indexOf(openClientSideBinding); // client side binding will capture all bindings starting with "{"
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
            openingTagStartSlice.indexOf(tagEnd) + 1 + openingTagStartIndex;
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
): (accessibleObject: any, context: any) => any {
    let splitPath = path.split(".");
    const usesContext = path.startsWith("../");

    if (self && !usesContext) {
        if (splitPath.length > 1) {
            splitPath = splitPath.slice(1);
        } else {
            return (accessibleObject: AccessibleObject) => {
                return accessibleObject;
            };
        }
    }

    if (splitPath.length === 1 && !usesContext) {
        return (accessibleObject: AccessibleObject) => {
            return accessibleObject?.[splitPath[0]];
        };
    }

    return (accessibleObject: AccessibleObject, context: AccessibleObject) => {
        if (usesContext) {
            splitPath = [];
            path.split("../").forEach(pathItem => {
                if (pathItem === "") {
                    splitPath.unshift("parent");
                } else {
                    splitPath.push(...pathItem.split("."));
                }
            });

            return splitPath.reduce((previousAccessors, pathItem) => {
                return previousAccessors?.[pathItem];
            }, context);
        }

        return splitPath.reduce((previousAccessors, pathItem) => {
            return previousAccessors?.[pathItem];
        }, accessibleObject);
    };
}

/**
 * Determine if the operand is a value (boolean, number, string) or an accessor.
 * @param operand
 */
function isOperandValue(operand: string): {
    value: boolean | number | string;
    isValue: boolean;
} {
    try {
        operand = operand.replaceAll("'", '"');
        const value = JSON.parse(operand);

        return {
            value,
            isValue: true,
        };
    } catch (e) {
        return {
            value: operand,
            isValue: false,
        };
    }
}

/**
 * Available operators include:
 *
 * - access (no operator)
 * - not (!)
 * - equals (==)
 * - not equal (!=)
 * - greater than or equal (>=)
 * - greater than (>)
 * - less than or equal (<=)
 * - less than (<)
 * - or (||)
 * - and (&&) and the HTML character entity (&amp;&amp;)
 */
type Operator = "access" | "!" | "==" | "!=" | ">=" | ">" | "<=" | "<";
type ChainingOperator = "||" | "&&" | "&amp;&amp;";

interface Expression {
    operator: Operator;
    left: string;
    right: string | boolean | number | null;
    rightIsValue: boolean | null;
}

export interface ChainedExpression {
    operator?: ChainingOperator;
    expression: Expression;
    next?: ChainedExpression;
}

/**
 * Gets the expression chain as a configuration object
 * @param value - The binding string value
 * @returns - A configuration object containing information about the expression
 */
export function getExpressionChain(value: string): ChainedExpression | void {
    const split = value.split(" ");
    let expressionString: string = "";
    let chainedExpression;

    // split expressions by chaining operators
    split.forEach((splitItem, index) => {
        if (splitItem === "&&" || splitItem === "||" || splitItem === "&amp;&amp;") {
            chainedExpression = {
                expression: getExpression(expressionString),
                next: {
                    operator: splitItem,
                    ...getExpressionChain(split.slice(index + 1).join(" ")),
                },
            };
        } else {
            expressionString = `${
                expressionString ? `${expressionString} ` : ""
            }${splitItem}`;
        }
    });

    if (chainedExpression) {
        return chainedExpression;
    }

    if (expressionString) {
        return {
            expression: getExpression(expressionString),
        };
    }

    return void 0;
}

function getExpression(value: string): Expression {
    if (value[0] === "!") {
        return {
            operator: "!",
            left: value.slice(1),
            right: null,
            rightIsValue: null,
        };
    }

    const split = value.split(" ");

    if (split.length === 3) {
        const operator: Operator = split[1] as Operator;
        const { value, isValue } = isOperandValue(split[2]);

        return {
            operator,
            left: split[0],
            right: isValue ? value : split[2],
            rightIsValue: isValue,
        };
    }

    return {
        operator: "access",
        left: value,
        right: null,
        rightIsValue: null,
    };
}

/**
 * Resolve a single expression
 * @param x - The context
 * @param c - The parent context
 * @param self - Where the first item in the path path refers to the item itself (used by repeat).
 * @param expression - The expression being evaluated
 * @returns - A function resolving the binding for this expression
 */
function resolveExpression(
    x: boolean,
    c: any,
    self: boolean,
    expression: Expression
): any {
    const { operator, left, right, rightIsValue } = expression;

    switch (operator) {
        case "!":
            return !pathResolver(left, self)(x, c);
        case "==":
            return (
                pathResolver(left, self)(x, c) ==
                (rightIsValue ? right : pathResolver(right as string, self)(x, c))
            );
        case "!=":
            return (
                pathResolver(left, self)(x, c) !=
                (rightIsValue ? right : pathResolver(right as string, self)(x, c))
            );
        case ">=":
            return (
                pathResolver(left, self)(x, c) >=
                (rightIsValue ? right : pathResolver(right as string, self)(x, c))
            );
        case ">":
            return (
                pathResolver(left, self)(x, c) >
                (rightIsValue ? right : pathResolver(right as string, self)(x, c))
            );
        case "<=":
            return (
                pathResolver(left, self)(x, c) <=
                (rightIsValue ? right : pathResolver(right as string, self)(x, c))
            );
        case "<":
            return (
                pathResolver(left, self)(x, c) <
                (rightIsValue ? right : pathResolver(right as string, self)(x, c))
            );
        default:
            return pathResolver(left, self)(x, c);
    }
}

/**
 * Resolve a chained expression
 * @param x - The context
 * @param c - The parent context
 * @param self - Where the first item in the path path refers to the item itself (used by repeat).
 * @param expression - The expression being evaluated
 * @param next - The next expression to be chained
 * @returns - A resolved return value for a binding
 */
function resolveChainedExpression(
    x: boolean,
    c: any,
    self: boolean,
    expression: Expression,
    next?: ChainedExpression
): any {
    if (next) {
        switch (next.operator) {
            case "&&":
            case "&amp;&amp;":
                return (
                    resolveExpression(x, c, self, expression) &&
                    resolveChainedExpression(x, c, self, next.expression, next.next)
                );
            case "||":
                return (
                    resolveExpression(x, c, self, expression) ||
                    resolveChainedExpression(x, c, self, next.expression, next.next)
                );
        }
    }

    return resolveExpression(x, c, self, expression);
}

/**
 * This is the transform utility for rationalizing declarative HTML syntax
 * with bindings in the ViewTemplate
 * @param innerHTML The innerHTML to transform
 * @param index The index to start the current slice of HTML to evaluate
 */
export function transformInnerHTML(innerHTML: string, index = 0): string {
    const sliceToEvaluate = innerHTML.slice(index);
    const nextBinding = getNextBehavior(sliceToEvaluate);
    let transformedInnerHTML = innerHTML;

    if (nextBinding && nextBinding.type === "dataBinding") {
        if (nextBinding.bindingType === "unescaped") {
            transformedInnerHTML = `${innerHTML.slice(0, index)}${sliceToEvaluate.slice(
                0,
                nextBinding.openingStartIndex
            )}${startInnerHTMLDiv}${sliceToEvaluate.slice(
                nextBinding.openingStartIndex + 3,
                nextBinding.closingStartIndex
            )}${endInnerHTMLDiv}${sliceToEvaluate.slice(
                nextBinding.closingStartIndex + 3
            )}`;

            return transformInnerHTML(
                transformedInnerHTML,
                index +
                    startInnerHTMLDivLength +
                    endInnerHTMLDivLength +
                    nextBinding.closingStartIndex -
                    3
            );
        } else if (nextBinding.bindingType === "client") {
            return transformInnerHTML(
                transformedInnerHTML,
                index + nextBinding.closingEndIndex
            );
        }

        return transformInnerHTML(
            transformedInnerHTML,
            index + nextBinding.closingEndIndex
        );
    } else if (nextBinding) {
        return transformInnerHTML(
            transformedInnerHTML,
            index + nextBinding.closingTagEndIndex
        );
    }

    return transformedInnerHTML;
}

/**
 * Resolves f-when
 * @param self - Where the first item in the path path refers to the item itself (used by repeat).
 * @param chainedExpression - The chained expression which includes the expression and the next expression
 * if there is another in the chain
 * @returns - A binding that resolves the chained expression logic
 */
export function resolveWhen(
    self: boolean,
    { expression, next }: ChainedExpression
): (x: boolean, c: any) => any {
    return (x: boolean, c: any) => resolveChainedExpression(x, c, self, expression, next);
}
