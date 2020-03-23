import { DOM } from "../dom";
import { SyntheticViewTemplate, CaptureType } from "../template";
import { SyntheticView } from "../view";
import { Expression } from "../interfaces";
import { Behavior } from "./behavior";
import {
    Observable,
    GetterInspector,
    inspectAndEvaluate,
} from "../observation/observable";
import { Subscriber } from "../observation/subscriber-collection";
import { Directive } from "./directive";

export class WhenDirective extends Directive {
    createPlaceholder = DOM.createBlockPlaceholder;

    constructor(public expression: Expression, public template: SyntheticViewTemplate) {
        super();
    }

    public createBehavior(target: any) {
        return new WhenBehavior(target, this.expression, this.template);
    }
}

export class WhenBehavior implements Behavior, GetterInspector, Subscriber {
    private view: SyntheticView | null = null;
    private cachedView?: SyntheticView;
    private source: unknown;

    constructor(
        private location: Node,
        private expression: Expression,
        private template: SyntheticViewTemplate
    ) {}

    bind(source: unknown) {
        this.source = source;
        this.updateTarget(
            inspectAndEvaluate<boolean>(this.expression, source, null as any, this)
        );
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
        this.updateTarget(this.expression(this.source, null as any));
    }

    updateTarget(show: boolean) {
        if (show && this.view == null) {
            this.view = this.cachedView || (this.cachedView = this.template.create());
            this.view.bind(this.source);
            this.view.insertBefore(this.location);
        } else if (!show && this.view !== null) {
            // do not dispose, since we may want to use the view again
            this.view.remove();
            this.view.unbind();
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
