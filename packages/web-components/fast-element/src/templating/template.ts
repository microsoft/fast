import { isFunction, isString } from "../interfaces.js";
import { Binding, defaultExecutionContext } from "../observation/observable.js";
import { bind, oneTime } from "./binding.js";
import { compileTemplate as compileFASTTemplate } from "./compiler.js";
import { AspectedHTMLDirective, HTMLDirective } from "./html-directive.js";
import type { ElementView, HTMLView, SyntheticView } from "./view.js";

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
 * The result of a template compilation operation.
 * @public
 */
export interface HTMLTemplateCompilationResult {
    /**
     * Creates a view instance.
     * @param hostBindingTarget - The host binding target for the view.
     */
    createView(hostBindingTarget?: Element): HTMLView;
}

/**
 * A function capable of compiling a template from the preprocessed form produced
 * by the html template function into a result that can instantiate views.
 * @public
 */
export type HTMLTemplateCompiler = (
    /**
     * The preprocessed HTML string or template to compile.
     */
    html: string | HTMLTemplateElement,
    /**
     * The directives used within the html that is being compiled.
     */
    directives: readonly HTMLDirective[]
) => HTMLTemplateCompilationResult;

let compileTemplate: HTMLTemplateCompiler;

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
            this.result = compileTemplate(this.html, this.directives);
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
    ): HTMLView<TSource, TParent, TGrandparent> {
        const view = this.create(hostBindingTarget ?? (host as any));
        view.bind(source, defaultExecutionContext);
        view.appendTo(host);
        return view;
    }

    /**
     * Sets the default compiler that will be used by the ViewTemplate whenever
     * it needs to compile a view preprocessed with the html template function.
     * @param compiler - The compiler to use when compiling templates.
     */
    public static setDefaultCompiler(compiler: HTMLTemplateCompiler): void {
        compileTemplate = compiler;
    }
}

ViewTemplate.setDefaultCompiler(compileFASTTemplate);

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
 * Transforms a template literal string into a ViewTemplate.
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
