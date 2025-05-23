import { HydrationMarkup, isHydratable } from "../components/hydration.js";
import { ArrayObserver, Sort, Splice } from "../observation/arrays.js";
import type { Notifier, Subscriber } from "../observation/notifier.js";
import { Expression, ExpressionObserver, Observable } from "../observation/observable.js";
import { emptyArray } from "../platform.js";
import type { Binding, BindingDirective } from "../binding/binding.js";
import { normalizeBinding } from "../binding/normalize.js";
import {
    AddViewBehaviorFactory,
    HTMLDirective,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewController,
} from "./html-directive.js";
import { Markup } from "./markup.js";
import type {
    CaptureType,
    HydratableSyntheticViewTemplate,
    SyntheticViewTemplate,
    ViewTemplate,
} from "./template.js";
import { HTMLView, HydrationStage, HydrationView, SyntheticView } from "./view.js";

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
    controller: ViewController
): void {
    view.context.parent = controller.source;
    view.context.parentContext = controller.context;
    view.bind(items[index]);
}

function bindWithPositioning(
    view: SyntheticView,
    items: readonly any[],
    index: number,
    controller: ViewController
): void {
    view.context.parent = controller.source;
    view.context.parentContext = controller.context;
    view.context.length = items.length;
    view.context.index = index;
    view.bind(items[index]);
}

function isCommentNode(node: Node): node is Comment {
    return node.nodeType === Node.COMMENT_NODE;
}

export class HydrationRepeatError extends Error {
    constructor(
        /**
         * The error message
         */
        message: string | undefined,
        public readonly propertyBag: {
            index: number;
            hydrationStage: string;
            itemsLength?: number;
            viewsState: string[];
            viewTemplateString?: string;
            rootNodeContent: string;
        }
    ) {
        super(message);
    }
}
/**
 * A behavior that renders a template for each item in an array.
 * @public
 */
export class RepeatBehavior<TSource = any> implements ViewBehavior, Subscriber {
    private location: Node;
    private controller: ViewController;

    private template: SyntheticViewTemplate;
    private templateBindingObserver: ExpressionObserver<TSource, SyntheticViewTemplate>;
    private items: readonly any[] | null = null;
    private itemsObserver: Notifier | null = null;
    private itemsBindingObserver: ExpressionObserver<TSource, any[]>;
    private bindView: typeof bindWithoutPositioning = bindWithoutPositioning;

    /** @internal */
    public views: SyntheticView[] = [];

    /**
     * Creates an instance of RepeatBehavior.
     * @param location - The location in the DOM to render the repeat.
     * @param dataBinding - The array to render.
     * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
     * @param templateBinding - The template to render for each item.
     * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
     * @param options - Options used to turn on special repeat features.
     */
    public constructor(private directive: RepeatDirective) {
        this.itemsBindingObserver = directive.dataBinding.createObserver(this, directive);
        this.templateBindingObserver = directive.templateBinding.createObserver(
            this,
            directive
        );

        if (directive.options.positioning) {
            this.bindView = bindWithPositioning;
        }
    }

    /**
     * Bind this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    public bind(controller: ViewController): void {
        this.location = controller.targets[this.directive.targetNodeId];
        this.controller = controller;
        this.items = this.itemsBindingObserver.bind(controller);
        this.template = this.templateBindingObserver.bind(controller);
        this.observeItems(true);

        if (
            isHydratable(this.template) &&
            isHydratable(controller) &&
            controller.hydrationStage !== HydrationStage.hydrated
        ) {
            this.hydrateViews(this.template);
        } else {
            this.refreshAllViews();
        }

        controller.onUnbind(this);
    }

    /**
     * Unbinds this behavior.
     */
    public unbind(): void {
        if (this.itemsObserver !== null) {
            this.itemsObserver.unsubscribe(this);
        }

        this.unbindAllViews();
    }

    /**
     * Handles changes in the array, its items, and the repeat template.
     * @param source - The source of the change.
     * @param args - The details about what was changed.
     */
    public handleChange(source: any, args: Splice[] | Sort[] | ExpressionObserver): void {
        if (args === this.itemsBindingObserver) {
            this.items = this.itemsBindingObserver.bind(this.controller);
            this.observeItems();
            this.refreshAllViews();
        } else if (args === this.templateBindingObserver) {
            this.template = this.templateBindingObserver.bind(this.controller);

            this.refreshAllViews(true);
        } else if (!args[0]) {
            return;
        } else if (args[0].reset) {
            this.refreshAllViews();
        } else if (args[0].sorted) {
            this.updateSortedViews(args as Sort[]);
        } else {
            this.updateSplicedViews(args as Splice[]);
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

    private updateSortedViews(sorts: Sort[]): void {
        const views = this.views;

        for (let i = 0, ii = sorts.length; i < ii; ++i) {
            const sortedItems = sorts[i].sorted!.slice();
            const unsortedItems = sortedItems.slice().sort();

            for (let j = 0, jj = sortedItems.length; j < jj; ++j) {
                const sortedIndex: number = sortedItems.find(
                    value => sortedItems[j] === unsortedItems[value]
                ) as number;

                if (sortedIndex !== j) {
                    const removedItems = unsortedItems.splice(sortedIndex, 1);
                    unsortedItems.splice(j, 0, ...removedItems);
                    const neighbor = views[j];
                    const location = neighbor ? neighbor.firstChild : this.location;

                    views[sortedIndex].remove();
                    views[sortedIndex].insertBefore(location);
                    const removedViews = views.splice(sortedIndex, 1);
                    views.splice(j, 0, ...removedViews);
                }
            }
        }
    }

    private updateSplicedViews(splices: Splice[]): void {
        const views = this.views;
        const bindView = this.bindView;
        const items = this.items!;
        const template = this.template;
        const controller = this.controller;
        const recycle: RepeatOptions["recycle"] = this.directive.options.recycle;
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
                bindView(view, items, addIndex, controller);
                view.insertBefore(location);
            }

            if (removedViews[removeIndex]) {
                leftoverViews.push(...removedViews.slice(removeIndex));
            }
        }

        for (let i = leftoverIndex, ii = leftoverViews.length; i < ii; ++i) {
            leftoverViews[i].dispose();
        }

        if (this.directive.options.positioning) {
            for (let i = 0, viewsLength = views.length; i < viewsLength; ++i) {
                const context = views[i].context;
                context.length = viewsLength;
                context.index = i;
            }
        }
    }

    private refreshAllViews(templateChanged: boolean = false): void {
        const items = this.items!;
        const template = this.template;
        const location = this.location;
        const bindView = this.bindView;
        const controller = this.controller;
        let itemsLength = items.length;
        let views = this.views;
        let viewsLength = views.length;

        if (itemsLength === 0 || templateChanged || !this.directive.options.recycle) {
            // all views need to be removed
            HTMLView.disposeContiguousBatch(views);
            viewsLength = 0;
        }

        if (viewsLength === 0) {
            // all views need to be created
            this.views = views = new Array(itemsLength);

            for (let i = 0; i < itemsLength; ++i) {
                const view = template.create();
                bindView(view, items, i, controller);
                views[i] = view;
                view.insertBefore(location);
            }
        } else {
            // attempt to reuse existing views with new data
            let i = 0;

            for (; i < itemsLength; ++i) {
                if (i < viewsLength) {
                    const view = views[i];
                    if (!view) {
                        const serializer = new XMLSerializer();
                        throw new HydrationRepeatError(
                            `View is null or undefined inside "${
                                (this.location.getRootNode() as ShadowRoot).host.nodeName
                            }".`,
                            {
                                index: i,
                                hydrationStage: (this.controller as HydrationView)
                                    .hydrationStage,
                                itemsLength,
                                viewsState: views.map(v => (v ? "hydrated" : "empty")),
                                viewTemplateString: serializer.serializeToString(
                                    (template.create() as any).fragment
                                ),
                                rootNodeContent: serializer.serializeToString(
                                    this.location.getRootNode() as any
                                ),
                            }
                        );
                    }
                    bindView(view, items, i, controller);
                } else {
                    const view = template.create();
                    bindView(view, items, i, controller);
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
            const view = views[i];
            if (!view) {
                const serializer = new XMLSerializer();
                throw new HydrationRepeatError(
                    `View is null or undefined inside "${
                        (this.location.getRootNode() as ShadowRoot).host.nodeName
                    }".`,
                    {
                        index: i,
                        hydrationStage: (this.controller as HydrationView).hydrationStage,
                        viewsState: views.map(v => (v ? "hydrated" : "empty")),
                        rootNodeContent: serializer.serializeToString(
                            this.location.getRootNode() as any
                        ),
                    }
                );
            }
            view.unbind();
        }
    }

    private hydrateViews(template: HydratableSyntheticViewTemplate) {
        if (!this.items) {
            return;
        }

        this.views = new Array(this.items.length);
        let current = this.location.previousSibling;

        while (current !== null) {
            if (!isCommentNode(current)) {
                current = current.previousSibling;
                continue;
            }
            const index = HydrationMarkup.parseRepeatEndMarker(current.data);
            if (index === null) {
                current = current.previousSibling;
                continue;
            }
            current.data = "";
            // end of repeat is the previousSibling of end comment
            const end = current.previousSibling;

            if (!end) {
                throw new Error(
                    `Error when hydrating inside "${
                        (this.location.getRootNode() as ShadowRoot).host.nodeName
                    }": end should never be null.`
                );
            }

            // find start marker
            let start: Node | null = end;
            // How many unmatched end markers we've encountered
            let unmatchedEndMarkers = 0;
            while (start !== null) {
                if (isCommentNode(start)) {
                    if (HydrationMarkup.isRepeatViewEndMarker(start.data)) {
                        unmatchedEndMarkers++;
                    } else if (HydrationMarkup.isRepeatViewStartMarker(start.data)) {
                        if (unmatchedEndMarkers) {
                            unmatchedEndMarkers--;
                        } else {
                            if (
                                HydrationMarkup.parseRepeatStartMarker(start.data) !==
                                index
                            ) {
                                throw new Error(
                                    `Error when hydrating inside "${
                                        (this.location.getRootNode() as ShadowRoot).host
                                            .nodeName
                                    }": Mismatched start and end markers.`
                                );
                            }
                            start.data = "";
                            current = start.previousSibling;
                            // start of repeat content is the nextSibling of start comment
                            start = start.nextSibling!;
                            const view = template.hydrate(start, end);
                            this.views[index] = view;
                            this.bindView(view, this.items, index, this.controller);
                            break;
                        }
                    }
                }
                start = start.previousSibling;
            }
            if (!start) {
                throw new Error(
                    `Error when hydrating inside "${
                        (this.location.getRootNode() as ShadowRoot).host.nodeName
                    }": start should never be null.`
                );
            }
        }
    }
}

/**
 * A directive that configures list rendering.
 * @public
 */
export class RepeatDirective<TSource = any>
    implements HTMLDirective, ViewBehaviorFactory, BindingDirective
{
    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */
    targetNodeId: string;

    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     */
    public createHTML(add: AddViewBehaviorFactory): string {
        return Markup.comment(add(this));
    }

    /**
     * Creates an instance of RepeatDirective.
     * @param dataBinding - The binding that provides the array to render.
     * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
     * @param options - Options used to turn on special repeat features.
     */
    public constructor(
        public readonly dataBinding: Binding<TSource>,
        public readonly templateBinding: Binding<TSource, SyntheticViewTemplate>,
        public readonly options: RepeatOptions
    ) {
        ArrayObserver.enable();
    }

    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    public createBehavior(): RepeatBehavior<TSource> {
        return new RepeatBehavior<TSource>(this);
    }
}

HTMLDirective.define(RepeatDirective);

/**
 * A directive that enables list rendering.
 * @param items - The array to render.
 * @param template - The template or a template binding used obtain a template
 * to render for each item in the array.
 * @param options - Options used to turn on special repeat features.
 * @public
 */
export function repeat<
    TSource = any,
    TArray extends ReadonlyArray<any> = ReadonlyArray<any>,
    TParent = any
>(
    items:
        | Expression<TSource, TArray, TParent>
        | Binding<TSource, TArray, TParent>
        | ReadonlyArray<any>,
    template:
        | Expression<TSource, ViewTemplate<any, TSource>>
        | Binding<TSource, ViewTemplate<any, TSource>>
        | ViewTemplate<any, TSource>,
    options: RepeatOptions = defaultRepeatOptions
): CaptureType<TSource, TParent> {
    const dataBinding = normalizeBinding(items);
    const templateBinding = normalizeBinding(template);
    return new RepeatDirective(dataBinding, templateBinding, {
        ...defaultRepeatOptions,
        ...options,
    }) as any;
}
