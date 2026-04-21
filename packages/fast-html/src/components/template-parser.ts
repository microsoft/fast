import {
    children,
    elements,
    ref,
    repeat,
    slotted,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import type { ObserverMap } from "./observer-map.js";
import type { Schema } from "./schema.js";
import {
    type AttributeDirective,
    type AttributeDirectiveBindingBehaviorConfig,
    bindingResolver,
    type ChainedExpression,
    contextPrefixDot,
    type DataBindingBehaviorConfig,
    getBooleanBinding,
    getExpressionChain,
    getNextBehavior,
    getRootPropertyName,
    parseEventArgs,
    type TemplateDirectiveBehaviorConfig,
} from "./utilities.js";

/**
 * The return type for {@link TemplateParser.parse}.
 */
export interface ResolvedStringsAndValues {
    strings: Array<string>;
    values: Array<any>;
}

/**
 * Encapsulates the stable context fields that flow through the recursive
 * template resolution pipeline. Keeps method signatures lean and makes it
 * easy to add new context without touching every call site.
 *
 * `rootPropertyName` is intentionally **excluded** because it is
 * selectively mutated per branch and must not leak across siblings.
 */
interface TemplateResolutionContext {
    self: boolean;
    parentContext: string | null;
    level: number;
    schema: Schema;
    observerMap?: ObserverMap;
}

/**
 * Tracks string segments accumulated during template parsing and maintains
 * a running concatenation so that `bindingResolver` can receive the full
 * preceding HTML without an O(N) `join("")` at every binding site.
 */
class StringsAccumulator {
    readonly segments: any[] = [];
    private _previousString = "";

    push(segment: string): void {
        this.segments.push(segment);
        this._previousString += segment;
    }

    /**
     * The full concatenation of all segments pushed so far.
     * Used by `bindingResolver` to detect child-element attribute bindings.
     */
    get previousString(): string {
        return this._previousString;
    }
}

/**
 * Converts declarative HTML template markup into the `strings` and `values`
 * arrays that `ViewTemplate.create()` consumes.
 *
 * This class is intentionally stateless across invocations — all mutable
 * parsing state lives on the call stack or in the `TemplateResolutionContext`.
 * The only per-parse state is `_hasDeprecatedEventSyntax`, which is reset at
 * the start of each `parse()` call.
 *
 * The parsing pipeline is fully synchronous — no promises are allocated
 * during template resolution.
 */
export class TemplateParser {
    /**
     * Whether the template contains deprecated "e" event argument usage.
     * Set during template processing; checked after parsing to emit a
     * single warning per template.
     */
    // TODO: remove per https://github.com/microsoft/fast/issues/7314
    private _hasDeprecatedEventSyntax = false;

    /**
     * Whether the last parsed template contained deprecated "e" event syntax.
     */
    public get hasDeprecatedEventSyntax(): boolean {
        return this._hasDeprecatedEventSyntax;
    }

    /**
     * Parse declarative HTML into strings and values for ViewTemplate creation.
     * @param innerHTML - The transformed innerHTML to parse.
     * @param schema - The Schema instance for property tracking.
     * @param observerMap - Optional ObserverMap for caching binding paths.
     * @returns The resolved strings and values.
     */
    public parse(
        innerHTML: string,
        schema: Schema,
        observerMap?: ObserverMap,
    ): ResolvedStringsAndValues {
        this._hasDeprecatedEventSyntax = false;

        return this.resolveStringsAndValues(null, innerHTML, {
            self: false,
            parentContext: null,
            level: 0,
            schema,
            observerMap,
        });
    }

    /**
     * Create a ViewTemplate from resolved strings and values.
     * @param strings - The strings array.
     * @param values - The interpreted values.
     */
    public createTemplate(
        strings: Array<string>,
        values: Array<any>,
    ): ViewTemplate<any, any> {
        return ViewTemplate.create(strings, values);
    }

    /**
     * Resolve strings and values from an innerHTML string.
     * @param rootPropertyName - The root property name for schema registration.
     * @param innerHTML - The innerHTML.
     * @param context - The template resolution context.
     */
    private resolveStringsAndValues(
        rootPropertyName: string | null,
        innerHTML: string,
        context: TemplateResolutionContext,
    ): ResolvedStringsAndValues {
        const strings = new StringsAccumulator();
        const values: any[] = [];
        this.resolveInnerHTML(rootPropertyName, innerHTML, strings, values, context);

        (strings.segments as any).raw = strings.segments.map(value =>
            String.raw({ raw: value }),
        );

        return {
            strings: strings.segments,
            values,
        };
    }

    /**
     * Resolve a template directive (when/repeat).
     * @param rootPropertyName - The root property name for schema registration.
     * @param behaviorConfig - The directive behavior configuration object.
     * @param externalValues - The interpreted values from the parent.
     * @param innerHTML - The innerHTML.
     * @param context - The template resolution context.
     */
    private resolveTemplateDirective(
        rootPropertyName: string | null,
        behaviorConfig: TemplateDirectiveBehaviorConfig,
        externalValues: Array<any>,
        innerHTML: string,
        context: TemplateResolutionContext,
    ): void {
        switch (behaviorConfig.name) {
            case "when": {
                const expressionChain = getExpressionChain(behaviorConfig.value);

                const whenLogic = getBooleanBinding(
                    rootPropertyName,
                    expressionChain as ChainedExpression,
                    context.parentContext,
                    context.level,
                    context.schema,
                );

                const { strings, values } = this.resolveStringsAndValues(
                    rootPropertyName,
                    innerHTML.slice(
                        behaviorConfig.openingTagEndIndex,
                        behaviorConfig.closingTagStartIndex,
                    ),
                    context,
                );

                externalValues.push(
                    when(whenLogic, this.createTemplate(strings, values)),
                );

                break;
            }
            case "repeat": {
                const valueAttr = behaviorConfig.value.split(" "); // syntax {{x in y}}
                const updatedLevel = context.level + 1;

                rootPropertyName = getRootPropertyName(
                    rootPropertyName,
                    valueAttr[2],
                    context.parentContext,
                    behaviorConfig.name,
                );
                const binding = bindingResolver(
                    null,
                    rootPropertyName,
                    valueAttr[2],
                    context.parentContext,
                    behaviorConfig.name,
                    context.schema,
                    valueAttr[0],
                    context.level,
                );

                const repeatContext: TemplateResolutionContext = {
                    self: true,
                    parentContext: valueAttr[0],
                    level: updatedLevel,
                    schema: context.schema,
                    observerMap: context.observerMap,
                };

                const { strings, values } = this.resolveStringsAndValues(
                    rootPropertyName,
                    innerHTML.slice(
                        behaviorConfig.openingTagEndIndex,
                        behaviorConfig.closingTagStartIndex,
                    ),
                    repeatContext,
                );

                externalValues.push(
                    repeat((x, c) => binding(x, c), this.createTemplate(strings, values)),
                );

                break;
            }
        }
    }

    /**
     * Resolve an attribute directive (children/slotted/ref).
     * @param name - The name of the directive.
     * @param propName - The property name to pass to the directive.
     * @param externalValues - The interpreted values from the parent.
     */
    private resolveAttributeDirective(
        name: AttributeDirective,
        propName: string,
        externalValues: Array<any>,
    ): void {
        switch (name) {
            case "children": {
                externalValues.push(children(propName));

                break;
            }
            case "slotted": {
                const parts = propName.trim().split(" filter ");
                const slottedOption = {
                    property: parts[0],
                };

                if (parts[1]) {
                    if (parts[1].startsWith("elements(")) {
                        let params = parts[1].replace("elements(", "");
                        params = params.substring(0, params.lastIndexOf(")"));
                        Object.assign(slottedOption, {
                            filter: elements(params || undefined),
                        });
                    }
                }

                externalValues.push(slotted(slottedOption));

                break;
            }
            case "ref": {
                externalValues.push(ref(propName));

                break;
            }
        }
    }

    /**
     * Resolve an access binding — shared by content bindings, boolean-attribute
     * fallback, and default attribute bindings.
     * @returns An object with the resolved binding function and the updated rootPropertyName.
     */
    private resolveAccessBinding(
        rootPropertyName: string | null,
        propName: string,
        previousStrings: string,
        context: TemplateResolutionContext,
    ): {
        binding: (x: any, c: any) => any;
        rootPropertyName: string | null;
    } {
        rootPropertyName = getRootPropertyName(
            rootPropertyName,
            propName,
            context.parentContext,
            "access",
        );
        const resolved = bindingResolver(
            previousStrings,
            rootPropertyName,
            propName,
            context.parentContext,
            "access",
            context.schema,
            context.parentContext,
            context.level,
        );
        return {
            binding: (x: any, c: any) => resolved(x, c),
            rootPropertyName,
        };
    }

    /**
     * Resolve an event binding (the "@" aspect).
     * @returns An object with the event binding function and the updated rootPropertyName.
     */
    private resolveEventBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        behaviorConfig: DataBindingBehaviorConfig,
        strings: StringsAccumulator,
        context: TemplateResolutionContext,
    ): {
        binding: (x: any, c: any) => any;
        rootPropertyName: string | null;
    } {
        const bindingHTML = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex,
        );
        const openingParenthesis = bindingHTML.indexOf("(");
        const closingParenthesis = bindingHTML.indexOf(")");
        const propName = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex -
                (closingParenthesis - openingParenthesis) -
                1,
        );
        const type = "event";
        rootPropertyName = getRootPropertyName(
            rootPropertyName,
            propName,
            context.parentContext,
            type,
        );
        const argsString = bindingHTML.slice(openingParenthesis + 1, closingParenthesis);
        const previousString = strings.previousString;
        const resolved = bindingResolver(
            previousString,
            rootPropertyName,
            propName,
            context.parentContext,
            type,
            context.schema,
            context.parentContext,
            context.level,
        );
        const isContextPath = propName.startsWith(contextPrefixDot);
        const getOwner = isContextPath
            ? (_x: any, c: any) => {
                  const ownerPath = propName.split(".").slice(1, -1);
                  return ownerPath.reduce((prev: any, item: string) => prev?.[item], c);
              }
            : (x: any, _c: any) => x;

        const parsedArgs = parseEventArgs(argsString);

        if (parsedArgs.some(a => a.type === "deprecated-event")) {
            this._hasDeprecatedEventSyntax = true;
        }

        const argResolvers = parsedArgs.map((parsedArg): ((x: any, c: any) => any) => {
            switch (parsedArg.type) {
                case "event":
                case "deprecated-event":
                    return (_x, c) => c.event;
                case "context":
                    return (_x, c) => c;
                case "binding":
                    return bindingResolver(
                        previousString,
                        rootPropertyName,
                        parsedArg.rawArg!,
                        context.parentContext,
                        type,
                        context.schema,
                        context.parentContext,
                        context.level,
                    );
            }
        });

        return {
            binding: (x: any, c: any) =>
                resolved(x, c).bind(getOwner(x, c))(
                    ...argResolvers.map(resolve => resolve(x, c)),
                ),
            rootPropertyName,
        };
    }

    /**
     * Resolve a content data binding (`{{expression}}` in text content).
     */
    private resolveContentBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: StringsAccumulator,
        values: Array<any>,
        behaviorConfig: DataBindingBehaviorConfig,
        context: TemplateResolutionContext,
    ): void {
        strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
        const propName = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex,
        );
        const result = this.resolveAccessBinding(
            rootPropertyName,
            propName,
            strings.previousString,
            context,
        );
        rootPropertyName = result.rootPropertyName;
        values.push(result.binding);
        this.resolveInnerHTML(
            rootPropertyName,
            innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
            strings,
            values,
            context,
        );
    }

    /**
     * Resolve an attribute data binding (`{{expression}}` in an HTML attribute).
     * Dispatches to event, expression, or access binding handlers based on aspect.
     */
    private resolveAttributeBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: StringsAccumulator,
        values: Array<any>,
        behaviorConfig: DataBindingBehaviorConfig,
        context: TemplateResolutionContext,
    ): void {
        strings.push(innerHTML.slice(0, behaviorConfig.openingStartIndex));
        let attributeBinding;

        const aspect =
            behaviorConfig.subtype === "attribute" ? behaviorConfig.aspect : null;

        switch (aspect) {
            case "@": {
                const result = this.resolveEventBinding(
                    rootPropertyName,
                    innerHTML,
                    behaviorConfig,
                    strings,
                    context,
                );
                attributeBinding = result.binding;
                rootPropertyName = result.rootPropertyName;
                break;
            }
            case "?": {
                const propName = innerHTML.slice(
                    behaviorConfig.openingEndIndex,
                    behaviorConfig.closingStartIndex,
                );
                const expressionChain = getExpressionChain(propName);

                if (expressionChain?.expression.operator) {
                    attributeBinding = getBooleanBinding(
                        rootPropertyName,
                        expressionChain as ChainedExpression,
                        context.parentContext,
                        context.level,
                        context.schema,
                    );
                } else {
                    const result = this.resolveAccessBinding(
                        rootPropertyName,
                        propName,
                        strings.previousString,
                        context,
                    );
                    attributeBinding = result.binding;
                    rootPropertyName = result.rootPropertyName;
                }

                break;
            }
            default: {
                const propName = innerHTML.slice(
                    behaviorConfig.openingEndIndex,
                    behaviorConfig.closingStartIndex,
                );
                const result = this.resolveAccessBinding(
                    rootPropertyName,
                    propName,
                    strings.previousString,
                    context,
                );
                attributeBinding = result.binding;
                rootPropertyName = result.rootPropertyName;
            }
        }

        values.push(attributeBinding);

        this.resolveInnerHTML(
            rootPropertyName,
            innerHTML.slice(behaviorConfig.closingEndIndex, innerHTML.length),
            strings,
            values,
            context,
        );
    }

    /**
     * Resolve an attribute directive binding (`f-children`, `f-slotted`, `f-ref`).
     */
    private resolveAttributeDirectiveBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: StringsAccumulator,
        values: Array<any>,
        behaviorConfig: AttributeDirectiveBindingBehaviorConfig,
        context: TemplateResolutionContext,
    ): void {
        strings.push(
            innerHTML.slice(
                0,
                behaviorConfig.openingStartIndex - behaviorConfig.name.length - 4,
            ),
        );
        const propName = innerHTML.slice(
            behaviorConfig.openingEndIndex,
            behaviorConfig.closingStartIndex,
        );
        this.resolveAttributeDirective(behaviorConfig.name, propName, values);
        this.resolveInnerHTML(
            rootPropertyName,
            innerHTML.slice(behaviorConfig.closingEndIndex + 1, innerHTML.length),
            strings,
            values,
            context,
        );
    }

    /**
     * Dispatcher for data binding resolution. Routes to the appropriate handler
     * based on the binding subtype.
     */
    private resolveDataBinding(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: StringsAccumulator,
        values: Array<any>,
        behaviorConfig: DataBindingBehaviorConfig,
        context: TemplateResolutionContext,
    ): void {
        switch (behaviorConfig.subtype) {
            case "content":
                this.resolveContentBinding(
                    rootPropertyName,
                    innerHTML,
                    strings,
                    values,
                    behaviorConfig,
                    context,
                );
                break;
            case "attribute":
                this.resolveAttributeBinding(
                    rootPropertyName,
                    innerHTML,
                    strings,
                    values,
                    behaviorConfig,
                    context,
                );
                break;
            case "attributeDirective":
                this.resolveAttributeDirectiveBinding(
                    rootPropertyName,
                    innerHTML,
                    strings,
                    values,
                    behaviorConfig,
                    context,
                );
                break;
        }
    }

    /**
     * Resolver of the innerHTML string. Finds the next binding or directive
     * in the HTML and dispatches to the appropriate handler.
     * @param rootPropertyName - The root property name for schema registration.
     * @param innerHTML - The innerHTML to parse.
     * @param strings - Accumulator for literal HTML segments and running previous-string.
     * @param values - The values array (accumulates binding functions and directives).
     * @param context - The template resolution context.
     */
    private resolveInnerHTML(
        rootPropertyName: string | null,
        innerHTML: string,
        strings: StringsAccumulator,
        values: Array<any>,
        context: TemplateResolutionContext,
    ): void {
        const behaviorConfig = getNextBehavior(innerHTML);

        if (behaviorConfig === null) {
            strings.push(innerHTML);
        } else {
            switch (behaviorConfig.type) {
                case "dataBinding": {
                    this.resolveDataBinding(
                        rootPropertyName,
                        innerHTML,
                        strings,
                        values,
                        behaviorConfig,
                        context,
                    );

                    break;
                }
                case "templateDirective": {
                    strings.push(innerHTML.slice(0, behaviorConfig.openingTagStartIndex));
                    this.resolveTemplateDirective(
                        rootPropertyName,
                        behaviorConfig,
                        values,
                        innerHTML,
                        context,
                    );

                    this.resolveInnerHTML(
                        rootPropertyName,
                        innerHTML.slice(
                            behaviorConfig.closingTagEndIndex,
                            innerHTML.length,
                        ),
                        strings,
                        values,
                        context,
                    );

                    break;
                }
            }
        }
    }
}
