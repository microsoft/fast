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
import { FAST } from "../platform.js";
import type { HTMLBindingDirective } from "./binding.js";
import { Binding } from "./html-directive.js";

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
     * @param directive - The directive to determine the change event for.
     * @param target - The target element to determine the change event for.
     */
    determineChangeEvent(directive: HTMLBindingDirective, target: HTMLElement): string;
}

let twoWaySettings: TwoWaySettings = {
    determineChangeEvent() {
        return "change";
    },
};

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
    implements ExpressionObserver<TSource, TReturn, TParent> {
    private notifier: ExpressionObserver;

    target!: HTMLElement;
    source!: any;
    context!: ExecutionContext;
    changeEvent: string;

    constructor(
        private directive: HTMLBindingDirective,
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

        this.target.addEventListener(this.changeEvent, this);
        controller.onUnbind(this);

        return this.notifier.bind(controller);
    }

    unbind(controller: ExpressionController<TSource, TParent>): void {
        this.target.removeEventListener(this.changeEvent, this);
    }

    handleChange(subject: any, args: any) {
        this.subscriber.handleChange(this.dataBinding.evaluate, this);
    }

    handleEvent(event: Event): void {
        const directive = this.directive;
        const target = event.currentTarget as HTMLElement;
        const notifier = this.notifier;
        const last = (notifier as any).last as ObservationRecord; // using internal API!!!

        if (!last) {
            FAST.warn(Message.twoWayBindingRequiresObservables);
            return;
        }

        let value;

        switch (directive.aspectType) {
            case 1:
                value = target.getAttribute(directive.targetAspect);
                break;
            case 2:
                value = target.hasAttribute(directive.targetAspect);
                break;
            case 4:
                value = target.innerText;
                break;
            default:
                value = target[directive.targetAspect];
                break;
        }

        last.propertySource[last.propertyName] = this.dataBinding.options.fromView!(
            value
        );
    }
}

class TwoWayBinding<TSource = any, TReturn = any, TParent = any> extends Binding<
    TSource,
    TReturn,
    TParent
> {
    createObserver(
        directive: HTMLBindingDirective,
        subscriber: Subscriber
    ): ExpressionObserver<TSource, TReturn, TParent> {
        return new TwoWayObserver(directive, subscriber, this);
    }
}

/**
 * Creates a default binding.
 * @param expression - The binding to refresh when changed.
 * @param optionsOrChangeEvent - The binding options or the name of the change event to use.
 * @param isBindingVolatile - Indicates whether the binding is volatile or not.
 * @returns A binding.
 * @public
 */
export function twoWay<T = any>(
    expression: Expression<T>,
    optionsOrChangeEvent?: TwoWayBindingOptions | string,
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

    const binding = new TwoWayBinding(expression, isBindingVolatile);
    binding.options = optionsOrChangeEvent;
    return binding;
}
