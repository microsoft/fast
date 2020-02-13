export interface IExpressionSource {
    getExpression(): IExpression;
}

export interface IEvaluationContext<T = any> {
    event: Event;
    parent: T;
    index: number;
}

export interface IExpression {
    evaluate(scope: unknown, context?: IEvaluationContext): unknown;
}

export type Getter<T = any, K = any> = (model: T, context: IEvaluationContext) => K;

export class AccessScopeExpression<T = any, K = any> implements IExpression {
    constructor(public getter: Getter<T, K>) {}

    public static from<T = any, K = any>(expression: Getter<T, K> | string) {
        if (typeof expression === "string") {
            return new AccessScopeExpression<T, K>(x => (x as any)[expression]);
        }

        return new AccessScopeExpression(expression);
    }

    public evaluate(model: unknown, context?: IEvaluationContext) {
        return this.getter(model as T, context!);
    }
}

export class InterpolationExpression implements IExpression {
    constructor(private parts: (string | Getter)[]) {}

    public evaluate(scope: unknown, context?: IEvaluationContext) {
        return this.parts
            .map(x => (typeof x === "string" ? x : x(scope, context!)))
            .join("");
    }
}
