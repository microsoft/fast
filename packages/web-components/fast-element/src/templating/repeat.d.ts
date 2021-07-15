import { Binding, ExecutionContext } from "../observation/observable";
import type { Subscriber } from "../observation/notifier";
import type { Splice } from "../observation/array-change-records";
import type { Behavior } from "../observation/behavior";
import { HTMLDirective } from "./html-directive";
import type { CaptureType, SyntheticViewTemplate } from "./template";
/**
 * Options for configuring repeat behavior.
 * @public
 */
export interface RepeatOptions {
    /**
     * Enables index, length, and dependent positioning updates in item templates.
     */
    positioning: boolean;
}
/**
 * A behavior that renders a template for each item in an array.
 * @public
 */
export declare class RepeatBehavior<TSource = any> implements Behavior, Subscriber {
    private location;
    private itemsBinding;
    private templateBinding;
    private options;
    private source;
    private views;
    private template;
    private templateBindingObserver;
    private items;
    private itemsObserver;
    private itemsBindingObserver;
    private originalContext;
    private childContext;
    private bindView;
    /**
     * Creates an instance of RepeatBehavior.
     * @param location - The location in the DOM to render the repeat.
     * @param itemsBinding - The array to render.
     * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
     * @param templateBinding - The template to render for each item.
     * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(
        location: Node,
        itemsBinding: Binding<TSource, any[]>,
        isItemsBindingVolatile: boolean,
        templateBinding: Binding<TSource, SyntheticViewTemplate>,
        isTemplateBindingVolatile: boolean,
        options: RepeatOptions
    );
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source: TSource, context: ExecutionContext): void;
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind(): void;
    /** @internal */
    handleChange(source: any, args: Splice[]): void;
    private observeItems;
    private updateViews;
    private refreshAllViews;
    private unbindAllViews;
}
/**
 * A directive that configures list rendering.
 * @public
 */
export declare class RepeatDirective<TSource = any> extends HTMLDirective {
    private itemsBinding;
    private templateBinding;
    private options;
    private isItemsBindingVolatile;
    private isTemplateBindingVolatile;
    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    createPlaceholder: (index: number) => string;
    /**
     * Creates an instance of RepeatDirective.
     * @param itemsBinding - The binding that provides the array to render.
     * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(
        itemsBinding: Binding,
        templateBinding: Binding<TSource, SyntheticViewTemplate>,
        options: RepeatOptions
    );
    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    createBehavior(target: Node): RepeatBehavior<TSource>;
}
/**
 * A directive that enables list rendering.
 * @param itemsBinding - The array to render.
 * @param templateOrTemplateBinding - The template or a template binding used obtain a template
 * to render for each item in the array.
 * @param options - Options used to turn on special repeat features.
 * @public
 */
export declare function repeat<TSource = any, TItem = any>(
    itemsBinding: Binding<TSource, readonly TItem[]>,
    templateOrTemplateBinding:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>,
    options?: RepeatOptions
): CaptureType<TSource>;
