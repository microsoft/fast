import { DOM } from "../dom";
import { SyntheticViewTemplate, CaptureType } from "../template";
import { SyntheticView } from "../view";
import { Expression } from "../interfaces";
import { Behavior } from "./behavior";
import { ObservableExpression } from "../observation/observable";
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

export class WhenBehavior implements Behavior {
    private view: SyntheticView | null = null;
    private cachedView?: SyntheticView;
    private source: unknown;
    private observableExpression: ObservableExpression;

    constructor(
        private location: Node,
        expression: Expression,
        private template: SyntheticViewTemplate
    ) {
        this.observableExpression = new ObservableExpression(expression, this);
    }

    bind(source: unknown) {
        this.source = source;
        this.updateTarget(this.observableExpression.evaluate(source, null as any));
    }

    unbind() {
        if (this.view !== null) {
            this.view.unbind();
        }

        this.observableExpression.dispose();
        this.source = null;
    }

    handleExpressionChange() {
        this.updateTarget(this.observableExpression.evaluate(this.source, null as any));
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
