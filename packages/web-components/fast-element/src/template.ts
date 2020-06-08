import { compileTemplate } from "./template-compiler";
import { ElementView, HTMLView, SyntheticView } from "./view";
import { DOM } from "./dom";
import { Behavior, BehaviorFactory } from "./directives/behavior";
import { Directive } from "./directives/directive";
import { BindingDirective } from "./directives/binding";
import { defaultExecutionContext, Binding } from "./observation/observable";

/**
 * A template capable of creating views specifically for rendering custom elements.
 * @public
 */
export interface ElementViewTemplate {
    /**
     * Creates an ElementView instance based on this template definition.
     * @param host - The custom element host that this template will be rendered to once created.
     */
    create(host: Element): ElementView;
}

/**
 * A template capable of rendering views not specifically connected to custom elements.
 * @public
 */
export interface SyntheticViewTemplate<TSource = any, TParent = any> {
    /**
     * Creates a SyntheticView instance based on this template definition.
     */
    create(): SyntheticView;
}

/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
export class ViewTemplate<TSource = any, TParent = any>
    implements ElementViewTemplate, SyntheticViewTemplate {
    private behaviorCount: number = 0;
    private hasHostBehaviors: boolean = false;
    private fragment: DocumentFragment | null = null;
    private targetOffset: number = 0;
    private viewBehaviorFactories: BehaviorFactory[] | null = null;
    private hostBehaviorFactories: BehaviorFactory[] | null = null;

    /**
     * The html representing what this template will
     * instantiate, including placeholders for directives.
     */
    public readonly html: string | HTMLTemplateElement;

    /**
     * The directives that will be connected to placeholders in the html.
     */
    public readonly directives: ReadonlyArray<Directive>;

    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param directives - The directives that will be connected to placeholders in the html.
     */
    public constructor(
        html: string | HTMLTemplateElement,
        directives: ReadonlyArray<Directive>
    ) {
        this.html = html;
        this.directives = directives;
    }

    /**
     * Creates an HTMLView instance based on this template definition.
     * @param host - The host element that this template will be rendered to once created.
     */
    public create(host?: Element): HTMLView {
        if (this.fragment === null) {
            let template: HTMLTemplateElement;
            const html = this.html;

            if (typeof html === "string") {
                template = document.createElement("template");
                template.innerHTML = DOM.createHTML(html);

                const fec = template.content.firstElementChild;

                if (fec !== null && fec.tagName === "TEMPLATE") {
                    template = fec as HTMLTemplateElement;
                }
            } else {
                template = html;
            }

            const result = compileTemplate(template, this.directives);

            this.fragment = result.fragment;
            this.viewBehaviorFactories = result.viewBehaviorFactories;
            this.hostBehaviorFactories = result.hostBehaviorFactories;
            this.targetOffset = result.targetOffset;
            this.behaviorCount =
                this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
            this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
        }

        const fragment = this.fragment.cloneNode(true) as DocumentFragment;
        const viewFactories = this.viewBehaviorFactories!;
        const behaviors = new Array<Behavior>(this.behaviorCount);
        const walker = document.createTreeWalker(
            fragment,
            133, // element, text, comment
            null,
            false
        );

        let behaviorIndex = 0;
        let targetIndex = this.targetOffset;
        let node = walker.nextNode();

        for (let ii = viewFactories.length; behaviorIndex < ii; ++behaviorIndex) {
            const factory = viewFactories[behaviorIndex];
            const factoryIndex = factory.targetIndex;

            while (node !== null) {
                if (targetIndex === factoryIndex) {
                    behaviors[behaviorIndex] = factory.createBehavior(node);
                    break;
                } else {
                    node = walker.nextNode();
                    targetIndex++;
                }
            }
        }

        if (this.hasHostBehaviors) {
            const hostFactories = this.hostBehaviorFactories!;

            for (let i = 0, ii = hostFactories.length; i < ii; ++i, ++behaviorIndex) {
                behaviors[behaviorIndex] = hostFactories[i].createBehavior(host!);
            }
        }

        return new HTMLView(fragment, behaviors);
    }

    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The HTMLElement where the template will be rendered.
     */
    public render(source: TSource, host: HTMLElement | string): HTMLView {
        if (typeof host === "string") {
            host = document.getElementById(host)!;
        }

        const view = this.create(host);
        view.bind(source, defaultExecutionContext);
        view.appendTo(host);

        return view;
    }
}

// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex =
    // eslint-disable-next-line no-control-regex
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
/**
 * A marker interface used to capture types when interpolating Directive helpers
 * into templates.
 * @public
 */
export interface CaptureType<TSource> {}

/**
 * Represents the types of values that can be interpolated into a template.
 * @public
 */
export type TemplateValue<TScope, TParent = any> =
    | Binding<TScope, any, TParent>
    | string
    | number
    | Directive
    | CaptureType<TScope>;

/**
 * Transforms a template literal string into a renderable ViewTemplate.
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
    const directives: Directive[] = [];
    let html = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        let value = values[i];

        html += currentString;

        if (value instanceof ViewTemplate) {
            const template = value;
            value = (): ViewTemplate => template;
        }

        if (typeof value === "function") {
            value = new BindingDirective(value as Binding);

            const match = lastAttributeNameRegex.exec(currentString);
            if (match !== null) {
                (value as BindingDirective).targetName = match[2];
            }
        }

        if (value instanceof Directive) {
            // Since not all values are directives, we can't use i
            // as the index for the placeholder. Instead, we need to
            // use directives.length to get the next index.
            html += value.createPlaceholder(directives.length);
            directives.push(value);
        } else {
            html += value;
        }
    }

    html += strings[strings.length - 1];

    return new ViewTemplate(html, directives);
}
