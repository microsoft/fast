import { Directive } from "./directive";
import { IExpression } from "../expression";
import { Observable, IGetterInspector } from "../observation/observable";
import { BehaviorType } from "../behaviors/index";

export class BindingDirective extends Directive {
    public targetName?: string;
    public behavior!: BehaviorType;

    constructor(public expression: IExpression) {
        super();
    }

    public evaluate<T = unknown>(scope: unknown): T {
        return this.expression.evaluate(scope) as T;
    }

    public inspectAndEvaluate<T = unknown>(
        scope: unknown,
        inspector: IGetterInspector
    ): T {
        Observable.setInspector(inspector);
        const value = this.expression.evaluate(scope);
        Observable.clearInspector();
        return value as T;
    }
}
