import { Directive } from "./directive";
import { IExpressionSource, AccessScopeExpression, IExpression, Getter } from "../ast";
import { Observable, IGetterInspector } from "../observation/observable";
import { BehaviorType } from "../behaviors/index";

export class BindingDirective extends Directive implements IExpressionSource {
    public targetName?: string;
    public behavior!: BehaviorType;

    constructor(public expression: IExpression) {
        super();
    }

    public getExpression() {
        return this.expression;
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

export function bind<T = any, K = any>(expression: Getter<T, K> | keyof T) {
    return new BindingDirective(AccessScopeExpression.from(expression as any));
}
