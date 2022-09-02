import {
    Behavior,
    CaptureType,
    ContentTemplate,
    ContentView,
    html,
    HTMLDirective,
    Markup,
    normalizeBinding,
    Notifier,
    Subscriber,
    SyntheticViewTemplate,
    ViewBehaviorFactory,
    ViewTemplate,
} from "../index.js";
import {
    ExecutionContext,
    Expression,
    ExpressionObserver,
    observable,
} from "../observation/observable.js";
import type {
    AddViewBehaviorFactory,
    Binding,
    ViewBehavior,
    ViewBehaviorTargets,
} from "./html-directive.js";

export class AsyncRenderBehavior<TSource = any> implements Behavior, Subscriber {
    @observable
    template: ContentView | null = null;
    templateChanged(prev: null | ContentView, next: null | ContentView) {
        if (this.source === null || this.context === null) {
            return;
        }

        if (!!prev) {
            prev.remove();
            prev.unbind();
        }

        if (!!next) {
            next.bind(this.source, this.context);
            next.insertBefore(this.location);
        }
    }

    private source: TSource | null = null;
    private context: ExecutionContext | null = null;
    private promiseBindingObserver: ExpressionObserver<TSource, Promise<any>>;
    private resolvedBindingObserver: ExpressionObserver<TSource, ContentTemplate>;
    private pendingBindingObserver: ExpressionObserver<TSource, ContentTemplate | null>;
    private rejectedBindingObserver: ExpressionObserver<TSource, ContentTemplate | null>;
    public constructor(private directive: AsyncRenderDirective, private location: Node) {
        this.promiseBindingObserver = this.directive.dataBinding.createObserver(
            directive,
            this
        );
        this.pendingBindingObserver = this.directive.pendingBinding.createObserver(
            directive,
            this
        );
        this.resolvedBindingObserver = this.directive.resolvedBinding.createObserver(
            directive,
            this
        );
        this.rejectedBindingObserver = this.directive.RejectedBinding.createObserver(
            directive,
            this
        );
    }
    bind(source: TSource, context: ExecutionContext<any>): void {
        this.source = source;
        this.context = context;
        const pending = this.pendingBindingObserver.observe(source, context);
        if (pending !== null) {
            this.template = pending.create();
        }
        this.promiseBindingObserver
            .observe(source, context)
            .then(() => {
                this.template = this.resolvedBindingObserver
                    .observe(source, context)
                    .create();
            })
            .catch(() => {
                const rejected = this.rejectedBindingObserver.observe(source, context);
                if (rejected) {
                    this.template = rejected.create();
                }
            });
    }
    unbind(source: TSource, context: ExecutionContext<any>): void {}

    handleChange(subject: any, args: any): void {}
}

class AsyncRenderDirective<TSource = any, TPromise extends Promise<any> = Promise<any>>
    implements HTMLDirective, ViewBehaviorFactory {
    public id: string;
    public nodeId: string;
    public createHTML(add: AddViewBehaviorFactory): string {
        return Markup.comment(add(this));
    }

    public createBehavior(
        targets: ViewBehaviorTargets
    ): Behavior<any, any> | ViewBehavior<any, any> {
        return new AsyncRenderBehavior(this, targets[this.nodeId]);
    }

    constructor(
        public readonly dataBinding: Binding<TSource, TPromise>,
        public readonly resolvedBinding: Binding<TSource, SyntheticViewTemplate>,
        public readonly pendingBinding: Binding<TSource, SyntheticViewTemplate | null>,
        public readonly RejectedBinding: Binding<TSource, SyntheticViewTemplate | null>
    ) {}
}

HTMLDirective.define(AsyncRenderDirective);

const emptyTemplate = () => null;
export function async<TSource = any, TPromise extends Promise<any> = Promise<any>>(
    promise:
        | Expression<TSource, TPromise, ExecutionContext<TSource>>
        | Binding<TSource, TPromise>
        | Promise<any>,
    resolved:
        | Expression<TSource, ViewTemplate>
        | Binding<TSource, ViewTemplate>
        | ViewTemplate,
    pending:
        | Expression<TSource, ViewTemplate | null>
        | Binding<TSource, ViewTemplate | null>
        | ViewTemplate = emptyTemplate,
    rejected:
        | Expression<TSource, ViewTemplate | null>
        | Binding<TSource, ViewTemplate | null>
        | ViewTemplate = emptyTemplate
): CaptureType<TSource> {
    const dataBinding = normalizeBinding(promise);
    const resolvedBinding = normalizeBinding(resolved);
    const pendingBinding = normalizeBinding(pending);
    const rejectedBinding = normalizeBinding(rejected);

    return new AsyncRenderDirective(
        dataBinding,
        resolvedBinding,
        pendingBinding,
        rejectedBinding
    );
}
