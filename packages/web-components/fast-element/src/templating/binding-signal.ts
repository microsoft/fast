import type {
    ExecutionContext,
    Expression,
    ExpressionObserver,
} from "../observation/observable.js";
import { isString } from "../interfaces.js";
import type { Subscriber } from "../observation/notifier.js";
import type { HTMLBindingDirective } from "./binding.js";
import { Binding } from "./html-directive.js";

const subscribers: Record<
    string,
    undefined | Subscriber | Set<Subscriber>
> = Object.create(null);

export const Signal = Object.freeze({
    subscribe(signal: string, subscriber: Subscriber) {
        const found = subscribers[signal];

        if (found) {
            found instanceof Set
                ? found.add(subscriber)
                : (subscribers[signal] = new Set([found, subscriber]));
        } else {
            subscribers[signal] = subscriber;
        }
    },

    unsubscribe(signal: string, subscriber: Subscriber) {
        const found = subscribers[signal];

        if (found && found instanceof Set) {
            found.delete(subscriber);
        } else {
            subscribers[signal] = void 0;
        }
    },

    /**
     * Sends the specified signal to signaled bindings.
     * @param signal - The signal to send.
     * @public
     */
    send(signal: string): void {
        const found = subscribers[signal];
        if (found) {
            found instanceof Set
                ? found.forEach(x => x.handleChange(this, signal))
                : found.handleChange(this, signal);
        }
    },
});

class SignalObserver<TSource = any, TReturn = any, TParent = any> {
    signal!: string;

    constructor(
        private readonly dataBinding: SignalBinding,
        private readonly subscriber: Subscriber
    ) {}

    observe(source: TSource, context: ExecutionContext<TParent>): TReturn {
        const signal = (this.signal = this.getSignal(source, context));
        Signal.subscribe(signal, this);
        return this.dataBinding.evaluate(source, context);
    }

    dispose() {
        Signal.unsubscribe(this.signal, this);
    }

    handleChange() {
        this.subscriber.handleChange(this.dataBinding.evaluate, this);
    }

    private getSignal(source: any, context: ExecutionContext): string {
        const options = this.dataBinding.options;
        return isString(options) ? options : options(source, context);
    }
}

class SignalBinding<TSource = any, TReturn = any, TParent = any> extends Binding<
    TSource,
    TReturn,
    TParent
> {
    constructor(
        public readonly evaluate: Expression<TSource, TReturn, TParent>,
        public readonly options: any
    ) {
        super();
    }

    createObserver(
        directive: HTMLBindingDirective,
        subscriber: Subscriber
    ): ExpressionObserver<TSource, TReturn, TParent> {
        return new SignalObserver(this, subscriber);
    }
}

/**
 * Creates a signal binding configuration with the supplied options.
 * @param binding - The binding to refresh when signaled.
 * @param options - The signal name or a binding to use to retrieve the signal name.
 * @returns A binding configuration.
 * @public
 */
export function signal<T = any>(
    binding: Expression<T>,
    options: string | Expression<T>
): Binding<T> {
    return new SignalBinding(binding, options);
}
