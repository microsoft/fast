import {
    children,
    elements,
    ref,
    repeat,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";

/**
 * A static text node with no bindings.
 * @public
 */
export interface TextNode {
    type: "text";
    /** The static text content to render. */
    value: string;
}

/**
 * A content binding node, equivalent to {{expression}} in declarative template syntax.
 * @public
 */
export interface BindingNode {
    type: "binding";
    /**
     * A dot-notation property path, e.g. 'greeting' or 'user.name'.
     * Inside a repeat, prefix with the loop variable: 'item.name' for loop variable 'item'.
     * Use '$c.parent.prop' to access the parent context from inside a repeat.
     */
    expression: string;
}

/**
 * An unescaped HTML binding node, equivalent to {{{expression}}} in declarative template syntax.
 * @public
 */
export interface UnescapedHtmlNode {
    type: "unescaped-html";
    /** A property path whose string value is rendered as raw innerHTML inside a wrapper div. */
    expression: string;
}

/**
 * An HTML element node.
 * @public
 */
export interface ElementNode {
    type: "element";
    /** The HTML tag name, e.g. 'div', 'span', 'slot', 'my-custom-element'. */
    tagName: string;
    /**
     * A map of attribute names to their binding configuration.
     * - Static attributes: plain attribute name as key.
     * - Event bindings: event name as key (e.g. 'click'), type 'event'.
     * - Property bindings: property name as key (e.g. 'value'), type 'property'.
     * - Boolean attribute bindings: attribute name as key (e.g. 'disabled'), type 'boolean'.
     * - Directives: 'f-ref', 'f-slotted', or 'f-children' as key.
     */
    attributes?: Record<string, AttributeValue>;
    /** Child template nodes. */
    children?: TemplateNode[];
}

/**
 * A conditional directive node, equivalent to <f-when value="{{expression}}">...</f-when>.
 * @public
 */
export interface WhenNode {
    type: "when";
    /**
     * A boolean expression: simple property ('show'), negation ('!show'),
     * comparison ('count > 0', 'status == "active"'), or logical chain ('a && b', 'a || b').
     * Use '$c.parent.prop' to access parent context inside a repeat.
     */
    expression: string;
    /** Nodes to render when the expression is truthy. */
    children: TemplateNode[];
}

/**
 * A repeat directive node, equivalent to <f-repeat value="{{item in items}}">...</f-repeat>.
 * @public
 */
export interface RepeatNode {
    type: "repeat";
    /** The loop variable name used to reference the current item in child bindings, e.g. 'item'. */
    item: string;
    /** A dot-notation property path to the array to iterate over, e.g. 'items'. */
    list: string;
    /**
     * Nodes rendered for each item. Prefix binding expressions with the loop variable,
     * e.g. 'item.name' for loop variable 'item'. Use '$c.parent.prop' to access the host.
     */
    children: TemplateNode[];
}

/** Union of all template node types. @public */
export type TemplateNode =
    | TextNode
    | BindingNode
    | UnescapedHtmlNode
    | ElementNode
    | WhenNode
    | RepeatNode;

/** A static (non-bound) attribute value. @public */
export interface StaticAttributeValue {
    type: "static";
    /** The literal attribute value. */
    value: string;
}

/**
 * A regular HTML attribute binding, equivalent to attr="{{expression}}".
 * Use the plain attribute name as the key, e.g. 'title', 'aria-label'.
 * @public
 */
export interface BoundAttributeValue {
    type: "bound";
    /** A dot-notation property path bound to the attribute value. */
    expression: string;
}

/**
 * A DOM property binding, equivalent to :prop="{{expression}}".
 * Use the property name (without ':' prefix) as the key, e.g. 'value', 'innerHTML'.
 * @public
 */
export interface PropertyAttributeValue {
    type: "property";
    /** A dot-notation property path bound to the DOM property. */
    expression: string;
}

/**
 * A boolean attribute binding, equivalent to ?attr="{expression}".
 * Use the attribute name (without '?' prefix) as the key, e.g. 'disabled', 'checked'.
 * @public
 */
export interface BooleanAttributeValue {
    type: "boolean";
    /** A boolean expression. Supports the same syntax as {@link WhenNode.expression}. */
    expression: string;
}

/**
 * An event listener binding, equivalent to @event="{handler(arg)}".
 * Use the event name (without '@' prefix) as the key, e.g. 'click', 'keyup'.
 * @public
 */
export interface EventAttributeValue {
    type: "event";
    /**
     * The method name on the component source to call, e.g. 'handleClick'.
     * Use '$c.parent.method' to invoke a method on the parent context inside a repeat.
     */
    handler: string;
    /**
     * Optional argument to pass: omit/empty for none, 'e' for the DOM event,
     * or a property name to pass that property's value.
     */
    argument?: string;
}

/**
 * A ref attribute directive, equivalent to f-ref="{property}".
 * Use 'f-ref' as the attribute key.
 * @public
 */
export interface RefDirectiveValue {
    type: "ref";
    /** The component property name to assign the element reference to. */
    property: string;
}

/**
 * A slotted nodes directive, equivalent to f-slotted="{property [filter elements(...)]}".
 * Use 'f-slotted' as the attribute key.
 * @public
 */
export interface SlottedDirectiveValue {
    type: "slotted";
    /** The component property name to assign the observed slotted nodes to. */
    property: string;
    /** Optional filter applied to slotted nodes. Omit to include all nodes. */
    filter?: {
        type: "elements";
        /** CSS selectors to restrict which elements are observed. Omit for all elements. */
        selectors?: string[];
    };
}

/**
 * A children nodes directive, equivalent to f-children="{property}".
 * Use 'f-children' as the attribute key.
 * @public
 */
export interface ChildrenDirectiveValue {
    type: "children";
    /** The component property name to assign the observed child nodes to. */
    property: string;
}

/** Union of all attribute value types. @public */
export type AttributeValue =
    | StaticAttributeValue
    | BoundAttributeValue
    | PropertyAttributeValue
    | BooleanAttributeValue
    | EventAttributeValue
    | RefDirectiveValue
    | SlottedDirectiveValue
    | ChildrenDirectiveValue;

/**
 * The root JSON object consumed by {@link ViewTemplateFromJSON}.
 * Conforms to the schema at `view-template-schema.json`.
 * @public
 */
export interface ViewTemplateJSON {
    /** The root-level template nodes. */
    nodes: TemplateNode[];
}

const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

const contextAccessorPrefix = "$c.";

/**
 * Creates a {@link ViewTemplate} from a JSON object that conforms to the
 * `view-template-schema.json` schema.
 *
 * @example
 * ```ts
 * const template = new ViewTemplateFromJSON({
 *     nodes: [
 *         { type: "element", tagName: "span", children: [
 *             { type: "binding", expression: "greeting" }
 *         ]}
 *     ]
 * }).create();
 * ```
 *
 * @public
 */
export class ViewTemplateFromJSON<TSource = any> {
    constructor(private readonly json: ViewTemplateJSON) {}

    /**
     * Builds and returns a {@link ViewTemplate} from the JSON provided in the constructor.
     */
    public create(): ViewTemplate<TSource> {
        const strings: string[] = [""];
        const values: any[] = [];
        this.processNodes(this.json.nodes, strings, values, null);
        return ViewTemplate.create(strings, values);
    }

    private buildChildTemplate(
        nodes: TemplateNode[],
        context: string | null
    ): ViewTemplate {
        const strings: string[] = [""];
        const values: any[] = [];
        this.processNodes(nodes, strings, values, context);
        return ViewTemplate.create(strings, values);
    }

    private processNodes(
        nodes: TemplateNode[],
        strings: string[],
        values: any[],
        context: string | null
    ): void {
        for (const node of nodes) {
            this.processNode(node, strings, values, context);
        }
    }

    private processNode(
        node: TemplateNode,
        strings: string[],
        values: any[],
        context: string | null
    ): void {
        switch (node.type) {
            case "text":
                strings[strings.length - 1] += node.value;
                break;
            case "binding":
                values.push(this.makeAccessor(node.expression, context));
                strings.push("");
                break;
            case "unescaped-html":
                this.processUnescapedHtml(node, strings, values, context);
                break;
            case "element":
                this.processElement(node, strings, values, context);
                break;
            case "when":
                this.processWhen(node, strings, values, context);
                break;
            case "repeat":
                this.processRepeat(node, strings, values, context);
                break;
        }
    }

    private processUnescapedHtml(
        node: UnescapedHtmlNode,
        strings: string[],
        values: any[],
        context: string | null
    ): void {
        strings[strings.length - 1] += `<div :innerHTML="`;
        values.push(this.makeAccessor(node.expression, context));
        strings.push(`"></div>`);
    }

    private processElement(
        node: ElementNode,
        strings: string[],
        values: any[],
        context: string | null
    ): void {
        const tag = node.tagName;
        const attrs = node.attributes ?? {};

        strings[strings.length - 1] += `<${tag}`;

        for (const [attrName, attrVal] of Object.entries(attrs)) {
            switch (attrVal.type) {
                case "static":
                    strings[strings.length - 1] += ` ${attrName}="${attrVal.value}"`;
                    break;
                case "bound":
                    strings[strings.length - 1] += ` ${attrName}="`;
                    values.push(this.makeAccessor(attrVal.expression, context));
                    strings.push(`"`);
                    break;
                case "property":
                    strings[strings.length - 1] += ` :${attrName}="`;
                    values.push(this.makeAccessor(attrVal.expression, context));
                    strings.push(`"`);
                    break;
                case "boolean":
                    strings[strings.length - 1] += ` ?${attrName}="`;
                    values.push(this.makeBooleanAccessor(attrVal.expression, context));
                    strings.push(`"`);
                    break;
                case "event":
                    strings[strings.length - 1] += ` @${attrName}="`;
                    values.push(
                        this.makeEventHandler(attrVal.handler, attrVal.argument ?? "", context)
                    );
                    strings.push(`"`);
                    break;
                case "ref":
                    strings[strings.length - 1] += ` `;
                    values.push(ref(attrVal.property));
                    strings.push(``);
                    break;
                case "slotted": {
                    strings[strings.length - 1] += ` `;
                    const slottedOptions: any = { property: attrVal.property };
                    if (attrVal.filter) {
                        const selector = attrVal.filter.selectors?.join(", ");
                        slottedOptions.filter = elements(selector || undefined);
                    }
                    values.push(slotted(slottedOptions));
                    strings.push(``);
                    break;
                }
                case "children":
                    strings[strings.length - 1] += ` `;
                    values.push(children(attrVal.property));
                    strings.push(``);
                    break;
            }
        }

        strings[strings.length - 1] += `>`;

        if (!voidElements.has(tag)) {
            this.processNodes(node.children ?? [], strings, values, context);
            strings[strings.length - 1] += `</${tag}>`;
        }
    }

    private processWhen(
        node: WhenNode,
        strings: string[],
        values: any[],
        context: string | null
    ): void {
        const condition = this.makeBooleanAccessor(node.expression, context);
        const childTemplate = this.buildChildTemplate(node.children, context);
        values.push(when(condition, childTemplate));
        strings.push("");
    }

    private processRepeat(
        node: RepeatNode,
        strings: string[],
        values: any[],
        context: string | null
    ): void {
        const listAccessor = this.makeAccessor(node.list, context);
        const childTemplate = this.buildChildTemplate(node.children, node.item);
        values.push(repeat((x: any, c: any) => listAccessor(x, c), childTemplate));
        strings.push("");
    }

    /**
     * Builds a property accessor function for the given expression.
     *
     * - `$c.parent.prop` — resolves against the execution context.
     * - Inside a repeat context, `item.name` where `item` is the loop variable resolves
     *   to `x.name` (the current item). Other expressions resolve against `c.parent`.
     * - Outside a repeat, expressions resolve against `x` (the component source).
     */
    private makeAccessor(
        expression: string,
        context: string | null
    ): (x: any, c: any) => any {
        if (expression.startsWith(contextAccessorPrefix)) {
            const path = expression.slice(contextAccessorPrefix.length).split(".");
            return (_x: any, c: any) =>
                path.reduce((obj: any, key: string) => obj?.[key], c);
        }

        const parts = expression.split(".");

        if (context !== null) {
            if (parts[0] === context) {
                if (parts.length === 1) {
                    return (x: any) => x;
                }
                const subPath = parts.slice(1);
                return (x: any) =>
                    subPath.reduce((obj: any, key: string) => obj?.[key], x);
            }
            return (_x: any, c: any) =>
                parts.reduce((obj: any, key: string) => obj?.[key], c.parent);
        }

        return (x: any) => parts.reduce((obj: any, key: string) => obj?.[key], x);
    }

    /**
     * Builds a boolean accessor for use in `when` directives and `?boolean` attributes.
     * Supports:
     * - Simple property: `show` → `!!x.show`
     * - Negation: `!show` → `!x.show`
     * - Comparison: `count > 0`, `status == "active"`, `count != 0`
     * - Logical chain: `a && b`, `a || b`
     * - Context access: `$c.parent.show`
     */
    private makeBooleanAccessor(
        expression: string,
        context: string | null
    ): (x: any, c: any) => boolean {
        const trimmed = expression.trim();

        const orParts = trimmed.split(/\s*\|\|\s*/);
        if (orParts.length > 1) {
            const accessors = orParts.map(p => this.makeBooleanAccessor(p, context));
            return (x: any, c: any) => accessors.some(fn => fn(x, c));
        }

        const andParts = trimmed.split(/\s*&&\s*/);
        if (andParts.length > 1) {
            const accessors = andParts.map(p => this.makeBooleanAccessor(p, context));
            return (x: any, c: any) => accessors.every(fn => fn(x, c));
        }

        if (trimmed.startsWith("!")) {
            const inner = this.makeAccessor(trimmed.slice(1), context);
            return (x: any, c: any) => !inner(x, c);
        }

        const comparisonMatch = trimmed.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
        if (comparisonMatch) {
            const [, rawLeft, operator, rawRight] = comparisonMatch;
            const leftAccessor = this.makeAccessor(rawLeft.trim(), context);
            const rightResolved = this.resolveOperand(rawRight.trim(), context);

            return (x: any, c: any) => {
                const left = leftAccessor(x, c);
                const right =
                    typeof rightResolved === "function" ? rightResolved(x, c) : rightResolved;
                switch (operator) {
                    // biome-ignore lint/suspicious/noDoubleEquals: matches existing FAST behaviour
                    case "==":
                        return left == right;
                    // biome-ignore lint/suspicious/noDoubleEquals: matches existing FAST behaviour
                    case "!=":
                        return left != right;
                    case ">":
                        return left > right;
                    case ">=":
                        return left >= right;
                    case "<":
                        return left < right;
                    case "<=":
                        return left <= right;
                    default:
                        return !!left;
                }
            };
        }

        const accessor = this.makeAccessor(trimmed, context);
        return (x: any, c: any) => {
            const value = accessor(x, c);
            if (typeof value === "boolean") return value;
            if (typeof value === "number") return value !== 0;
            if (typeof value === "string") return value.length > 0;
            return !!value;
        };
    }

    /**
     * Resolves a comparison operand as either a literal value or a property accessor.
     */
    private resolveOperand(
        operand: string,
        context: string | null
    ): any | ((x: any, c: any) => any) {
        const unquoted = operand.replace(/^['"]|['"]$/g, "");
        if (unquoted !== operand) {
            return unquoted;
        }
        if (operand === "true") return true;
        if (operand === "false") return false;
        const num = Number(operand);
        if (!isNaN(num)) return num;
        return this.makeAccessor(operand, context);
    }

    /**
     * Builds an event handler function for use in `@event` attribute bindings.
     */
    private makeEventHandler(
        handler: string,
        argument: string,
        context: string | null
    ): (x: any, c: any) => any {
        const isContextPath = handler.startsWith(contextAccessorPrefix);

        return (x: any, c: any) => {
            let owner: any;
            let method: any;

            if (isContextPath) {
                const parts = handler.slice(contextAccessorPrefix.length).split(".");
                const methodName = parts[parts.length - 1];
                const ownerPath = parts.slice(0, -1);
                owner = ownerPath.reduce((obj: any, key: string) => obj?.[key], c);
                method = owner?.[methodName];
            } else {
                owner = x;
                method = x[handler];
            }

            if (typeof method !== "function") return;

            const boundMethod = method.bind(owner);

            if (argument === "e") {
                return boundMethod(c.event);
            } else if (argument) {
                const argAccessor = this.makeAccessor(argument, context);
                return boundMethod(argAccessor(x, c));
            }

            return boundMethod();
        };
    }
}
