import { Expression } from "../interfaces";
import { CaptureType, SyntheticViewTemplate } from "../template";
import { DOM } from "../dom";
import { Observable, ObservableExpression } from "../observation/observable";
import { HTMLView, SyntheticView } from "../view";
import { Subscriber } from "../observation/subscriber-collection";
import { ArrayObserver, enableArrayObservation } from "../observation/array-observer";
import { Splice } from "../observation/array-change-records";
import { Behavior } from "./behavior";
import { Directive } from "./directive";

export class RepeatBehavior implements Behavior, Subscriber {
    private source: unknown = void 0;
    private views: SyntheticView[] = [];
    private items: any[] | null = null;
    private itemsObserver?: ArrayObserver = void 0;
    private observableExpression: ObservableExpression;

    constructor(
        private location: Node,
        expression: Expression,
        private template: SyntheticViewTemplate
    ) {
        this.observableExpression = new ObservableExpression(expression, this);
    }

    bind(source: unknown): void {
        this.source = source;
        this.items = this.observableExpression.evaluate(source, null as any);
        this.observeItems();
        this.refreshAllViews();
    }

    unbind(): void {
        this.source = null;
        this.items = null;

        if (this.itemsObserver !== void 0) {
            this.itemsObserver.removeSubscriber(this);
        }

        this.unbindAllViews();
        this.observableExpression.dispose();
    }

    handleExpressionChange(): void {
        this.items = this.observableExpression.evaluate(this.source, null as any);
        this.observeItems();
        this.refreshAllViews();
    }

    handleChange(source: any, args: Splice[]): void {
        this.updateViews(args);
    }

    private observeItems(): void {
        if (!this.items) {
            this.items = [];
        }

        const oldObserver = this.itemsObserver;
        const newObserver = (this.itemsObserver = Observable.getNotifier<ArrayObserver>(
            this.items
        ));

        if (oldObserver !== newObserver) {
            if (oldObserver !== void 0) {
                oldObserver.removeSubscriber(this);
            }

            newObserver.addSubscriber(this);
        }
    }

    private updateViews(splices: Splice[]): void {
        const views = this.views;
        const totalRemoved: SyntheticView[] = [];
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
                view.bind(items[addIndex]);
                view.insertBefore(location);
            }
        }

        for (let i = 0, ii = totalRemoved.length; i < ii; ++i) {
            totalRemoved[i].dispose();
        }
    }

    private refreshAllViews(): void {
        const items = this.items!;
        let itemsLength = items.length;
        let views = this.views;
        const viewsLength = views.length;
        const template = this.template;
        const location = this.location;

        if (itemsLength === 0) {
            // all views need to be removed
            HTMLView.disposeContiguousBatch(this.views);
            this.views = [];
        } else if (viewsLength === 0) {
            // all views need to be created
            this.views = views = new Array(itemsLength);

            for (let i = 0; i < itemsLength; ++i) {
                const view = template.create();
                view.bind(items[i]);
                views[i] = view;
                view.insertBefore(location);
            }
        } else {
            // attempt to reuse existing views with new data
            let i = 0;

            for (; i < itemsLength; ++i) {
                if (i < viewsLength) {
                    views[i].bind(items[i]);
                } else {
                    const view = template.create();
                    view.bind(items[i]);
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

    constructor(public expression: Expression, public template: SyntheticViewTemplate) {
        super();
        enableArrayObservation();
    }

    public createBehavior(target: any): RepeatBehavior {
        return new RepeatBehavior(target, this.expression, this.template);
    }
}

export function repeat<T = any, K = any>(
    expression: Expression<T, K[]>,
    template: SyntheticViewTemplate
): CaptureType<T> {
    return new RepeatDirective(expression, template);
}
