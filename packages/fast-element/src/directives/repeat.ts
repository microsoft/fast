import { AccessScopeExpression, IExpression, Getter } from "../expression";
import { ITemplate, ICaptureType } from "../template";
import { IBehavior } from "../behaviors/behavior";
import { DOM } from "../dom";
import {
    IPropertyChangeListener,
    Observable,
    IGetterInspector,
} from "../observation/observable";
import { BindingDirective } from "./bind";
import { ISyntheticView } from "../view";
import {
    synchronizeIndices,
    applyMutationsToIndices,
    ArrayObserver,
    enableArrayObservation,
    IndexMap,
} from "../observation/array-observer";

export class RepeatDirective extends BindingDirective {
    behavior = RepeatBehavior;

    constructor(public expression: IExpression, public template: ITemplate) {
        super(expression);
        enableArrayObservation();
    }

    public createPlaceholder(index: number) {
        return DOM.createLocationPlaceholder(index);
    }
}

export class RepeatBehavior
    implements IBehavior, IGetterInspector, IPropertyChangeListener {
    private location: Node;
    private source: unknown;
    private views: ISyntheticView[] = [];
    private items: any[] | null = null;
    private observer?: ArrayObserver;
    private indexMap?: IndexMap;

    constructor(private directive: RepeatDirective, marker: HTMLElement) {
        this.location = DOM.convertMarkerToLocation(marker);
    }

    bind(source: unknown) {
        this.source = source;
        this.items = this.directive.inspectAndEvaluate(source, this);

        // bind
        this.checkCollectionObserver(false);
        this.processViewsKeyed(void 0);

        // attach
        this.attachViews(void 0);
    }

    unbind() {
        this.source = null;
        this.items = null;

        // detach
        this.detachViewsByRange(0, this.views.length);

        // unbind
        this.checkCollectionObserver(true);
        this.unbindAndRemoveViewsByRange(0, this.views.length, false);
    }

    inspect(source: any, propertyName: string) {
        Observable.getNotifier(source).addPropertyChangeListener(propertyName, this);
    }

    onPropertyChanged(source: any, propertyName: any): void {
        if (typeof propertyName === "string") {
            this.source = source;
        } else {
            this.indexMap = propertyName;
        }

        DOM.queueUpdate(this);
    }

    public call() {
        if (this.indexMap === void 0) {
            this.items = this.directive.inspectAndEvaluate(this.source, this);
            this.checkCollectionObserver(false);
            this.processViewsKeyed(void 0);
        } else {
            const indexMap = this.indexMap;
            this.indexMap = void 0;
            this.processViewsKeyed(indexMap);
        }
    }

    private processViewsKeyed(indexMap: IndexMap | undefined): void {
        const oldLength = this.views.length;
        if (indexMap === void 0) {
            this.detachViewsByRange(0, oldLength);
            this.unbindAndRemoveViewsByRange(0, oldLength, false);
            this.createAndBindAllViews();
            this.attachViewsKeyed();
        } else {
            applyMutationsToIndices(indexMap);

            // first detach+unbind+(remove from array) the deleted view indices
            if (indexMap.deletedItems.length > 0) {
                indexMap.deletedItems.sort(compareNumber);
                this.detachViewsByKey(indexMap);
                this.unbindAndRemoveViewsByKey(indexMap);
            }

            // then insert new views at the "added" indices to bring the views array in aligment with indexMap size
            this.createAndBindNewViewsByKey(indexMap);
            this.sortViewsByKey(oldLength, indexMap);
        }
    }

    private checkCollectionObserver(fromUnbind: boolean): void {
        const oldObserver = this.observer;
        if (fromUnbind) {
            if (oldObserver !== void 0) {
                oldObserver.removePropertyChangeListener("", this);
            }
        } else {
            if (!this.items) {
                this.items = [];
            }

            const newObserver = (this.observer = Observable.getNotifier<ArrayObserver>(
                this.items
            ));

            if (oldObserver !== newObserver && oldObserver) {
                oldObserver.removePropertyChangeListener("", this);
            }

            if (newObserver) {
                newObserver.addPropertyChangeListener("", this);
            }
        }
    }

    private detachViewsByRange(iStart: number, iEnd: number): void {
        const views = this.views;
        let view: ISyntheticView;
        for (let i = iStart; i < iEnd; ++i) {
            view = views[i];
            view.remove();
        }
    }

    private unbindAndRemoveViewsByRange(
        iStart: number,
        iEnd: number,
        adjustLength: boolean
    ): void {
        const views = this.views;
        let view: ISyntheticView;
        for (let i = iStart; i < iEnd; ++i) {
            view = views[i];
            view.unbind();
        }

        if (adjustLength) {
            this.views.length = iStart;
        }
    }

    private detachViewsByKey(indexMap: IndexMap): void {
        const views = this.views;
        const deleted = indexMap.deletedItems;
        const deletedLen = deleted.length;
        let view: ISyntheticView;
        for (let i = 0; i < deletedLen; ++i) {
            view = views[deleted[i]];
            view.remove();
        }
    }

    private unbindAndRemoveViewsByKey(indexMap: IndexMap): void {
        const views = this.views;
        const deleted = indexMap.deletedItems;
        const deletedLen = deleted.length;
        let view: ISyntheticView;
        let i = 0;
        for (; i < deletedLen; ++i) {
            view = views[deleted[i]];
            view.unbind();
        }

        i = 0;
        let j = 0;
        for (; i < deletedLen; ++i) {
            j = deleted[i] - i;
            this.views.splice(j, 1);
        }
    }

    private createAndBindAllViews(): void {
        let view: ISyntheticView;
        const factory = this.directive.template;
        const items = this.items;
        const newLen = this.items!.length;
        const views = (this.views = Array(newLen));

        for (let i = 0; i < newLen; ++i) {
            view = views[i] = factory.create(true)!;
            view.bind(items![i]);
        }
    }

    private createAndBindNewViewsByKey(indexMap: IndexMap): void {
        let view: ISyntheticView;
        const factory = this.directive.template;
        const views = this.views;
        const mapLen = indexMap.length;
        const items = this.items;

        for (let i = 0; i < mapLen; ++i) {
            if (indexMap[i] === -2) {
                view = factory.create(true)!;
                view.bind(items![i]);
                views.splice(i, 0, view);
            }
        }

        if (views.length !== mapLen) {
            throw new Error(`viewsLen=${views.length}, mapLen=${mapLen}`);
        }
    }

    private attachViews(indexMap: IndexMap | undefined): void {
        let view: ISyntheticView;

        const views = this.views;
        const location = this.location;

        if (indexMap === void 0) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                view = views[i];
                view.insertBefore(location);
            }
        } else {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                if (indexMap[i] !== i) {
                    view = views[i];
                    view.insertBefore(location);
                }
            }
        }
    }

    private attachViewsKeyed(): void {
        let view: ISyntheticView;
        const { views, location } = this;
        for (let i = 0, ii = views.length; i < ii; ++i) {
            view = views[i];
            view.insertBefore(location);
        }
    }

    private sortViewsByKey(oldLength: number, indexMap: IndexMap): void {
        // TODO: integrate with tasks
        const location = this.location;
        const views = this.views;
        const newLen = indexMap.length;
        synchronizeIndices(views, indexMap);

        // this algorithm retrieves the indices of the longest increasing subsequence of items in the repeater
        // the items on those indices are not moved; this minimizes the number of DOM operations that need to be performed
        const seq = longestIncreasingSubsequence(indexMap);
        const seqLen = seq.length;

        let next: ISyntheticView;
        let j = seqLen - 1;
        let i = newLen - 1;
        let view: ISyntheticView;
        for (; i >= 0; --i) {
            view = views[i];
            if (indexMap[i] === -2) {
                view.insertBefore(location);
            } else if (j < 0 || seqLen === 1 || i !== seq[j]) {
                // view.attach();
            } else {
                --j;
            }

            next = views[i + 1];
            if (next !== void 0) {
                // view.nodes!.link(next.nodes);
            } else {
                // view.nodes!.link(location);
            }
        }
    }
}

let maxLen = 16;
let prevIndices = new Int32Array(maxLen);
let tailIndices = new Int32Array(maxLen);

// Based on inferno's lis_algorithm @ https://github.com/infernojs/inferno/blob/master/packages/inferno/src/DOM/patching.ts#L732
// with some tweaks to make it just a bit faster + account for IndexMap (and some names changes for readability)
function longestIncreasingSubsequence(indexMap: IndexMap): Int32Array {
    const len = indexMap.length;

    if (len > maxLen) {
        maxLen = len;
        prevIndices = new Int32Array(len);
        tailIndices = new Int32Array(len);
    }

    let cursor = 0;
    let cur = 0;
    let prev = 0;
    let i = 0;
    let j = 0;
    let low = 0;
    let high = 0;
    let mid = 0;

    for (; i < len; i++) {
        cur = indexMap[i];
        if (cur !== -2) {
            j = prevIndices[cursor];

            prev = indexMap[j];
            if (prev !== -2 && prev < cur) {
                tailIndices[i] = j;
                prevIndices[++cursor] = i;
                continue;
            }

            low = 0;
            high = cursor;

            while (low < high) {
                mid = (low + high) >> 1;
                prev = indexMap[prevIndices[mid]];
                if (prev !== -2 && prev < cur) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }

            prev = indexMap[prevIndices[low]];
            if (cur < prev || prev === -2) {
                if (low > 0) {
                    tailIndices[i] = prevIndices[low - 1];
                }
                prevIndices[low] = i;
            }
        }
    }
    i = ++cursor;
    const result = new Int32Array(i);
    cur = prevIndices[cursor - 1];

    while (cursor-- > 0) {
        result[cursor] = cur;
        cur = tailIndices[cur];
    }
    while (i-- > 0) prevIndices[i] = 0;
    return result;
}

function compareNumber(a: number, b: number): number {
    return a - b;
}

export function repeat<T = any, K = any>(
    expression: Getter<T, K[]> | keyof T,
    template: ITemplate
): ICaptureType<T> {
    return new RepeatDirective(AccessScopeExpression.from(expression as any), template);
}
