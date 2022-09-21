import { DOM } from "../dom.js";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
} from "../observation/observable.js";
import type { Notifier, Subscriber } from "../observation/notifier.js";
import { enableArrayObservation } from "../observation/array-observer.js";
import type { Splice } from "../observation/array-change-records.js";
import type { Behavior } from "../observation/behavior.js";
import { emptyArray } from "../platform.js";
import { HTMLDirective } from "./html-directive.js";
import { HTMLView, SyntheticView } from "./view.js";
import type { CaptureType, SyntheticViewTemplate } from "./template.js";

/**
 * Options for configuring repeat behavior.
 * @public
 */
export interface RepeatOptions {
    /**
     * Enables index, length, and dependent positioning updates in item templates.
     */
    positioning?: boolean;

    /**
     * Enables view recycling
     */
    recycle?: boolean;
}

const defaultRepeatOptions: RepeatOptions = Object.freeze({
    positioning: false,
    recycle: true,
});

function bindWithoutPositioning(
    view: SyntheticView,
    items: readonly any[],
    index: number,
    context: ExecutionContext
): void {
    view.bind(items[index], context);
}

function bindWithPositioning(
    view: SyntheticView,
    items: readonly any[],
    index: number,
    context: ExecutionContext
): void {
    const childContext = Object.create(context);
    childContext.index = index;
    childContext.length = items.length;
    view.bind(items[index], childContext);
}

/**
 * A behavior that renders a template for each item in an array.
 * @public
 */
export class RepeatBehavior<TSource = any> implements Behavior, Subscriber {
    private source: TSource | null = null;
    private views: SyntheticView[] = [];
    private template: SyntheticViewTemplate;
    private templateBindingObserver: BindingObserver<TSource, SyntheticViewTemplate>;
    private items: readonly any[] | null = null;
    private itemsObserver: Notifier | null = null;
    private itemsBindingObserver: BindingObserver<TSource, any[]>;
    private originalContext: ExecutionContext | undefined = void 0;
    private childContext: ExecutionContext | undefined = void 0;
    private bindView: typeof bindWithoutPositioning = bindWithoutPositioning;

    /**
     * Creates an instance of RepeatBehavior.
     * @param location - The location in the DOM to render the repeat.
     * @param itemsBinding - The array to render.
     * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
     * @param templateBinding - The template to render for each item.
     * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
     * @param options - Options used to turn on special repeat features.
     */
    public constructor(
        private location: Node,
        private itemsBinding: Binding<TSource, any[]>,
        isItemsBindingVolatile: boolean,
        private templateBinding: Binding<TSource, SyntheticViewTemplate>,
        isTemplateBindingVolatile: boolean,
        private options: RepeatOptions
    ) {
        this.itemsBindingObserver = Observable.binding(
            itemsBinding,
            this,
            isItemsBindingVolatile
        );
        this.templateBindingObserver = Observable.binding(
            templateBinding,
            this,
            isTemplateBindingVolatile
        );

        if (options.positioning) {
            this.bindView = bindWithPositioning;
        }
    }

    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    public bind(source: TSource, context: ExecutionContext): void {
        this.source = source;
        this.originalContext = context;
        this.childContext = Object.create(context);
        this.childContext!.parent = source;
        this.childContext!.parentContext = this.originalContext;

        this.items = this.itemsBindingObserver.observe(source, this.originalContext);
        this.template = this.templateBindingObserver.observe(
            source,
            this.originalContext
        );
        this.observeItems(true);
        this.refreshAllViews();
    }

    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    public unbind(): void {
        this.source = null;
        this.items = null;

        if (this.itemsObserver !== null) {
            this.itemsObserver.unsubscribe(this);
        }

        this.unbindAllViews();
        this.itemsBindingObserver.disconnect();
        this.templateBindingObserver.disconnect();
    }

    /** @internal */
    public handleChange(source: any, args: Splice[]): void {
        if (source === this.itemsBinding) {
            this.items = this.itemsBindingObserver.observe(
                this.source!,
                this.originalContext!
            );
            this.observeItems();
            this.refreshAllViews();
        } else if (source === this.templateBinding) {
            this.template = this.templateBindingObserver.observe(
                this.source!,
                this.originalContext!
            );
            this.refreshAllViews(true);
        } else {
            this.updateViews(args);
        }
    }

    private observeItems(force: boolean = false): void {
        if (!this.items) {
            this.items = emptyArray;
            return;
        }

        const oldObserver = this.itemsObserver;
        const newObserver = (this.itemsObserver = Observable.getNotifier(this.items));
        const hasNewObserver = oldObserver !== newObserver;

        if (hasNewObserver && oldObserver !== null) {
            oldObserver.unsubscribe(this);
        }

        if (hasNewObserver || force) {
            newObserver.subscribe(this);
        }
    }

    private updateViews(splices: Splice[]): void {
        const childContext = this.childContext!;
        const views = this.views;
        const bindView = this.bindView;
        const items = this.items!;
        const template = this.template;
        const recycle: RepeatOptions["recycle"] = this.options.recycle;
        const leftoverViews: SyntheticView[] = [];
        let leftoverIndex = 0;
        let availableViews = 0;

        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            const removed = splice.removed;
            let removeIndex = 0;
            let addIndex = splice.index;
            const end = addIndex + splice.addedCount;
            const removedViews = views.splice(splice.index, removed.length);
            const totalAvailableViews = (availableViews =
                leftoverViews.length + removedViews.length);

            for (; addIndex < end; ++addIndex) {
                const neighbor = views[addIndex];
                const location = neighbor ? neighbor.firstChild : this.location;
                let view;

                if (recycle && availableViews > 0) {
                    if (removeIndex <= totalAvailableViews && removedViews.length > 0) {
                        view = removedViews[removeIndex];
                        removeIndex++;
                    } else {
                        view = leftoverViews[leftoverIndex];
                        leftoverIndex++;
                    }
                    availableViews--;
                } else {
                    view = template.create();
                }

                views.splice(addIndex, 0, view);
                bindView(view, items, addIndex, childContext);
                view.insertBefore(location);
            }

            if (removedViews[removeIndex]) {
                leftoverViews.push(...removedViews.slice(removeIndex));
            }
        }

        for (let i = leftoverIndex, ii = leftoverViews.length; i < ii; ++i) {
            leftoverViews[i].dispose();
        }

        if (this.options.positioning) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                const currentContext = views[i].context!;
                currentContext.length = ii;
                currentContext.index = i;
            }
        }
    }

    private refreshAllViews(templateChanged: boolean = false): void {
        const items = this.items!;
        const childContext = this.childContext!;
        const template = this.template;
        const location = this.location;
        const bindView = this.bindView;
        let itemsLength = items.length;
        let views = this.views;
        let viewsLength = views.length;

        if (itemsLength === 0 || templateChanged || !this.options.recycle) {
            // all views need to be removed
            HTMLView.disposeContiguousBatch(views);
            viewsLength = 0;
        }

        if (viewsLength === 0) {
            // all views need to be created
            this.views = views = new Array(itemsLength);

            for (let i = 0; i < itemsLength; ++i) {
                const view = template.create();
                bindView(view, items, i, childContext);
                views[i] = view;
                view.insertBefore(location);
            }
        } else {
            // attempt to reuse existing views with new data
            let i = 0;

            for (; i < itemsLength; ++i) {
                if (i < viewsLength) {
                    const view = views[i];
                    bindView(view, items, i, childContext);
                } else {
                    const view = template.create();
                    bindView(view, items, i, childContext);
                    views.push(view);
                    view.insertBefore(location);
                }
            }

            const removed = views.splice(i, viewsLength - i);

            for (i = 0, itemsLength = removed.length; i < itemsLength; ++i) {
                removed[i].dispose();
            }
        }
    }

    private unbindAllViews(): void {
        const views = this.views;

        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}

/**
 * A directive that configures list rendering.
 * @public
 */
export class RepeatDirective<TSource = any> extends HTMLDirective {
    private isItemsBindingVolatile: boolean;
    private isTemplateBindingVolatile: boolean;

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public createPlaceholder: (index: number) => string = DOM.createBlockPlaceholder;

    /**
     * Creates an instance of RepeatDirective.
     * @param itemsBinding - The binding that provides the array to render.
     * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
     * @param options - Options used to turn on special repeat features.
     */
    public constructor(
        public readonly itemsBinding: Binding,
        public readonly templateBinding: Binding<TSource, SyntheticViewTemplate>,
        public readonly options: RepeatOptions
    ) {
        super();
        enableArrayObservation();
        this.isItemsBindingVolatile = Observable.isVolatileBinding(itemsBinding);
        this.isTemplateBindingVolatile = Observable.isVolatileBinding(templateBinding);
    }

    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    public createBehavior(target: Node): RepeatBehavior<TSource> {
        return new RepeatBehavior<TSource>(
            target,
            this.itemsBinding,
            this.isItemsBindingVolatile,
            this.templateBinding,
            this.isTemplateBindingVolatile,
            this.options
        );
    }
}

/**
 * A directive that enables list rendering.
 * @param itemsBinding - The array to render.
 * @param templateOrTemplateBinding - The template or a template binding used obtain a template
 * to render for each item in the array.
 * @param options - Options used to turn on special repeat features.
 * @public
 */
export function repeat<TSource = any, TItem = any>(
    itemsBinding: Binding<TSource, readonly TItem[]>,
    templateOrTemplateBinding:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>,
    options: RepeatOptions = defaultRepeatOptions
): CaptureType<TSource> {
    const templateBinding =
        typeof templateOrTemplateBinding === "function"
            ? templateOrTemplateBinding
            : (): SyntheticViewTemplate => templateOrTemplateBinding;

    return new RepeatDirective<TSource>(itemsBinding, templateBinding, {
        ...defaultRepeatOptions,
        ...options,
    });
}
