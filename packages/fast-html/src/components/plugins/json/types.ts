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
 * A content binding node, equivalent to `{{expression}}` in declarative template syntax.
 * @public
 */
export interface BindingNode {
    type: "binding";
    /**
     * A dot-notation property path, e.g. `'greeting'` or `'user.name'`.
     * Inside a repeat, prefix with the loop variable: `'item.name'` for loop variable `'item'`.
     * Use `'$c.parent.prop'` to access the parent context from inside a repeat.
     */
    expression: string;
}

/**
 * An unescaped HTML binding node, equivalent to `{{{expression}}}` in declarative template syntax.
 * The resolved value is injected as raw `innerHTML` inside a wrapper `<div>`.
 * @public
 */
export interface UnescapedHtmlNode {
    type: "unescaped-html";
    /** A property path whose string value is rendered as raw HTML. */
    expression: string;
}

/**
 * An HTML element node, including both standard and custom elements.
 * @public
 */
export interface ElementNode {
    type: "element";
    /** The HTML tag name, e.g. `'div'`, `'span'`, `'slot'`, `'my-custom-element'`. */
    tagName: string;
    /**
     * A map of attribute names to their binding configuration.
     *
     * Key conventions:
     * - Static/bound/property/boolean: plain attribute name (`'title'`, `'value'`, `'disabled'`).
     * - Events: event name without `@` prefix (`'click'`, `'keyup'`).
     * - Directives: `'f-ref'`, `'f-slotted'`, or `'f-children'`.
     */
    attributes?: Record<string, AttributeValue>;
    /** Child template nodes nested inside this element. */
    children?: TemplateNode[];
}

/**
 * A conditional directive node, equivalent to
 * `<f-when value="{{expression}}">...</f-when>` in declarative template syntax.
 * @public
 */
export interface WhenNode {
    type: "when";
    /**
     * A boolean expression evaluated against the component source. Supports:
     * - Simple property: `'show'`
     * - Negation: `'!show'`
     * - Comparisons: `'count > 0'`, `'status == "active"'`, `'count != 0'`
     * - Logical chains: `'a && b'`, `'a || b'`
     * - Context access: `'$c.parent.show'`
     */
    expression: string;
    /** Nodes to render when the expression is truthy. */
    children: TemplateNode[];
}

/**
 * A repeat directive node, equivalent to
 * `<f-repeat value="{{item in items}}">...</f-repeat>` in declarative template syntax.
 * @public
 */
export interface RepeatNode {
    type: "repeat";
    /**
     * The loop variable name used to reference the current item in child binding
     * expressions, e.g. `'item'`.
     */
    item: string;
    /**
     * A dot-notation property path to the array to iterate over, e.g. `'items'`
     * or `'data.users'`.
     */
    list: string;
    /**
     * Nodes rendered for each item. Prefix binding expressions with the loop variable:
     * `'item.name'` for loop variable `'item'`. Use `'$c.parent.prop'` to access the host.
     */
    children: TemplateNode[];
}

/**
 * Union of all template node types accepted by the {@link json} plugin.
 * @public
 */
export type TemplateNode =
    | TextNode
    | BindingNode
    | UnescapedHtmlNode
    | ElementNode
    | WhenNode
    | RepeatNode;

// ─── Attribute value types ────────────────────────────────────────────────────

/**
 * A static (non-bound) attribute value. Rendered as a literal string attribute.
 * @public
 */
export interface StaticAttributeValue {
    type: "static";
    /** The literal attribute value. */
    value: string;
}

/**
 * A regular HTML attribute binding, equivalent to `attr="{{expression}}"`.
 * Use the plain attribute name as the key, e.g. `'title'`, `'aria-label'`.
 * @public
 */
export interface BoundAttributeValue {
    type: "bound";
    /** A dot-notation property path bound to the attribute value. */
    expression: string;
}

/**
 * A DOM property binding, equivalent to `:prop="{{expression}}"`.
 * Use the property name (without `':'` prefix) as the key, e.g. `'value'`, `'innerHTML'`.
 * @public
 */
export interface PropertyAttributeValue {
    type: "property";
    /** A dot-notation property path bound to the DOM property. */
    expression: string;
}

/**
 * A boolean attribute binding, equivalent to `?attr="{expression}"`.
 * Use the attribute name (without `'?'` prefix) as the key, e.g. `'disabled'`, `'checked'`.
 * @public
 */
export interface BooleanAttributeValue {
    type: "boolean";
    /** A boolean expression. Supports the same syntax as {@link WhenNode.expression}. */
    expression: string;
}

/**
 * An event listener binding, equivalent to `@event="{handler(arg)}"`.
 * Use the event name (without `'@'` prefix) as the key, e.g. `'click'`, `'keyup'`.
 * @public
 */
export interface EventAttributeValue {
    type: "event";
    /**
     * The method name on the component source to invoke when the event fires,
     * e.g. `'handleClick'`. Use `'$c.parent.method'` to invoke a method on the
     * parent context inside a repeat.
     */
    handler: string;
    /**
     * Optional argument: omit or use `''` for none, `'e'` for the DOM event object,
     * or a property name to pass that property's value.
     */
    argument?: string;
}

/**
 * A ref attribute directive, equivalent to `f-ref="{property}"`.
 * Use `'f-ref'` as the attribute key.
 * @public
 */
export interface RefDirectiveValue {
    type: "ref";
    /** The component property name to assign the element reference to. */
    property: string;
}

/**
 * A slotted nodes directive, equivalent to `f-slotted="{property [filter elements(...)]}"`.
 * Use `'f-slotted'` as the attribute key.
 * @public
 */
export interface SlottedDirectiveValue {
    type: "slotted";
    /** The component property name to assign the observed slotted nodes to. */
    property: string;
    /** Optional filter applied to slotted nodes. Omit to include all nodes. */
    filter?: {
        type: "elements";
        /** CSS selectors to further restrict which elements are observed. Omit for all elements. */
        selectors?: string[];
    };
}

/**
 * A children nodes directive, equivalent to `f-children="{property}"`.
 * Use `'f-children'` as the attribute key.
 * @public
 */
export interface ChildrenDirectiveValue {
    type: "children";
    /** The component property name to assign the observed child nodes to. */
    property: string;
}

/**
 * Union of all attribute value types accepted by the {@link json} plugin.
 * @public
 */
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
 * The root JSON object consumed by the {@link json} plugin.
 * Conforms to the schema at `src/view-template-schema.json`.
 * @public
 */
export interface ViewTemplateJSON {
    /** The root-level template nodes. */
    nodes: TemplateNode[];
}
