import { Binding } from "../observation/observable";
import { ElementView, HTMLView, SyntheticView } from "./view";
import { HTMLDirective } from "./html-directive";
/**
 * A template capable of creating views specifically for rendering custom elements.
 * @public
 */
export interface ElementViewTemplate {
    /**
     * Creates an ElementView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget: Element): ElementView;
    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(source: any, host: Node, hostBindingTarget?: Element): HTMLView;
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
export declare class ViewTemplate<TSource = any, TParent = any>
    implements ElementViewTemplate, SyntheticViewTemplate {
    private behaviorCount;
    private hasHostBehaviors;
    private fragment;
    private targetOffset;
    private viewBehaviorFactories;
    private hostBehaviorFactories;
    /**
     * The html representing what this template will
     * instantiate, including placeholders for directives.
     */
    readonly html: string | HTMLTemplateElement;
    /**
     * The directives that will be connected to placeholders in the html.
     */
    readonly directives: ReadonlyArray<HTMLDirective>;
    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param directives - The directives that will be connected to placeholders in the html.
     */
    constructor(
        html: string | HTMLTemplateElement,
        directives: ReadonlyArray<HTMLDirective>
    );
    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget?: Element): HTMLView;
    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(source: TSource, host: Node | string, hostBindingTarget?: Element): HTMLView;
}
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
export declare type TemplateValue<TScope, TParent = any> =
    | Binding<TScope, any, TParent>
    | string
    | number
    | HTMLDirective
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
export declare function html<TSource = any, TParent = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent>[]
): ViewTemplate<TSource, TParent>;
