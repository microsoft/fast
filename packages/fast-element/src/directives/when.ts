import { DOM } from "../dom";
import { SyntheticViewTemplate, CaptureType } from "../template";
import { SyntheticView } from "../view";
import { Expression } from "../interfaces";
import { Behavior } from "../behaviors/behavior";
import { Observable, GetterInspector } from "../observation/observable";
import { BindingDirective } from "./bind";
import { Subscriber } from "../observation/subscriber-collection";

export class WhenDirective extends BindingDirective {
    behavior = WhenBehavior;

    constructor(public expression: Expression, public template: SyntheticViewTemplate) {
        super(expression);
    }

    public createPlaceholder(index: number) {
        return DOM.createLocationPlaceholder(index);
    }
}

export class WhenBehavior implements Behavior, GetterInspector, Subscriber {
    private location: Node;
    private view: SyntheticView | null = null;
    private cachedView?: SyntheticView;
    private source: unknown;

    constructor(private directive: WhenDirective, marker: HTMLElement) {
        this.location = DOM.convertMarkerToLocation(marker);
    }

    bind(source: unknown) {
        this.source = source;
        this.updateTarget(this.directive.inspectAndEvaluate<boolean>(source, this));
    }

    unbind() {
        if (this.view !== null) {
            this.view.unbind();
        }

        this.source = null;
    }

    inspect(source: any, propertyName: string) {
        Observable.getNotifier(source).subscribe(this, propertyName);
    }

    handleChange(source: any, propertyName: string): void {
        DOM.queueUpdate(this);
    }

    public call() {
        this.updateTarget(this.directive.evaluate<boolean>(this.source));
    }

    updateTarget(show: boolean) {
        if (show && this.view == null) {
            this.view =
                this.cachedView || (this.cachedView = this.directive.template.create());
            this.view.bind(this.source);
            this.view.insertBefore(this.location);
        } else if (!show && this.view !== null) {
            this.view.unbind();
            this.view.remove();
            this.view = null;
        }
    }
}

export function when<T = any, K = any>(
    expression: Expression<T, K>,
    template: SyntheticViewTemplate
): CaptureType<T> {
    return new WhenDirective(expression, template);
}
