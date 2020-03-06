import { Directive } from "./directive";
import { Expression } from "../interfaces";
import { Observable, GetterInspector } from "../observation/observable";
import { BehaviorType } from "../behaviors/index";

const context = {} as any;

export class BindingDirective extends Directive {
    public targetName?: string;
    public behavior!: BehaviorType;

    constructor(public expression: Expression) {
        super();
    }

    public evaluate<T = unknown>(scope: unknown): T {
        return this.expression(scope, context) as T;
    }

    public inspectAndEvaluate<T = unknown>(
        scope: unknown,
        inspector: GetterInspector
    ): T {
        Observable.setInspector(inspector);
        const value = this.expression(scope, context);
        Observable.clearInspector();
        return value as T;
    }
}
