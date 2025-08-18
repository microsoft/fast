import { Observable } from "@microsoft/fast-element/observable.js";
import {
    defsPropertyName,
    JSONSchema,
    JSONSchemaDefinition,
    refPropertyName,
    Schema,
} from "./schema.js";

type BehaviorType = "dataBinding" | "templateDirective";

type TemplateDirective = "when" | "repeat";

export type AttributeDirective = "children" | "slotted" | "ref";

type DataBindingBindingType = "client" | "default" | "unescaped";

interface BehaviorConfig {
    type: BehaviorType;
}

export type PathType = "access" | "default" | "event" | "repeat";

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

/**
 * Finds the next data binding in innerHTML and determines its type and indices
 * @param innerHTML - The innerHTML string to search for data bindings
 * @returns NextDataBindingBehaviorConfig containing the binding type and start indices
 */
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
    contextPath: string | null,
    level: number,
    rootSchema: JSONSchema
): (accessibleObject: any, context: any) => any {
    let splitPath: string[] = path.split(".");
    let levelCount = level;
    let self = splitPath[0] === contextPath;
    const parentContexts = [];

    if (
        level > 0 &&
        rootSchema?.[defsPropertyName]?.[contextPath as string]?.$fast_context ===
            splitPath.at(-1)
    ) {
        self = true;
    }

    while (levelCount > 0 && !self) {
        if (levelCount !== 1) {
            parentContexts.push("parentContext");
        } else {
            parentContexts.push("parent");
        }

        levelCount--;
    }

    splitPath = [...parentContexts, ...splitPath];

    return pathWithContextResolver(splitPath, self);
}

/**
 * Creates a resolver function that can access properties from an object using a split path array
 * @param splitPath - The dot syntax path split into an array of property names
 * @param self - Whether the first item in the path refers to the item itself
 * @returns A function that resolves the value from the given path on an accessible object
 */
function pathWithContextResolver(splitPath: string[], self: boolean): any {
    const isInPreviousContext =
        splitPath[0] === "parent" || splitPath[0] === "parentContext";

    if (self && !isInPreviousContext) {
        if (splitPath.length > 1) {
            splitPath = splitPath.slice(1);
        } else {
            return (accessibleObject: AccessibleObject) => {
                return accessibleObject;
            };
        }
    }

    if (isInPreviousContext) {
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
    rootPropertyName: string | null,
    path: string,
    parentContext: string | null,
    type: PathType,
    schema: Schema,
    currentContext: string | null,
    level: number
): (accessibleObject: any, context: any) => any {
    rootPropertyName = getRootPropertyName(rootPropertyName, path, currentContext, type);

    if (type !== "event" && rootPropertyName !== null) {
        schema.addPath({
            pathConfig: {
                type,
                currentContext,
                parentContext,
                path,
            },
            rootPropertyName,
        });
    }

    return pathResolver(
        path,
        currentContext,
        level,
        schema.getSchema(rootPropertyName as string) as JSONSchema
    );
}

export function expressionResolver(
    rootPropertyName: string | null,
    expression: ChainedExpression,
    parentContext: string | null,
    level: number,
    schema: Schema
): (accessibleObject: any, context: any) => any {
    return (x, c) =>
        resolveChainedExpression(
            x,
            c,
            level,
            parentContext || null,
            expression,
            schema.getSchema(rootPropertyName as string) as JSONSchema
        );
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
 * @param operand - The string to evaluate as either a literal value or property accessor
 * @returns An object containing the parsed value and whether it represents a literal value
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
 * Evaluates parts of an expression chain and chains them with the specified operator
 * @param parts - Each part of an expression chain to be evaluated
 * @param operator - The logical operator used to chain the expression parts
 * @returns A ChainedExpression object representing the linked expressions, or void if no valid expressions found
 */
function evaluatePartsInExpressionChain(
    parts: string[],
    operator: ChainingOperator
): void | ChainedExpression {
    // Process each part recursively and chain them with ||
    const firstPart = getExpressionChain(parts[0]);
    if (firstPart) {
        let current = firstPart;

        for (let i = 1; i < parts.length; i++) {
            const nextPart = getExpressionChain(parts[i]);
            if (nextPart) {
                // Find the end of the current chain
                while (current.next) {
                    current = current.next;
                }
                current.next = {
                    operator,
                    ...nextPart,
                };
            }
        }

        return firstPart;
    }
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
        const firstPart = evaluatePartsInExpressionChain(orParts, "||");

        if (firstPart) {
            return firstPart;
        }
    }

    // If no ||, check for && (higher precedence)
    const andParts = value.split(" && ");

    if (andParts.length > 1) {
        // Process each part recursively and chain them with &&
        const firstPart = evaluatePartsInExpressionChain(andParts, "&&");

        if (firstPart) {
            return firstPart;
        }
    }

    // Handle HTML entity version of &&
    const ampParts = value.split(" &amp;&amp; ");

    if (ampParts.length > 1) {
        // Process each part recursively and chain them with &amp;&amp;
        const firstPart = evaluatePartsInExpressionChain(ampParts, "&amp;&amp;");

        if (firstPart) {
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

/**
 * Parses a binding value string into an Expression object
 * @param value - The binding string value to parse (e.g., "!condition", "foo == bar", "property")
 * @returns An Expression object containing the operator, operands, and whether operands are literal values
 */
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
 * Resolve a single expression by evaluating its operator and operands
 * @param x - The current data context
 * @param c - The parent context for accessing parent scope data
 * @param level - The nesting level for context resolution
 * @param contextPath - The current context path for property resolution
 * @param expression - The expression object to evaluate
 * @param rootSchema - The root JSON schema for data validation and navigation
 * @returns The resolved value of the expression
 */
function resolveExpression(
    x: boolean,
    c: any,
    level: number,
    contextPath: string | null,
    expression: Expression,
    rootSchema: JSONSchema
): any {
    const { operator, left, right, rightIsValue } = expression;

    switch (operator) {
        case "!":
            return !pathResolver(left, contextPath, level, rootSchema)(x, c);
        case "==":
            return (
                pathResolver(left, contextPath, level, rootSchema)(x, c) ==
                (rightIsValue
                    ? right
                    : pathResolver(right as string, contextPath, level, rootSchema)(x, c))
            );
        case "!=":
            return (
                pathResolver(left, contextPath, level, rootSchema)(x, c) !=
                (rightIsValue
                    ? right
                    : pathResolver(right as string, contextPath, level, rootSchema)(x, c))
            );
        case ">=":
            return (
                pathResolver(left, contextPath, level, rootSchema)(x, c) >=
                (rightIsValue
                    ? right
                    : pathResolver(right as string, contextPath, level, rootSchema)(x, c))
            );
        case ">":
            return (
                pathResolver(left, contextPath, level, rootSchema)(x, c) >
                (rightIsValue
                    ? right
                    : pathResolver(right as string, contextPath, level, rootSchema)(x, c))
            );
        case "<=":
            return (
                pathResolver(left, contextPath, level, rootSchema)(x, c) <=
                (rightIsValue
                    ? right
                    : pathResolver(right as string, contextPath, level, rootSchema)(x, c))
            );
        case "<":
            return (
                pathResolver(left, contextPath, level, rootSchema)(x, c) <
                (rightIsValue
                    ? right
                    : pathResolver(right as string, contextPath, level, rootSchema)(x, c))
            );
        default:
            return pathResolver(left, contextPath, level, rootSchema)(x, c);
    }
}

/**
 * Resolve a chained expression by evaluating expressions linked with logical operators
 * @param x - The current data context
 * @param c - The parent context for accessing parent scope data
 * @param level - The nesting level for context resolution
 * @param contextPath - The current context path for property resolution
 * @param expression - The chained expression object containing linked expressions
 * @param rootSchema - The root JSON schema for data validation and navigation
 * @returns The resolved boolean result of the chained expression
 */
function resolveChainedExpression(
    x: boolean,
    c: any,
    level: number,
    contextPath: string | null,
    expression: ChainedExpression,
    rootSchema: JSONSchema
): any {
    if (expression.next) {
        switch (expression.next.operator) {
            case "&&":
            case "&amp;&amp;":
                return (
                    resolveExpression(
                        x,
                        c,
                        level,
                        contextPath,
                        expression.expression,
                        rootSchema
                    ) &&
                    resolveChainedExpression(
                        x,
                        c,
                        level,
                        contextPath,
                        expression.next,
                        rootSchema
                    )
                );
            case "||":
                return (
                    resolveExpression(
                        x,
                        c,
                        level,
                        contextPath,
                        expression.expression,
                        rootSchema
                    ) ||
                    resolveChainedExpression(
                        x,
                        c,
                        level,
                        contextPath,
                        expression.next,
                        rootSchema
                    )
                );
        }
    }

    return resolveExpression(x, c, level, contextPath, expression.expression, rootSchema);
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
    rootPropertyName: string | null,
    expression: ChainedExpression,
    parentContext: string | null,
    level: number,
    schema: Schema
): (x: boolean, c: any) => any {
    const binding = expressionResolver(
        rootPropertyName,
        expression,
        parentContext,
        level,
        schema
    );
    return (x: boolean, c: any) => binding(x, c);
}

type DataType = "array" | "object" | "primitive";

/**
 * Determines the data type of the provided data
 * @param data - The data to analyze
 * @returns "array" for arrays, "object" for non-null objects, "primitive" for other types
 */
function getDataType(data: any): DataType {
    if (Array.isArray(data)) return "array";
    if (typeof data === "object" && data !== null) return "object";
    return "primitive";
}

/**
 * Assigns Observable properties to items in an array and sets up change notifications
 * @param proxiedData - The array data to make observable
 * @param schema - The schema defining the structure of array items
 * @param rootSchema - The root schema for the entire data structure
 * @returns The array with observable properties and change notifications
 */
function assignObservablesToArray(
    proxiedData: any,
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema
): any {
    const data = proxiedData.map((item: any) => {
        const originalItem = Object.assign({}, item);

        assignProxyToItemsInArray(item, originalItem, schema, rootSchema);

        return Object.assign(item, originalItem);
    });

    Observable.getNotifier(data).subscribe({
        handleChange(subject, args) {
            args.forEach((arg: any) => {
                if (arg.addedCount > 0) {
                    for (let i = arg.addedCount - 1; i >= 0; i--) {
                        const item = subject[arg.index + i];
                        const originalItem = Object.assign({}, item);

                        assignProxyToItemsInArray(item, originalItem, schema, rootSchema);

                        return Object.assign(item, originalItem);
                    }
                }
            });
        },
    });

    return data;
}

/**
 * Extracts the definition name from a JSON Schema $ref property
 * @param defName - The $ref string (e.g., "#/$defs/MyType")
 * @returns The definition name (e.g., "MyType")
 */
function getDefFromRef(defName: string): string {
    const splitName = defName.split("/");

    return splitName.at(-1) as string;
}

/**
 * Assign observables to data
 * @param schema - The schema
 * @param rootSchema - The root schema mapping to the root property
 * @param data - The data
 * @param target - The target custom element
 * @param rootProperty - The root property
 * @returns
 */
export function assignObservables(
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
    data: any,
    target: any,
    rootProperty: string
): typeof Proxy {
    const dataType = getDataType(data);
    let proxiedData = data;

    switch (dataType) {
        case "array": {
            const context = getDefFromRef(
                (schema as JSONSchema)[refPropertyName] as string
            );
            proxiedData = assignObservablesToArray(
                proxiedData,
                (rootSchema as JSONSchema)[defsPropertyName]?.[
                    context
                ] as JSONSchemaDefinition,
                rootSchema
            );

            break;
        }
        case "object": {
            proxiedData = assignProxyToItemsInObject(
                target,
                rootProperty,
                proxiedData,
                schema,
                rootSchema
            );
            break;
        }
    }

    return proxiedData;
}

/**
 * Assign a proxy to items in an array
 * @param item - The array item to proxy
 * @param originalItem - The original array item
 * @param schema - The schema mapping to the items in the array
 * @param rootSchema - The root schema assigned to the root property
 */
function assignProxyToItemsInArray(
    item: any,
    originalItem: any,
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema
): void {
    const itemProperties = Object.keys(item);

    itemProperties.forEach(key => {
        Observable.defineProperty(item, key);

        if (originalItem[key] && schema && schema.properties) {
            originalItem[key] = assignProxyToItemsInObject(
                item,
                key,
                originalItem[key],
                schema.properties[key],
                rootSchema
            );
        }
    });
}

/**
 * Assign a proxy to items in an object
 * @param target - The target custom element
 * @param rootProperty - The root property
 * @param data - The data to proxy
 * @param schema - The schema for the data
 * @param rootSchema - The root schema for the root property
 * @returns a Proxy
 */
function assignProxyToItemsInObject(
    target: any,
    rootProperty: string,
    data: any,
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema
): any | typeof Proxy {
    const type = getDataType(data);
    let proxiedData = data;

    if (type === "object" && schema?.properties) {
        // navigate through all items in the object
        Object.keys(schema.properties).forEach(property => {
            if (proxiedData[property] && schema && schema.properties) {
                proxiedData[property] = assignProxyToItemsInObject(
                    target,
                    rootProperty,
                    proxiedData[property],
                    schema.properties[property],
                    rootSchema
                );
            }
        });

        // assign a Proxy to the object
        proxiedData = assignProxy(schema, rootSchema, target, rootProperty, data);
    } else if (type === "array") {
        const context = getDefFromRef(
            (schema as JSONSchema).items[refPropertyName] as string
        );
        const definition = (rootSchema as JSONSchema)[defsPropertyName]?.[context];

        if (definition?.type === "object") {
            proxiedData = assignObservablesToArray(
                proxiedData,
                definition as JSONSchemaDefinition,
                rootSchema
            );
        }
    }

    return proxiedData;
}

/**
 * Assign a proxy to an object
 * @param schema - The current schema
 * @param rootSchema - The root schema for the root property
 * @param target - The target custom element
 * @param rootProperty - The root property
 * @param object - The object to assign the proxy to
 * @returns Proxy object
 */
export function assignProxy(
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
    target: any,
    rootProperty: string,
    object: any
): typeof Proxy {
    if (object.$isProxy === undefined) {
        // Create a proxy for the object that triggers Observable.notify on mutations
        return new Proxy(object, {
            set: (obj: any, prop: string | symbol, value: any) => {
                obj[prop] = assignObservables(
                    schema,
                    rootSchema,
                    value,
                    target,
                    rootProperty
                );

                // Trigger notification for property changes
                Observable.notify(target, rootProperty);

                return true;
            },
            get: (target, key) => {
                if (key !== "$isProxy") {
                    return target[key];
                }

                return true;
            },
            deleteProperty: (obj: any, prop: string | symbol) => {
                if (prop in obj) {
                    delete obj[prop];

                    // Trigger notification for property deletion
                    Observable.notify(target, rootProperty);

                    return true;
                }
                return false;
            },
        });
    }

    return object;
}

/**
 * Get the root property name
 * @param rootPropertyName - The root property
 * @param path - The dot syntax path
 * @param context - The context created by a repeat
 * @param type - The type of path binding
 * @returns
 */
export function getRootPropertyName(
    rootPropertyName: string | null,
    path: string,
    context: null | string,
    type: PathType
): string | null {
    return (rootPropertyName === null || context === null) && type !== "event"
        ? path.split(".")[0]
        : rootPropertyName;
}
