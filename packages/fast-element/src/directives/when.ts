import { DOM } from "../dom";
import { ITemplate, ICaptureType } from "../template";
import { ISyntheticView } from "../view";
import { IExpression, AccessScopeExpression, Getter } from "../expression";
import { IBehavior } from "../behaviors/behavior";
import {
    IPropertyChangeListener,
    Observable,
    IGetterInspector,
} from "../observation/observable";
import { BindingDirective } from "./bind";

export class WhenDirective extends BindingDirective {
    behavior = WhenBehavior;

    constructor(public expression: IExpression, public template: ITemplate) {
        super(expression);
    }

    public createPlaceholder(index: number) {
        return DOM.createLocationPlaceholder(index);
    }
}

export class WhenBehavior
    implements IBehavior, IGetterInspector, IPropertyChangeListener {
    private location: Node;
    private view: ISyntheticView | null = null;
    private cachedView?: ISyntheticView;
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
        Observable.getNotifier(source).addPropertyChangeListener(propertyName, this);
    }

    onPropertyChanged(source: any, propertyName: string): void {
        DOM.queueUpdate(this);
    }

    public call() {
        this.updateTarget(this.directive.evaluate<boolean>(this.source));
    }

    updateTarget(show: boolean) {
        if (show && this.view == null) {
            this.view =
                this.cachedView ||
                (this.cachedView = this.directive.template.create(true));
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
    expression: Getter<T, K> | keyof T,
    template: ITemplate
): ICaptureType<T> {
    return new WhenDirective(AccessScopeExpression.from(expression as any), template);
}
