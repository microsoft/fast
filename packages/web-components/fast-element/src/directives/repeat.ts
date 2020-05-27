import { CaptureType, SyntheticViewTemplate, ViewTemplate } from "../template";
import { DOM } from "../dom";
import {
    ExecutionContext,
    Expression,
    Observable,
    ComputedObservable,
} from "../observation/observable";
import { HTMLView, SyntheticView } from "../view";
import { Subscriber, Notifier } from "../observation/notifier";
import { enableArrayObservation } from "../observation/array-observer";
import { Splice } from "../observation/array-change-records";
import { Behavior } from "./behavior";
import { Directive } from "./directive";

export interface RepeatOptions {
    positioning: boolean;
}

const defaultRepeatOptions: RepeatOptions = Object.freeze({
    positioning: false,
});

function bindWithoutPositioning(
    view: SyntheticView,
    items: any[],
    index: number,
    context: ExecutionContext
): void {
    view.bind(items[index], context);
}

function bindWithPositioning(
    view: SyntheticView,
    items: any[],
    index: number,
    context: ExecutionContext
): void {
    const childContext = Object.create(context);
    childContext.index = index;
    childContext.length = items.length;
    view.bind(items[index], childContext);
}

export class RepeatBehavior implements Behavior, Subscriber {
    private source: unknown = void 0;
    private views: SyntheticView[] = [];
    private items: any[] | null = null;
    private itemsObserver?: Notifier = void 0;
    private observableExpression: ComputedObservable;
    private originalContext: ExecutionContext | undefined = void 0;
    private childContext: ExecutionContext | undefined = void 0;
    private bindView: typeof bindWithoutPositioning = bindWithoutPositioning;

    constructor(
        private location: Node,
        private expression: Expression,
        private template: SyntheticViewTemplate,
        private options: RepeatOptions
    ) {
        this.observableExpression = Observable.computed(expression);
        this.observableExpression.subscribe(this);

        if (options.positioning) {
            this.bindView = bindWithPositioning;
        }
    }

    bind(source: unknown, context: ExecutionContext): void {
        this.source = source;
        this.originalContext = context;
        this.childContext = Object.create(context);
        this.childContext!.parent = source;

        this.items = this.observableExpression.getValue(source, this.originalContext);
        this.observeItems();
        this.refreshAllViews();
    }

    unbind(): void {
        this.source = null;
        this.items = null;

        if (this.itemsObserver !== void 0) {
            this.itemsObserver.unsubscribe(this);
        }

        this.unbindAllViews();
        this.observableExpression.unwatchExpression();
    }

    handleChange(source: any, args: Splice[]): void {
        if (source === this.expression) {
            this.items = this.observableExpression.getValue(
                this.source,
                this.originalContext!
            );

            this.observeItems();
            this.refreshAllViews();
        } else {
            this.updateViews(args);
        }
    }

    private observeItems(): void {
        if (!this.items) {
            this.items = [];
        }

        const oldObserver = this.itemsObserver;
        const newObserver = (this.itemsObserver = Observable.getNotifier(this.items));

        if (oldObserver !== newObserver) {
            if (oldObserver !== void 0) {
                oldObserver.unsubscribe(this);
            }

            newObserver.subscribe(this);
        }
    }

    private updateViews(splices: Splice[]): void {
        const childContext = this.childContext!;
        const views = this.views;
        const totalRemoved: SyntheticView[] = [];
        const bindView = this.bindView;
        let removeDelta = 0;

        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            const removed = splice.removed;

            totalRemoved.push(
                ...views.splice(splice.index + removeDelta, removed.length)
            );

            removeDelta -= splice.addedCount;
        }

        const items = this.items!;
        const template = this.template;

        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            let addIndex = splice.index;
            const end = addIndex + splice.addedCount;

            for (; addIndex < end; ++addIndex) {
                const neighbor = views[addIndex];
                const location = neighbor ? neighbor.firstChild : this.location;
                const view =
                    totalRemoved.length > 0 ? totalRemoved.shift()! : template.create();

                views.splice(addIndex, 0, view);
                bindView(view, items, addIndex, childContext);
                view.insertBefore(location);
            }
        }

        for (let i = 0, ii = totalRemoved.length; i < ii; ++i) {
            totalRemoved[i].dispose();
        }

        if (this.options.positioning) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                const currentContext = views[i].context!;
                currentContext.length = ii;
                currentContext.index = i;
            }
        }
    }

    private refreshAllViews(): void {
        const items = this.items!;
        const childContext = this.childContext!;
        let itemsLength = items.length;
        let views = this.views;
        const viewsLength = views.length;
        const template = this.template;
        const location = this.location;
        const bindView = this.bindView;

        if (itemsLength === 0) {
            // all views need to be removed
            HTMLView.disposeContiguousBatch(this.views);
            this.views = [];
        } else if (viewsLength === 0) {
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

export class RepeatDirective extends Directive {
    createPlaceholder: (index: number) => string = DOM.createBlockPlaceholder;

    constructor(
        public expression: Expression,
        public template: SyntheticViewTemplate,
        public options: RepeatOptions
    ) {
        super();
        enableArrayObservation();
    }

    public createBehavior(target: any): RepeatBehavior {
        return new RepeatBehavior(target, this.expression, this.template, this.options);
    }
}

export function repeat<TScope = any, TItem = any>(
    expression: Expression<TScope, TItem[]>,
    template: ViewTemplate<Partial<TItem>, TScope>,
    options: RepeatOptions = defaultRepeatOptions
): CaptureType<TScope> {
    return new RepeatDirective(expression, template, options);
}
