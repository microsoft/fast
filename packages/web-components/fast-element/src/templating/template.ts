import { isFunction, isString } from "../interfaces.js";
import {
    Binding,
    ChildContext,
    ExecutionContext,
    ItemContext,
} from "../observation/observable.js";
import { bind, HTMLBindingDirective, oneTime } from "./binding.js";
import { Compiler } from "./compiler.js";
import {
    Aspect,
    Aspected,
    HTMLDirective,
    HTMLDirectiveContext,
    HTMLDirectiveDefinition,
    ViewBehaviorFactory,
} from "./html-directive.js";
import { nextId } from "./markup.js";
import type { ElementView, HTMLView, SyntheticView } from "./view.js";

/**
 * A template capable of creating views specifically for rendering custom elements.
 * @public
 */
export interface ElementViewTemplate<TSource = any, TParent = any> {
    type: "element";
    /**
     * Creates an ElementView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget: Element): ElementView<TSource, TParent>;

    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(
        source: TSource,
        host: Node,
        hostBindingTarget?: Element
    ): ElementView<TSource, TParent>;
}

/**
 * A template capable of rendering views not specifically connected to custom elements.
 * @public
 */
export interface SyntheticViewTemplate<
    TSource = any,
    TParent = any,
    TContext extends ExecutionContext<TParent> = ExecutionContext<TParent>
> {
    type: "synthetic";
    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView<TSource, TParent, TContext>;
}

/**
 * A template capable of rendering child views not specifically connected to custom elements.
 * @public
 */
export interface ChildViewTemplate<TSource = any, TParent = any> {
    type: "child";

    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView<TSource, TParent, ChildContext<TParent>>;
}

/**
 * A template capable of rendering item views not specifically connected to custom elements.
 * @public
 */
export interface ItemViewTemplate<TSource = any, TParent = any> {
    type: "item";

    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView<TSource, TParent, ItemContext<TParent>>;
}

/**
 * The result of a template compilation operation.
 * @public
 */
export interface HTMLTemplateCompilationResult<
    TSource = any,
    TParent = any,
    TContext extends ExecutionContext<TParent> = ExecutionContext<TParent>
> {
    /**
     * Creates a view instance.
     * @param hostBindingTarget - The host binding target for the view.
     */
    createView(hostBindingTarget?: Element): HTMLView<TSource, TParent, TContext>;
}

/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
export class ViewTemplate<
    TSource = any,
    TParent = any,
    TContext extends ExecutionContext<TParent> = ExecutionContext
>
    implements
        ElementViewTemplate<TSource, TParent>,
        SyntheticViewTemplate<TSource, TParent, TContext> {
    private result: HTMLTemplateCompilationResult<
        TSource,
        TParent,
        TContext
    > | null = null;

    /**
     * Used for TypeScript purposes only.
     * Do not sure.
     */
    type: any;

    /**
     * The html representing what this template will
     * instantiate, including placeholders for directives.
     */
    public readonly html: string | HTMLTemplateElement;

    /**
     * The directives that will be connected to placeholders in the html.
     */
    public readonly factories: Record<string, ViewBehaviorFactory>;

    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param factories - The directives that will be connected to placeholders in the html.
     */
    public constructor(
        html: string | HTMLTemplateElement,
        factories: Record<string, ViewBehaviorFactory>
    ) {
        this.html = html;
        this.factories = factories;
    }

    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    public create(hostBindingTarget?: Element): HTMLView<TSource, TParent, TContext> {
        if (this.result === null) {
            this.result = Compiler.compile<TSource, TParent, TContext>(
                this.html,
                this.factories
            );
        }

        return this.result!.createView(hostBindingTarget);
    }

    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    public render(
        source: TSource,
        host: Node,
        hostBindingTarget?: Element,
        context?: TContext
    ): HTMLView<TSource, TParent, TContext> {
        const view = this.create(hostBindingTarget ?? (host as any));
        view.bind(source, context ?? (ExecutionContext.default as TContext));
        view.appendTo(host);
        return view;
    }
}

// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex =
    /* eslint-disable-next-line no-control-regex */
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * A marker interface used to capture types when interpolating Directive helpers
 * into templates.
 * @public
 */
/* eslint-disable-next-line */
export interface CaptureType<TSource> {}

/**
 * Represents the types of values that can be interpolated into a template.
 * @public
 */
export type TemplateValue<
    TSource,
    TParent = any,
    TContext extends ExecutionContext<TParent> = ExecutionContext<TParent>
> = Binding<TSource, any, TContext> | HTMLDirective | CaptureType<TSource>;

/**
 * Transforms a template literal string into a ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export function html<
    TSource = any,
    TParent = any,
    TContext extends ExecutionContext<TParent> = ExecutionContext<TParent>
>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent, TContext>[]
): ViewTemplate<TSource, TParent> {
    let html = "";
    const factories: Record<string, ViewBehaviorFactory> = Object.create(null);
    const ctx: HTMLDirectiveContext = {
        add(factory: ViewBehaviorFactory): string {
            const id = factory.id ?? (factory.id = nextId());
            factories[id] = factory;
            return id;
        },
    };

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        let currentValue = values[i];
        html += currentString;

        // fix mess stuff on Monday
        let definition: HTMLDirectiveDefinition | undefined | null = null;

        if (isFunction(currentValue)) {
            currentValue = bind(currentValue);
            definition = HTMLDirective.getByType(HTMLBindingDirective);
        } else if (
            !isString(currentValue) &&
            (definition = HTMLDirective.getForInstance(currentValue)) === void 0
        ) {
            const capturedValue = currentValue;
            currentValue = bind(() => capturedValue, oneTime);
            definition = HTMLDirective.getByType(HTMLBindingDirective);
        }

        if (definition === null) {
            definition = HTMLDirective.getForInstance(currentValue);
        }

        if (definition !== void 0) {
            if (definition.aspected) {
                const match = lastAttributeNameRegex.exec(currentString);
                if (match !== null) {
                    Aspect.assign(currentValue as Aspected, match[2]);
                }
            }

            // Since not all values are directives, we can't use i
            // as the index for the placeholder. Instead, we need to
            // use directives.length to get the next index.
            html += (currentValue as HTMLDirective).createHTML(ctx);
        } else {
            html += currentValue;
        }
    }

    html += strings[strings.length - 1];

    return new ViewTemplate<TSource, TParent, any>(html, factories);
}

/**
 * Transforms a template literal string into a ChildViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export const child: <TChild = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TChild, TParent, ChildContext<TParent>>[]
) => ChildViewTemplate<TChild, TParent> = html as any;

/**
 * Transforms a template literal string into an ItemViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export const item: <TItem = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TItem, TParent, ItemContext<TParent>>[]
) => ItemViewTemplate<TItem, TParent> = html as any;
