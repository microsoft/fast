import type { Binding, BindingDirective } from "../binding/binding.js";
import { normalizeBinding } from "../binding/normalize.js";
import { isHydratable } from "../components/hydration.js";
import { getHydrationMarkers } from "../hydration/markers.js";
import { collectHydrationRepeatRanges } from "../hydration/repeat-ranges.js";
import { ArrayObserver, type Sort, type Splice } from "../observation/arrays.js";
import type { Notifier, Subscriber } from "../observation/notifier.js";
import {
    type Expression,
    type ExpressionObserver,
    Observable,
} from "../observation/observable.js";
import { emptyArray } from "../platform.js";
import {
    type AddViewBehaviorFactory,
    HTMLDirective,
    type ViewBehavior,
    type ViewBehaviorFactory,
    type ViewController,
} from "./html-directive.js";
import { HydrationStage, type HydrationView } from "./hydration-view.js";
import { Markup } from "./markup.js";
import type {
    CaptureType,
    HydratableSyntheticViewTemplate,
    SyntheticViewTemplate,
    ViewTemplate,
} from "./template.js";
import { HTMLView, type SyntheticView } from "./view.js";

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
    controller: ViewController,
): void {
    view.context.parent = controller.source;
    view.context.parentContext = controller.context;
    view.bind(items[index]);
}

function bindWithPositioning(
    view: SyntheticView,
    items: readonly any[],
    index: number,
    controller: ViewController,
): void {
    view.context.parent = controller.source;
    view.context.parentContext = controller.context;
    view.context.length = items.length;
    view.context.index = index;
    view.bind(items[index]);
}

function getStableViewIndices(sorted: readonly number[]): number[] {
    const predecessors = new Array<number>(sorted.length);
    const sequence: number[] = [];

    for (let index = 0; index < sorted.length; ++index) {
        const previousIndex = sequence[sequence.length - 1];

        if (previousIndex === void 0 || sorted[previousIndex] < sorted[index]) {
            predecessors[index] = previousIndex ?? -1;
            sequence.push(index);
            continue;
        }

        let start = 0;
        let end = sequence.length;

        while (start < end) {
            const middle = Math.floor((start + end) / 2);

            if (sorted[sequence[middle]] < sorted[index]) {
                start = middle + 1;
                continue;
            }

            end = middle;
        }

        predecessors[index] = start > 0 ? sequence[start - 1] : -1;
        sequence[start] = index;
    }

    let previousIndex = sequence[sequence.length - 1];

    for (let index = sequence.length - 1; index >= 0; --index) {
        sequence[index] = previousIndex;
        previousIndex = predecessors[previousIndex];
    }

    return sequence;
}

function removeNodeRange(first: Node, last: Node): void {
    const parentNode = first.parentNode;

    if (parentNode === null) {
        return;
    }

    let current: Node | null = first;

    while (current !== null) {
        const next = current.nextSibling;
        parentNode.removeChild(current);

        if (current === last) {
            break;
        }

        current = next;
    }
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
        },
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
     * @param directive - The bindings, target, and options for this repeat.
     */
    public constructor(private directive: RepeatDirective) {
        this.itemsBindingObserver = directive.dataBinding.createObserver(this, directive);
        this.templateBindingObserver = directive.templateBinding.createObserver(
            this,
            directive,
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
     * Handles array replacements, batched mutations, and repeat template changes.
     * @param source - The source of the change.
     * @param args - A binding observer, splice records, reorder records, or a reset.
     * @remarks
     * Reset notifications, including mixed mutation batches, refresh all views.
     * Pure reorder and splice batches use their respective reconciliation paths.
     */
    public handleChange(source: any, args: Splice[] | Sort[] | ExpressionObserver): void {
        if (args === this.itemsBindingObserver) {
            const items = this.itemsBindingObserver.bind(this.controller);

            if (items === this.items) {
                return;
            }

            this.items = items;
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

    /**
     * Applies queued permutations while preserving existing item-view associations.
     * @param sorts - Ordered mappings from each new index to its previous index.
     * @remarks
     * Composes the mappings before moving DOM nodes. A longest increasing
     * subsequence of original view positions stays mounted; other views move
     * without rebinding. Positioning contexts refresh when enabled.
     * Bookkeeping takes O(viewCount * sorts.length + viewCount * log(viewCount))
     * time and O(viewCount) auxiliary space, plus the cost of moving nodes.
     */
    private updateSortedViews(sorts: Sort[]): void {
        const views = this.views;
        let sorted = sorts[0].sorted!;

        for (let index = 1; index < sorts.length; ++index) {
            const permutation = sorts[index].sorted!;
            const previous = sorted;
            sorted = new Array<number>(permutation.length);

            for (let viewIndex = 0; viewIndex < permutation.length; ++viewIndex) {
                sorted[viewIndex] = previous[permutation[viewIndex]];
            }
        }

        const previous = views.slice();

        for (let index = 0; index < sorted.length; ++index) {
            views[index] = previous[sorted[index]];
        }

        const stableViewIndices = getStableViewIndices(sorted);
        let stableIndex = stableViewIndices.length - 1;
        let location = this.location;

        for (let index = views.length - 1; index >= 0; --index) {
            const view = views[index];
            const isStable = stableViewIndices[stableIndex] === index;

            if (isStable) {
                stableIndex--;
            }

            if (!isStable && view.lastChild.nextSibling !== location) {
                view.insertBefore(location);
            }

            location = view.firstChild;

            if (this.directive.options.positioning) {
                view.context.length = views.length;
                view.context.index = index;
            }
        }
    }

    /**
     * Applies normalized splices, recycling removed views when enabled.
     * @param splices - Mutation records in ascending index order.
     * @remarks
     * Shifts the view-array tail once per splice before filling the insertion
     * range. Recycling consumes current removals before unused removals from
     * earlier splices. Remaining removed views are disposed after the batch,
     * and positioning contexts refresh when enabled.
     */
    private updateSplicedViews(splices: Splice[]): void {
        const views = this.views;
        const bindView = this.bindView;
        const items = this.items!;
        const template = this.template;
        const controller = this.controller;
        const recycle: RepeatOptions["recycle"] = this.directive.options.recycle;
        const leftoverViews: SyntheticView[] = [];
        let leftoverIndex = 0;

        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            const removedCount = splice.removed.length;
            let removeIndex = 0;
            let addIndex = splice.index;
            const end = addIndex + splice.addedCount;
            const oldLength = views.length;
            const removedViews = views.slice(addIndex, addIndex + removedCount);
            const newLength = oldLength - removedCount + splice.addedCount;
            const offset = splice.addedCount - removedCount;

            if (offset > 0) {
                for (
                    let index = oldLength - 1;
                    index >= addIndex + removedCount;
                    --index
                ) {
                    views[index + offset] = views[index];
                }
            }

            if (offset < 0) {
                for (let index = addIndex + removedCount; index < oldLength; ++index) {
                    views[index + offset] = views[index];
                }
            }

            views.length = newLength;
            const neighbor = views[end];
            const location = neighbor ? neighbor.firstChild : this.location;

            for (; addIndex < end; ++addIndex) {
                let view;

                if (recycle && removeIndex < removedViews.length) {
                    view = removedViews[removeIndex++];
                }

                if (view === void 0 && recycle && leftoverIndex < leftoverViews.length) {
                    view = leftoverViews[leftoverIndex++];
                }

                if (view === void 0) {
                    view = template.create();
                }

                views[addIndex] = view;
                bindView(view, items, addIndex, controller);
                view.insertBefore(location);
            }

            for (; removeIndex < removedViews.length; ++removeIndex) {
                leftoverViews.push(removedViews[removeIndex]);
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
                                    (template.create() as any).fragment,
                                ),
                                rootNodeContent: serializer.serializeToString(
                                    this.location.getRootNode() as any,
                                ),
                            },
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
                            this.location.getRootNode() as any,
                        ),
                    },
                );
            }
            view.unbind();
        }
    }

    private hydrateViews(template: HydratableSyntheticViewTemplate) {
        if (!this.items) {
            return;
        }

        const items = this.items;
        const itemCount = items.length;
        const views = (this.views = new Array(itemCount));
        const markers = getHydrationMarkers();

        // Do not scan an earlier adjacent repeat's prefix.
        const boundaries = (this.controller as HydrationView).bindingViewBoundaries[
            this.directive.targetNodeId
        ];
        const itemRanges = collectHydrationRepeatRanges(
            boundaries?.first ?? this.location,
            this.location,
            markers,
        );

        // Nested ranges still belong to the child views that will hydrate below.
        for (const { startMarker, endMarker } of itemRanges) {
            startMarker.data = "";
            endMarker.data = "";
        }

        // Hydrate each SSR item at its correct index (0-based from start).
        const hydrationCount = Math.min(itemRanges.length, itemCount);

        for (let i = 0; i < hydrationCount; i++) {
            const { start, end } = itemRanges[i];
            const view = template.hydrate(start, end);
            views[i] = view;
            this.bindView(view, items, i, this.controller);
        }

        for (let i = hydrationCount; i < itemCount; i++) {
            const view = template.create();
            views[i] = view;
            this.bindView(view, items, i, this.controller);
            view.insertBefore(this.location);
        }

        for (let i = itemCount, ii = itemRanges.length; i < ii; i++) {
            const { startMarker, endMarker } = itemRanges[i];
            removeNodeRange(startMarker, endMarker);
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
        public readonly options: RepeatOptions,
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
    TParent = any,
>(
    items:
        | Expression<TSource, TArray, TParent>
        | Binding<TSource, TArray, TParent>
        | ReadonlyArray<any>,
    template:
        | Expression<TSource, ViewTemplate<any, TSource>>
        | Binding<TSource, ViewTemplate<any, TSource>>
        | ViewTemplate<any, TSource>,
    options: RepeatOptions = defaultRepeatOptions,
): CaptureType<TSource, TParent> {
    const dataBinding = normalizeBinding(items);
    const templateBinding = normalizeBinding(template);
    return new RepeatDirective(dataBinding, templateBinding, {
        ...defaultRepeatOptions,
        ...options,
    }) as any;
}
