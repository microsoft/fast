import type {
    Binding,
    BindingObserver,
    ExecutionContext,
} from "../observation/observable.js";
import { isString } from "../interfaces.js";
import type { Subscriber } from "../observation/notifier.js";
import { BindingConfiguration, HTMLBindingDirective } from "./binding.js";

const subscribers: Record<string, undefined | Subscriber | Subscriber[]> = Object.create(
    null
);

export const Signal = Object.freeze({
    subscribe(signal: string, subscriber: Subscriber) {
        const found = subscribers[signal];

        if (found) {
            Array.isArray(found)
                ? found.push(subscriber)
                : (subscribers[signal] = [found, subscriber]);
        } else {
            subscribers[signal] = subscriber;
        }
    },

    unsubscribe(signal: string, subscriber: Subscriber) {
        const found = subscribers[signal];

        if (found && Array.isArray(found)) {
            const index = found.indexOf(subscriber);
            if (index !== -1) {
                found.splice(index, 1);
            }
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
            Array.isArray(found)
                ? found.forEach(x => x.handleChange(this, signal))
                : found.handleChange(this, signal);
        }
    },
});

class SignalObserver<TSource = any, TReturn = any, TParent = any> {
    signal!: string;

    constructor(
        private readonly expression: SignalBinding,
        private readonly subscriber: Subscriber
    ) {}

    observe(source: TSource, context: ExecutionContext<TParent>): TReturn {
        const signal = (this.signal = this.getSignal(source, context));
        Signal.subscribe(signal, this);
        return this.expression.binding(source, context);
    }

    dispose() {
        Signal.unsubscribe(this.signal, this);
    }

    handleChange() {
        this.subscriber.handleChange(this.expression.binding, this);
    }

    private getSignal(source: any, context: ExecutionContext): string {
        const options = this.expression.options;
        return isString(options) ? options : options(source, context);
    }
}

class SignalBinding<
    TSource = any,
    TReturn = any,
    TParent = any
> extends BindingConfiguration<TSource, TReturn, TParent> {
    constructor(
        public readonly binding: Binding<TSource, TReturn, TParent>,
        public readonly options: any
    ) {
        super();
    }

    createObserver(
        directive: HTMLBindingDirective,
        subscriber: Subscriber
    ): BindingObserver<TSource, TReturn, TParent> {
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
    binding: Binding<T>,
    options: string | Binding<T>
): BindingConfiguration<T> {
    return new SignalBinding(binding, options);
}
