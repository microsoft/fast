import type {
    Expression,
    ExpressionController,
    ExpressionObserver,
} from "../observation/observable.js";
import { isString, SecurityPolicy } from "../interfaces.js";
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
                ? found.forEach(x => x.handleChange(found, signal))
                : found.handleChange(this, signal);
        }
    },
});

class SignalObserver<TSource = any, TReturn = any, TParent = any> implements Subscriber {
    private isNotBound = true;

    constructor(
        private readonly dataBinding: SignalBinding,
        private readonly subscriber: Subscriber
    ) {}

    bind(controller: ExpressionController<TSource, TParent>): TReturn {
        if (this.isNotBound) {
            Signal.subscribe(this.getSignal(controller), this);
            controller.onUnbind(this);
            this.isNotBound = false;
        }

        return this.dataBinding.evaluate(controller.source, controller.context);
    }

    unbind(controller: ExpressionController<TSource, TParent>) {
        this.isNotBound = true;
        Signal.unsubscribe(this.getSignal(controller), this);
    }

    handleChange() {
        this.subscriber.handleChange(this.dataBinding.evaluate, this);
    }

    private getSignal(controller: ExpressionController<TSource, TParent>): string {
        const options = this.dataBinding.options;
        return isString(options)
            ? options
            : options(controller.source, controller.context);
    }
}

class SignalBinding<TSource = any, TReturn = any, TParent = any> extends Binding<
    TSource,
    TReturn,
    TParent
> {
    createObserver(
        directive: HTMLBindingDirective,
        subscriber: Subscriber
    ): ExpressionObserver<TSource, TReturn, TParent> {
        return new SignalObserver(this, subscriber);
    }
}

/**
 * Creates a signal binding configuration with the supplied options.
 * @param expression - The binding to refresh when signaled.
 * @param options - The signal name or a binding to use to retrieve the signal name.
 * @param policy - The security policy to associate with th binding.
 * @returns A binding configuration.
 * @public
 */
export function signal<T = any>(
    expression: Expression<T>,
    options: string | Expression<T>,
    policy?: SecurityPolicy
): Binding<T> {
    const binding = new SignalBinding(expression, policy);
    binding.options = options;
    return binding;
}
