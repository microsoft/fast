import { type ObserverMap } from "./observer-map.js";

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
    let splitPath: string[] = [];
    path.split("../").forEach((pathItem, index) => {
        if (pathItem === "") {
            splitPath.unshift("../");
        } else {
            splitPath.push(...pathItem.split("."));
        }
    });
    splitPath = splitPath.map((pathItem: string, index: number) => {
        if (pathItem === "../") {
            if (splitPath[index + 1] === "../") {
                return "parentContext";
            }

            return "parent";
        }

        return pathItem;
    });

    return pathWithContextResolver(splitPath, self);
}

function pathWithContextResolver(splitPath: string[], self: boolean): any {
    const usesContext = splitPath[0] === "parent" || splitPath[0] === "parentContext";

    if (self && !usesContext) {
        if (splitPath.length > 1) {
            splitPath = splitPath.slice(1);
        } else {
            return (accessibleObject: AccessibleObject) => {
                return accessibleObject;
            };
        }
    }

    if (usesContext) {
        return (accessibleObject: AccessibleObject, context: AccessibleObject) => {
            return splitPath.reduce((previousAccessors, pathItem) => {
                return previousAccessors?.[pathItem];
            }, context);
        };
    }

    return (accessibleObject: AccessibleObject) => {
        return splitPath.reduce((previousAccessors, pathItem) => {
            return previousAccessors?.[pathItem];
        }, accessibleObject);
    };
}

export function bindingResolver(
    path: string,
    self: boolean = false,
    parentContext: string | null,
    observerMap?: ObserverMap,
    contextPath?: string
): (accessibleObject: any, context: any) => any {
    // Cache path during template processing when ObserverMap is provided
    if (observerMap) {
        observerMap.cachePath(path, self, parentContext, contextPath);
    }

    return pathResolver(path, self);
}

export function expressionResolver(
    self: boolean,
    expression: ChainedExpression,
    parentContext: string | null,
    observerMap?: ObserverMap
): (accessibleObject: any, context: any) => any {
    // Cache paths from expression during template processing when ObserverMap is provided
    if (observerMap) {
        const paths = extractPathsFromChainedExpression(expression);
        paths.forEach(path => observerMap.cachePath(path, self, parentContext));
    }

    return (x, c) => resolveChainedExpression(x, c, self, expression);
}

/**
 * Extracts all paths from a ChainedExpression, including nested expressions
 * @param chainedExpression - The chained expression to extract paths from
 * @returns A Set containing all unique paths found in the expression chain
 */
export function extractPathsFromChainedExpression(
    chainedExpression: ChainedExpression
): Set<string> {
    const paths = new Set<string>();

    function processExpression(expr: Expression) {
        // Check left operand (only add if it's not a literal value)
        if (typeof expr.left === "string" && !expr.leftIsValue) {
            paths.add(expr.left);
        }

        // Check right operand (only add if it's not a literal value)
        if (typeof expr.right === "string" && !expr.rightIsValue) {
            paths.add(expr.right);
        }
    }

    let current: ChainedExpression | undefined = chainedExpression;
    while (current !== undefined) {
        processExpression(current.expression);
        current = current.next;
    }

    return paths;
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
    leftIsValue: boolean | null;
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
    // Handle operator precedence: || has lower precedence than &&
    // First, split by || (lowest precedence)
    const orParts = value.split(" || ");

    if (orParts.length > 1) {
        // Process each part recursively and chain them with ||
        const firstPart = getExpressionChain(orParts[0]);
        if (firstPart) {
            let current = firstPart;

            for (let i = 1; i < orParts.length; i++) {
                const nextPart = getExpressionChain(orParts[i]);
                if (nextPart) {
                    // Find the end of the current chain
                    while (current.next) {
                        current = current.next;
                    }
                    current.next = {
                        operator: "||",
                        ...nextPart,
                    };
                }
            }

            return firstPart;
        }
    }

    // If no ||, check for && (higher precedence)
    const andParts = value.split(" && ");

    if (andParts.length > 1) {
        // Process each part recursively and chain them with &&
        const firstPart = getExpressionChain(andParts[0]);
        if (firstPart) {
            let current = firstPart;

            for (let i = 1; i < andParts.length; i++) {
                const nextPart = getExpressionChain(andParts[i]);
                if (nextPart) {
                    // Find the end of the current chain
                    while (current.next) {
                        current = current.next;
                    }
                    current.next = {
                        operator: "&&",
                        ...nextPart,
                    };
                }
            }

            return firstPart;
        }
    }

    // Handle HTML entity version of &&
    const ampParts = value.split(" &amp;&amp; ");

    if (ampParts.length > 1) {
        // Process each part recursively and chain them with &amp;&amp;
        const firstPart = getExpressionChain(ampParts[0]);
        if (firstPart) {
            let current = firstPart;

            for (let i = 1; i < ampParts.length; i++) {
                const nextPart = getExpressionChain(ampParts[i]);
                if (nextPart) {
                    // Find the end of the current chain
                    while (current.next) {
                        current = current.next;
                    }
                    current.next = {
                        operator: "&amp;&amp;",
                        ...nextPart,
                    };
                }
            }

            return firstPart;
        }
    }

    // No chaining operators found, create a single expression
    if (value.trim()) {
        return {
            expression: getExpression(value.trim()),
        };
    }

    return void 0;
}

function getExpression(value: string): Expression {
    if (value[0] === "!") {
        const left = (value as string).slice(1);
        const operandValue = isOperandValue(left);

        return {
            operator: "!",
            left,
            leftIsValue: operandValue.isValue,
            right: null,
            rightIsValue: null,
        };
    }

    const split = value.split(" ");

    if (split.length === 3) {
        const operator: Operator = split[1] as Operator;
        const right = split[2];
        const rightOperandValue = isOperandValue(right);
        const left = split[0];
        const leftOperandValue = isOperandValue(left);

        return {
            operator,
            left: split[0],
            leftIsValue: leftOperandValue.isValue,
            right: rightOperandValue.isValue ? rightOperandValue.value : right,
            rightIsValue: rightOperandValue.isValue,
        };
    }

    return {
        operator: "access",
        left: value,
        leftIsValue: false,
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
    expression: ChainedExpression
): any {
    if (expression.next) {
        switch (expression.next.operator) {
            case "&&":
            case "&amp;&amp;":
                return (
                    resolveExpression(x, c, self, expression.expression) &&
                    resolveChainedExpression(x, c, self, expression.next)
                );
            case "||":
                return (
                    resolveExpression(x, c, self, expression.expression) ||
                    resolveChainedExpression(x, c, self, expression.next)
                );
        }
    }

    return resolveExpression(x, c, self, expression.expression);
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
 * @param observerMap - Optional ObserverMap instance for caching paths during template processing
 * @returns - A binding that resolves the chained expression logic
 */
export function resolveWhen(
    self: boolean,
    expression: ChainedExpression,
    parentContext: string | null,
    observerMap?: ObserverMap
): (x: boolean, c: any) => any {
    const binding = expressionResolver(self, expression, parentContext, observerMap);
    return (x: boolean, c: any) => binding(x, c);
}
