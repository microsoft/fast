import { Expression } from "../interfaces";
import { SyntheticViewTemplate, CaptureType } from "../template";
import { Behavior } from "./behavior";
import { DOM } from "../dom";
import {
    Observable,
    GetterInspector,
    inspectAndEvaluate,
} from "../observation/observable";
import { SyntheticView } from "../view";
import { Subscriber } from "../observation/subscriber-collection";
import { ArrayObserver, enableArrayObservation } from "../observation/array-observer";
import { Splice } from "../observation/array-change-records";
import { Directive } from "./directive";

export class RepeatDirective extends Directive {
    createPlaceholder = DOM.createBlockPlaceholder;

    constructor(public expression: Expression, public template: SyntheticViewTemplate) {
        super();
        enableArrayObservation();
    }

    public createBehavior(target: any) {
        return new RepeatBehavior(target, this.expression, this.template);
    }
}

export class RepeatBehavior implements Behavior, GetterInspector, Subscriber {
    private location: Node;
    private source: unknown;
    private views: SyntheticView[] = [];
    private items: any[] | null = null;
    private observer?: ArrayObserver;

    constructor(
        marker: HTMLElement,
        private expression: Expression,
        private template: SyntheticViewTemplate
    ) {
        this.location = DOM.convertMarkerToLocation(marker);
    }

    bind(source: unknown) {
        this.source = source;
        this.items = inspectAndEvaluate(this.expression, source, null as any, this);
        this.checkCollectionObserver(false);
        this.refreshAllViews();
    }

    unbind() {
        this.source = null;
        this.items = null;
        this.unbindAllViews();
        this.checkCollectionObserver(true);
    }

    inspect(source: any, propertyName: string) {
        Observable.getNotifier(source).subscribe(this, propertyName);
    }

    handleChange(source: any, args: string | Splice[]): void {
        if (typeof args === "string") {
            this.source = source;
            this.items = inspectAndEvaluate(
                this.expression,
                this.source,
                null as any,
                this
            );
            this.checkCollectionObserver(false);
            this.refreshAllViews();
        } else {
            this.updateViews(args);
        }
    }

    private checkCollectionObserver(fromUnbind: boolean): void {
        const oldObserver = this.observer;
        if (fromUnbind) {
            if (oldObserver !== void 0) {
                oldObserver.removeSubscriber(this);
            }
        } else {
            if (!this.items) {
                this.items = [];
            }

            const newObserver = (this.observer = Observable.getNotifier<ArrayObserver>(
                this.items
            ));

            if (oldObserver !== newObserver && oldObserver) {
                oldObserver.removeSubscriber(this);
            }

            if (newObserver) {
                newObserver.addSubscriber(this);
            }
        }
    }

    private updateViews(splices: Splice[]) {
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
            const view = totalRemoved[i];
            view.remove();
            view.unbind();
        }
    }

    private refreshAllViews() {
        const items = this.items!;
        const views = this.views;
        const viewsLength = views.length;
        const template = this.template;

        let itemsLength = items.length;
        let i = 0;

        for (; i < itemsLength; ++i) {
            if (i < viewsLength) {
                views[i].bind(items[i]);
            } else {
                const view = template.create();
                view.bind(items[i]);
                views.push(view);
                view.insertBefore(this.location);
            }
        }

        const removed = views.splice(i, viewsLength - i);

        for (i = 0, itemsLength = removed.length; i < itemsLength; ++i) {
            const view = removed[i];
            view.remove();
            view.unbind();
        }
    }

    private unbindAllViews() {
        const views = this.views;

        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}

export function repeat<T = any, K = any>(
    expression: Expression<T, K[]>,
    template: SyntheticViewTemplate
): CaptureType<T> {
    return new RepeatDirective(expression, template);
}
