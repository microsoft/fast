import { DOM } from "../dom";
import { Binding, defaultExecutionContext } from "../observation/observable";
import { compileTemplate } from "./compiler";
import type { HTMLTemplateCompilationResult } from "./compiler";
import { ElementView, HTMLView, SyntheticView } from "./view";
import { HTMLDirective, AspectedHTMLDirective } from "./html-directive";
import { bind, oneTime } from "./binding";
import { isFunction, isString } from "../interfaces";

/**
 * A template capable of creating views specifically for rendering custom elements.
 * @public
 */
export interface ElementViewTemplate<TSource = any, TParent = any, TGrandparent = any> {
    /**
     * Creates an ElementView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget: Element): ElementView<TSource, TParent, TGrandparent>;

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
    ): HTMLView<TSource, TParent, TGrandparent>;
}

/**
 * A template capable of rendering views not specifically connected to custom elements.
 * @public
 */
export interface SyntheticViewTemplate<TSource = any, TParent = any, TGrandparent = any> {
    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView<TSource, TParent, TGrandparent>;
}

/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
export class ViewTemplate<TSource = any, TParent = any, TGrandparent = any>
    implements
        ElementViewTemplate<TSource, TParent, TGrandparent>,
        SyntheticViewTemplate<TSource, TParent, TGrandparent> {
    private result: HTMLTemplateCompilationResult | null = null;

    /**
     * The html representing what this template will
     * instantiate, including placeholders for directives.
     */
    public readonly html: string | HTMLTemplateElement;

    /**
     * The directives that will be connected to placeholders in the html.
     */
    public readonly directives: ReadonlyArray<HTMLDirective>;

    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param directives - The directives that will be connected to placeholders in the html.
     */
    public constructor(
        html: string | HTMLTemplateElement,
        directives: ReadonlyArray<HTMLDirective>
    ) {
        this.html = html;
        this.directives = directives;
    }

    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    public create(hostBindingTarget?: Element): HTMLView<TSource, TParent, TGrandparent> {
        if (this.result === null) {
            let template: HTMLTemplateElement;
            const html = this.html;

            if (isString(html)) {
                template = document.createElement("template");
                template.innerHTML = DOM.createHTML(html);

                const fec = template.content.firstElementChild;

                if (fec !== null && fec.tagName === "TEMPLATE") {
                    template = fec as HTMLTemplateElement;
                }
            } else {
                template = html;
            }

            this.result = compileTemplate(template, this.directives);
        }

        const result = this.result;
        const fragment = result.fragment.cloneNode(true) as DocumentFragment;

        return new HTMLView<TSource, TParent, TGrandparent>(
            fragment,
            result.factories,
            result.createTargets(fragment, hostBindingTarget)
        );
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
    ): HTMLView<TSource, TParent, TGrandparent> {
        const view = this.create(hostBindingTarget ?? (host as any));
        view.bind(source, defaultExecutionContext);
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
    | Binding<TSource, any, TParent>
    | HTMLDirective
    | CaptureType<TSource>;

/**
 * Transforms a template literal string into a renderable ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
export function html<TSource = any, TParent = any, TGrandparent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent>[]
): ViewTemplate<TSource, TParent, TGrandparent> {
    const directives: HTMLDirective[] = [];
    let html = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        let currentValue = values[i];
        html += currentString;

        if (isFunction(currentValue)) {
            currentValue = bind(currentValue as Binding);
        } else if (!isString(currentValue) && !(currentValue instanceof HTMLDirective)) {
            const capturedValue = currentValue;
            currentValue = bind(() => capturedValue, oneTime);
        }

        if (currentValue instanceof HTMLDirective) {
            if (currentValue instanceof AspectedHTMLDirective) {
                const match = lastAttributeNameRegex.exec(currentString);
                if (match !== null) {
                    currentValue.setAspect(match[2]);
                }
            }

            // Since not all values are directives, we can't use i
            // as the index for the placeholder. Instead, we need to
            // use directives.length to get the next index.
            html += currentValue.createPlaceholder(directives.length);
            directives.push(currentValue);
        } else {
            html += currentValue;
        }
    }

    html += strings[strings.length - 1];

    return new ViewTemplate<TSource, TParent, TGrandparent>(html, directives);
}
