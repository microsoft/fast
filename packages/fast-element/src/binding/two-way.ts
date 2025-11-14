import type { DOMPolicy } from "../dom.js";
import { isString, Message } from "../interfaces.js";
import type { Subscriber } from "../observation/notifier.js";
import {
    ExecutionContext,
    Expression,
    ExpressionController,
    ExpressionObserver,
    Observable,
    ObservationRecord,
} from "../observation/observable.js";
import { FAST, makeSerializationNoop } from "../platform.js";
import { Binding, BindingDirective } from "./binding.js";

/**
 * The twoWay binding options.
 * @public
 */
export type TwoWayBindingOptions = {
    changeEvent?: string;
    fromView?: (value: any) => any;
};

const defaultOptions: TwoWayBindingOptions = {
    fromView: v => v,
};

/**
 * The settings required to enable two-way binding.
 * @public
 */
export interface TwoWaySettings {
    /**
     * Determines which event to listen to, to detect changes in the view.
     * @param bindingSource - The directive to determine the change event for.
     * @param target - The target element to determine the change event for.
     */
    determineChangeEvent(bindingSource: BindingDirective, target: HTMLElement): string;
}

let twoWaySettings: TwoWaySettings = {
    determineChangeEvent() {
        return "change";
    },
};

/**
 * Enables configuring two-way binding settings.
 */
export const TwoWaySettings = Object.freeze({
    /**
     * Configures two-way binding.
     * @param settings - The settings to use for the two-way binding system.
     */
    configure(settings: TwoWaySettings) {
        twoWaySettings = settings;
    },
});

class TwoWayObserver<TSource = any, TReturn = any, TParent = any>
    implements ExpressionObserver<TSource, TReturn, TParent>
{
    private notifier: ExpressionObserver;
    private isNotBound = true;

    target!: HTMLElement;
    source!: any;
    context!: ExecutionContext;
    changeEvent: string;

    constructor(
        private directive: BindingDirective,
        private subscriber: Subscriber,
        private dataBinding: TwoWayBinding
    ) {
        this.notifier = Observable.binding(
            dataBinding.evaluate,
            this,
            dataBinding.isVolatile
        );
    }

    bind(controller: ExpressionController<TSource, TParent>): TReturn {
        if (!this.changeEvent) {
            this.changeEvent =
                this.dataBinding.options.changeEvent ??
                twoWaySettings.determineChangeEvent(this.directive, this.target);
        }

        if (this.isNotBound) {
            this.target.addEventListener(this.changeEvent, this);
            controller.onUnbind(this);
            this.isNotBound = false;
        }

        return this.notifier.bind(controller);
    }

    unbind(controller: ExpressionController<TSource, TParent>): void {
        this.isNotBound = true;
        this.target.removeEventListener(this.changeEvent, this);
    }

    handleChange(subject: any, args: any) {
        this.subscriber.handleChange(this.dataBinding.evaluate, this);
    }

    handleEvent(event: Event): void {
        const bindingSource = this.directive;
        const target = event.currentTarget as HTMLElement;
        const notifier = this.notifier;
        const last = (notifier as any).last as ObservationRecord; // using internal API!!!

        if (!last) {
            FAST.warn(Message.twoWayBindingRequiresObservables);
            return;
        }

        let value;

        switch (bindingSource.aspectType) {
            case 1:
                value = target.getAttribute(bindingSource.targetAspect!);
                break;
            case 2:
                value = target.hasAttribute(bindingSource.targetAspect!);
                break;
            case 4:
                value = target.innerText;
                break;
            default:
                value = target[bindingSource.targetAspect!];
                break;
        }

        last.propertySource[last.propertyName] =
            this.dataBinding.options.fromView!(value);
    }
}

makeSerializationNoop(TwoWayObserver);

class TwoWayBinding<TSource = any, TReturn = any, TParent = any> extends Binding<
    TSource,
    TReturn,
    TParent
> {
    createObserver(
        subscriber: Subscriber,
        bindingSource: BindingDirective
    ): ExpressionObserver<TSource, TReturn, TParent> {
        return new TwoWayObserver(bindingSource, subscriber, this);
    }
}

/**
 * Creates a default binding.
 * @param expression - The binding to refresh when changed.
 * @param optionsOrChangeEvent - The binding options or the name of the change event to use.
 * @param policy - The security policy to associate with the binding.
 * @param isBindingVolatile - Indicates whether the binding is volatile or not.
 * @returns A binding.
 * @public
 */
export function twoWay<T = any>(
    expression: Expression<T>,
    optionsOrChangeEvent?: TwoWayBindingOptions | string,
    policy?: DOMPolicy,
    isBindingVolatile = Observable.isVolatileBinding(expression)
): Binding<T> {
    if (isString(optionsOrChangeEvent)) {
        optionsOrChangeEvent = { changeEvent: optionsOrChangeEvent };
    }

    if (!optionsOrChangeEvent) {
        optionsOrChangeEvent = defaultOptions;
    } else if (!optionsOrChangeEvent.fromView) {
        optionsOrChangeEvent.fromView = defaultOptions.fromView;
    }

    const binding = new TwoWayBinding(expression, policy, isBindingVolatile);
    binding.options = optionsOrChangeEvent;
    return binding;
}
