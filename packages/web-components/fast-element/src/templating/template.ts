import { isFunction, isString } from "../interfaces.js";
import type { Expression } from "../observation/observable.js";
import { bind, HTMLBindingDirective, oneTime } from "./binding.js";
import { Compiler } from "./compiler.js";
import {
    AddViewBehaviorFactory,
    Aspect,
    Aspected,
    Binding,
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
 * A template capable of rendering views not specifically connected to custom elements.
 * @public
 */
export interface SyntheticViewTemplate<TSource = any, TParent = any> {
    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView<TSource, TParent>;
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

/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
export class ViewTemplate<TSource = any, TParent = any>
    implements
        ElementViewTemplate<TSource, TParent>,
        SyntheticViewTemplate<TSource, TParent> {
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
    public create(hostBindingTarget?: Element): HTMLView<TSource, TParent> {
        if (this.result === null) {
            this.result = Compiler.compile<TSource, TParent>(this.html, this.factories);
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
        hostBindingTarget?: Element
    ): HTMLView<TSource, TParent> {
        const view = this.create(hostBindingTarget);
        view.bind(source);
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
export type TemplateValue<TSource, TParent = any> =
    | Expression<TSource, any, TParent>
    | Binding<TSource, any, TParent>
    | HTMLDirective
    | CaptureType<TSource>;

function createAspectedHTML(
    value: HTMLDirective & Aspected,
    prevString: string,
    add: AddViewBehaviorFactory
): string {
    const match = lastAttributeNameRegex.exec(prevString);
    if (match !== null) {
        Aspect.assign(value as Aspected, match[2]);
    }

    return value.createHTML(add);
}

/**
 * Transforms a template literal string into a ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export function html<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent>[]
): ViewTemplate<TSource, TParent> {
    let html = "";
    const factories: Record<string, ViewBehaviorFactory> = Object.create(null);
    const add = (factory: ViewBehaviorFactory): string => {
        const id = factory.id ?? (factory.id = nextId());
        factories[id] = factory;
        return id;
    };

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        const currentValue = values[i];
        let definition: HTMLDirectiveDefinition | undefined;

        html += currentString;

        if (isFunction(currentValue)) {
            html += createAspectedHTML(
                new HTMLBindingDirective(bind(currentValue)),
                currentString,
                add
            );
        } else if (isString(currentValue)) {
            const match = lastAttributeNameRegex.exec(currentString);
            if (match !== null) {
                const directive = new HTMLBindingDirective(oneTime(() => currentValue));
                Aspect.assign(directive, match[2]);
                html += directive.createHTML(add);
            } else {
                html += currentValue;
            }
        } else if (currentValue instanceof Binding) {
            html += createAspectedHTML(
                new HTMLBindingDirective(currentValue),
                currentString,
                add
            );
        } else if ((definition = HTMLDirective.getForInstance(currentValue)) === void 0) {
            html += createAspectedHTML(
                new HTMLBindingDirective(oneTime(() => currentValue)),
                currentString,
                add
            );
        } else {
            if (definition.aspected) {
                html += createAspectedHTML(
                    currentValue as HTMLDirective & Aspected,
                    currentString,
                    add
                );
            } else {
                html += (currentValue as HTMLDirective).createHTML(add);
            }
        }
    }

    return new ViewTemplate<TSource, TParent>(
        html + strings[strings.length - 1],
        factories
    );
}
