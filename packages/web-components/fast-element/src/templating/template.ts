import type { DOMPolicy } from "../dom.js";
import { isFunction, isString, Message } from "../interfaces.js";
import { Binding } from "../binding/binding.js";
import type { Expression } from "../observation/observable.js";
import { FAST, makeSerializationNoop } from "../platform.js";
import { oneWay } from "../binding/one-way.js";
import { oneTime } from "../binding/one-time.js";
import { HTMLBindingDirective } from "./html-binding-directive.js";
import { Compiler } from "./compiler.js";
import {
    AddViewBehaviorFactory,
    Aspected,
    CompiledViewBehaviorFactory,
    HTMLDirective,
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
 * A marker interface used to capture types when interpolating Directive helpers
 * into templates.
 * @public
 */
/* eslint-disable-next-line */
export interface CaptureType<TSource, TParent> {}

/**
 * A template capable of rendering views not specifically connected to custom elements.
 * @public
 */
export interface SyntheticViewTemplate<TSource = any, TParent = any> {
    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView<TSource, TParent>;

    /**
     * Returns a directive that can inline the template.
     */
    inline(): CaptureType<TSource, TParent>;
}

/**
 * The result of a template compilation operation.
 * @public
 */
export interface HTMLTemplateCompilationResult<TSource = any, TParent = any> {
    /**
     * Creates a view instance.
     * @param hostBindingTarget - The host binding target for the view.
     */
    createView(hostBindingTarget?: Element): HTMLView<TSource, TParent>;
}

// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex =
    /* eslint-disable-next-line no-control-regex */
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * Represents the types of values that can be interpolated into a template.
 * @public
 */
export type TemplateValue<TSource, TParent = any> =
    | Expression<TSource, any, TParent>
    | Binding<TSource, any, TParent>
    | HTMLDirective
    | CaptureType<TSource, TParent>;

const noFactories = Object.create(null);

/**
 * Inlines a template into another template.
 * @public
 */
export class InlineTemplateDirective implements HTMLDirective {
    /**
     * An empty template partial.
     */
    public static readonly empty = new InlineTemplateDirective("");

    /**
     * Creates an instance of InlineTemplateDirective.
     * @param template - The template to inline.
     */
    public constructor(
        private html: string,
        private factories: Record<string, ViewBehaviorFactory> = noFactories
    ) {}

    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    public createHTML(add: AddViewBehaviorFactory): string {
        const factories = this.factories;

        for (const key in factories) {
            add(factories[key]);
        }

        return this.html;
    }
}

HTMLDirective.define(InlineTemplateDirective);

function createHTML(
    value: HTMLDirective,
    prevString: string,
    add: AddViewBehaviorFactory,
    definition: HTMLDirectiveDefinition = HTMLDirective.getForInstance(value)!
): string {
    if (definition.aspected) {
        const match = lastAttributeNameRegex.exec(prevString);
        if (match !== null) {
            HTMLDirective.assignAspect(value as any as Aspected, match[2]);
        }
    }

    return value.createHTML(add);
}

/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
export class ViewTemplate<TSource = any, TParent = any>
    implements
        ElementViewTemplate<TSource, TParent>,
        SyntheticViewTemplate<TSource, TParent>
{
    private result: HTMLTemplateCompilationResult<TSource, TParent> | null = null;
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
     * @param policy - The security policy to use when compiling this template.
     */
    public constructor(
        html: string | HTMLTemplateElement,
        factories: Record<string, ViewBehaviorFactory> = {},
        private policy?: DOMPolicy
    ) {
        this.html = html;
        this.factories = factories;
    }

    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    public create(hostBindingTarget?: Element): HTMLView<TSource, TParent> {
        if (this.result === null) {
            this.result = Compiler.compile<TSource, TParent>(
                this.html,
                this.factories,
                this.policy
            );
        }

        return this.result.createView(hostBindingTarget);
    }

    /**
     * Returns a directive that can inline the template.
     */
    public inline(): CaptureType<TSource, TParent> {
        return new InlineTemplateDirective(
            isString(this.html) ? this.html : this.html.innerHTML,
            this.factories
        );
    }

    /**
     * Sets the DOMPolicy for this template.
     * @param policy - The policy to associated with this template.
     * @returns The modified template instance.
     * @remarks
     * The DOMPolicy can only be set once for a template and cannot be
     * set after the template is compiled.
     */
    public withPolicy(policy: DOMPolicy): this {
        if (this.result) {
            throw FAST.error(Message.cannotSetTemplatePolicyAfterCompilation);
        }

        if (this.policy) {
            throw FAST.error(Message.onlySetTemplatePolicyOnce);
        }

        this.policy = policy;
        return this;
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
        hostBindingTarget?: Element
    ): HTMLView<TSource, TParent> {
        const view = this.create(hostBindingTarget);
        view.bind(source);
        view.appendTo(host);
        return view;
    }

    /**
     * Creates a template based on a set of static strings and dynamic values.
     * @param strings - The static strings to create the template with.
     * @param values - The dynamic values to create the template with.
     * @param policy - The DOMPolicy to associated with the template.
     * @returns A ViewTemplate.
     * @remarks
     * This API should not be used directly under normal circumstances because constructing
     * a template in this way, if not done properly, can open up the application to XSS
     * attacks. When using this API, provide a strong DOMPolicy that can properly sanitize
     * and also be sure to manually sanitize all static strings particularly if they can
     * come from user input.
     */
    public static create<TSource = any, TParent = any>(
        strings: string[],
        values: TemplateValue<TSource, TParent>[],
        policy?: DOMPolicy
    ): ViewTemplate<TSource, TParent> {
        let html = "";
        const factories: Record<string, ViewBehaviorFactory> = Object.create(null);
        const add = (factory: CompiledViewBehaviorFactory): string => {
            const id = factory.id ?? (factory.id = nextId());
            factories[id] = factory;
            return id;
        };

        for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
            const currentString = strings[i];
            let currentValue = values[i];
            let definition: HTMLDirectiveDefinition | undefined;

            html += currentString;

            if (isFunction(currentValue)) {
                currentValue = new HTMLBindingDirective(oneWay(currentValue));
            } else if (currentValue instanceof Binding) {
                currentValue = new HTMLBindingDirective(currentValue);
            } else if (!(definition = HTMLDirective.getForInstance(currentValue))) {
                const staticValue = currentValue;
                currentValue = new HTMLBindingDirective(oneTime(() => staticValue));
            }

            html += createHTML(
                currentValue as HTMLDirective,
                currentString,
                add,
                definition
            );
        }

        return new ViewTemplate<TSource, TParent>(
            html + strings[strings.length - 1],
            factories,
            policy
        );
    }
}

makeSerializationNoop(ViewTemplate);

/**
 * Transforms a template literal string into a ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export type HTMLTemplateTag = (<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent>[]
) => ViewTemplate<TSource, TParent>) & {
    /**
     * Transforms a template literal string into partial HTML.
     * @param html - The HTML string fragment to interpolate.
     * @public
     */
    partial(html: string): InlineTemplateDirective;
};

/**
 * Transforms a template literal string into a ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export const html: HTMLTemplateTag = (<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent>[]
): ViewTemplate<TSource, TParent> => {
    if (Array.isArray(strings) && Array.isArray(strings.raw)) {
        return ViewTemplate.create(strings as any as string[], values);
    }

    throw FAST.error(Message.directCallToHTMLTagNotAllowed);
}) as any;

html.partial = (html: string): InlineTemplateDirective => {
    return new InlineTemplateDirective(html);
};
